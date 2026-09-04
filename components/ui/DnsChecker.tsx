"use client";

import { useState, useRef, type FormEvent } from "react";
import { Search, Loader2, ShieldCheck, ShieldAlert, ShieldX, Info } from "lucide-react";

type Level = "ok" | "warn" | "fail" | "info";

interface Finding {
  id: string;
  label: string;
  level: Level;
  detail: string;
}
interface Result {
  domain: string;
  verdict: string;
  level: Level;
  findings: Finding[];
  records: {
    nameservers: { host: string; addresses: string[]; resolves: boolean }[];
    addresses: string[];
    mx: string[];
  };
}

const TONE: Record<Level, { color: string; Icon: typeof ShieldCheck }> = {
  ok: { color: "#5fd39a", Icon: ShieldCheck },
  warn: { color: "#e4b95b", Icon: ShieldAlert },
  fail: { color: "#f0776c", Icon: ShieldX },
  info: { color: "#74a0ff", Icon: Info },
};

const EXAMPLES = ["github.com", "wikipedia.org", "iitm.ac.in"];

export default function DnsChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function run(value: string) {
    const target = value.trim();
    if (!target || busy) return;

    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/dns?domain=${encodeURIComponent(target)}`);
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Lookup failed.");
      else setResult(data as Result);
    } catch {
      setError("Could not reach the resolver.");
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run(domain);
  }

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-paper-mute)" }}
          />
          <input
            ref={inputRef}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            aria-label="Domain to inspect"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="w-full rounded-lg py-2.5 pl-9 pr-3 font-mono text-[13px] outline-none transition-colors"
            style={{
              background: "rgba(6,9,15,0.6)",
              border: "1px solid var(--line-strong)",
              color: "var(--color-paper)",
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary justify-center" disabled={busy}>
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          {busy ? "Checking" : "Inspect"}
        </button>
      </form>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="eyebrow">Try</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => {
              setDomain(ex);
              void run(ex);
            }}
            className="chip"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Results */}
      <div aria-live="polite" className="mt-4">
        {error && (
          <p className="text-[13px]" style={{ color: TONE.fail.color }}>
            {error}
          </p>
        )}

        {result && (
          <div className="card overflow-hidden">
            <div
              className="flex items-start gap-3 px-4 py-3.5"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              {(() => {
                const { color, Icon } = TONE[result.level];
                return <Icon size={17} style={{ color, marginTop: 1, flexShrink: 0 }} />;
              })()}
              <div className="min-w-0">
                <p className="font-mono text-[12px]" style={{ color: "var(--color-paper)" }}>
                  {result.domain}
                </p>
                <p className="mt-0.5 text-[13px]" style={{ color: TONE[result.level].color }}>
                  {result.verdict}
                </p>
              </div>
            </div>

            <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
              {result.findings.map((f) => (
                <li key={f.id} className="flex gap-3 px-4 py-3">
                  <span
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: TONE[f.level].color }}
                  />
                  <div className="min-w-0">
                    <p className="text-[12.5px]" style={{ color: "var(--color-paper)" }}>
                      {f.label}
                    </p>
                    <p className="prose-dim mt-0.5 text-[12.5px]">{f.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            {result.records.nameservers.length > 0 && (
              <div className="px-4 py-3" style={{ borderTop: "1px solid var(--line)" }}>
                <p className="eyebrow mb-2">Nameservers</p>
                <ul className="space-y-1">
                  {result.records.nameservers.map((n) => (
                    <li key={n.host} className="flex flex-wrap items-baseline gap-x-2 font-mono text-[11.5px]">
                      <span style={{ color: n.resolves ? "var(--color-paper-dim)" : TONE.fail.color }}>
                        {n.host}
                      </span>
                      <span style={{ color: "var(--color-paper-mute)" }}>
                        {n.resolves ? n.addresses.slice(0, 2).join("  ") : "does not resolve"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="prose-dim mt-3 text-[11.5px]" style={{ color: "var(--color-paper-mute)" }}>
        Reads public DNS over Cloudflare&apos;s resolver. It reports what a recursive resolver can
        see from outside — a real audit would query each nameserver directly.
      </p>
    </div>
  );
}
