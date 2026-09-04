import { NextResponse } from "next/server";

/**
 * Public DNS delegation inspector.
 *
 * Reads a domain's public delegation over DNS-over-HTTPS and reports the
 * externally visible signals associated with "Sitting Duck" style hijacks:
 * a parent zone that still delegates to nameservers which no longer serve
 * the zone. Everything here is public record — this only reads what any
 * resolver would return.
 */

const DOH = "https://cloudflare-dns.com/dns-query";

const RR = { A: 1, NS: 2, SOA: 6, MX: 15, AAAA: 28 } as const;

/** RFC 1035 response codes we care about. */
const RCODE: Record<number, string> = {
  0: "NOERROR",
  1: "FORMERR",
  2: "SERVFAIL",
  3: "NXDOMAIN",
  5: "REFUSED",
};

interface DohAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}
interface DohResponse {
  Status: number;
  AD?: boolean;
  Answer?: DohAnswer[];
  Authority?: DohAnswer[];
}

export type Level = "ok" | "warn" | "fail" | "info";

export interface Finding {
  id: string;
  label: string;
  level: Level;
  detail: string;
}

async function query(name: string, type: number): Promise<DohResponse | null> {
  try {
    const res = await fetch(`${DOH}?name=${encodeURIComponent(name)}&type=${type}`, {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as DohResponse;
  } catch {
    return null;
  }
}

/** Strip scheme/path/port/user input noise down to a bare hostname. */
function normalise(input: string): string | null {
  let d = input.trim().toLowerCase();
  d = d.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  d = d.split("/")[0].split("?")[0].split("@").pop() ?? "";
  d = d.split(":")[0];
  d = d.replace(/\.$/, "");

  if (!d || d.length > 253) return null;
  // Labels: alphanumeric + hyphen, at least one dot, no leading/trailing hyphen.
  const ok = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/.test(d);
  return ok ? d : null;
}

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("domain") ?? "";
  const domain = normalise(raw);

  if (!domain) {
    return NextResponse.json(
      { error: "Enter a domain like example.com" },
      { status: 400 }
    );
  }

  const [ns, soa, a, mx] = await Promise.all([
    query(domain, RR.NS),
    query(domain, RR.SOA),
    query(domain, RR.A),
    query(domain, RR.MX),
  ]);

  if (!ns || !soa) {
    return NextResponse.json(
      { error: "The resolver did not respond. Try again in a moment." },
      { status: 502 }
    );
  }

  const nameservers = (ns.Answer ?? [])
    .filter((r) => r.type === RR.NS)
    .map((r) => r.data.replace(/\.$/, ""))
    .sort();

  // Does each delegated nameserver hostname itself resolve to an address?
  const nsResolution = await Promise.all(
    nameservers.slice(0, 8).map(async (host) => {
      const [v4, v6] = await Promise.all([query(host, RR.A), query(host, RR.AAAA)]);
      const addrs = [
        ...(v4?.Answer ?? []).filter((r) => r.type === RR.A),
        ...(v6?.Answer ?? []).filter((r) => r.type === RR.AAAA),
      ].map((r) => r.data);
      return { host, addresses: addrs, resolves: addrs.length > 0 };
    })
  );

  const findings: Finding[] = [];
  const unresolved = nsResolution.filter((n) => !n.resolves);
  const soaOk = soa.Status === 0 && (soa.Answer ?? []).some((r) => r.type === RR.SOA);

  /* 1 — Is the domain delegated at all? */
  if (nameservers.length === 0) {
    findings.push({
      id: "delegation",
      label: "Delegation",
      level: ns.Status === 3 ? "info" : "warn",
      detail:
        ns.Status === 3
          ? "NXDOMAIN — this domain is not registered, so there is nothing to hijack."
          : "No NS records came back. The domain may be unregistered or the parent zone is not delegating.",
    });
  } else {
    findings.push({
      id: "delegation",
      label: "Delegation",
      level: "ok",
      detail: `Delegated to ${nameservers.length} nameserver${nameservers.length === 1 ? "" : "s"}.`,
    });
  }

  /* 2 — The core lame-delegation signal. */
  if (nameservers.length > 0) {
    if (soa.Status === 2) {
      findings.push({
        id: "authority",
        label: "Authoritative answer",
        level: "fail",
        detail:
          "SERVFAIL on the SOA record while NS records still exist. That is what lame delegation looks like from outside — the parent points at nameservers that are not serving this zone.",
      });
    } else if (!soaOk) {
      findings.push({
        id: "authority",
        label: "Authoritative answer",
        level: "warn",
        detail: `The zone is delegated but returned ${
          RCODE[soa.Status] ?? `rcode ${soa.Status}`
        } with no SOA. Worth checking directly against each nameserver.`,
      });
    } else {
      findings.push({
        id: "authority",
        label: "Authoritative answer",
        level: "ok",
        detail: "The delegated nameservers answer authoritatively for this zone (SOA present).",
      });
    }
  }

  /* 3 — Do the nameserver hostnames themselves resolve? */
  if (nameservers.length > 0) {
    if (unresolved.length === 0) {
      findings.push({
        id: "ns-resolve",
        label: "Nameserver reachability",
        level: "ok",
        detail: "Every delegated nameserver hostname resolves to an address.",
      });
    } else {
      findings.push({
        id: "ns-resolve",
        label: "Nameserver reachability",
        level: "fail",
        detail: `${unresolved.length} of ${nsResolution.length} nameservers do not resolve (${unresolved
          .map((n) => n.host)
          .join(", ")}). A delegation pointing at a name nobody owns is the precondition for a takeover.`,
      });
    }
  }

  /* 4 — DNSSEC, which makes forged answers much harder to pass off. */
  findings.push({
    id: "dnssec",
    label: "DNSSEC",
    level: soa.AD ? "ok" : "info",
    detail: soa.AD
      ? "Answers are DNSSEC-validated (AD flag set)."
      : "No validated DNSSEC signature. Common, and not a vulnerability by itself.",
  });

  const worst: Level = findings.some((f) => f.level === "fail")
    ? "fail"
    : findings.some((f) => f.level === "warn")
      ? "warn"
      : "ok";

  const unregistered = ns.Status === 3 && nameservers.length === 0;

  const verdict = unregistered
    ? "Not registered — there is no delegation to inspect."
    : worst === "fail"
      ? "Signals consistent with a broken delegation. Worth a proper look."
      : worst === "warn"
        ? "Something is unusual about this delegation."
        : "Nothing unusual in the public delegation.";

  return NextResponse.json({
    domain,
    verdict,
    level: unregistered ? "info" : worst,
    findings,
    records: {
      nameservers: nsResolution,
      addresses: (a?.Answer ?? []).filter((r) => r.type === RR.A).map((r) => r.data),
      mx: (mx?.Answer ?? [])
        .filter((r) => r.type === RR.MX)
        .map((r) => r.data)
        .sort(),
    },
  });
}
