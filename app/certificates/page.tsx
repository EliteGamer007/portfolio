import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Award, ExternalLink, FileText } from "lucide-react";
import { CERTIFICATES } from "@/lib/certificates";
import { SITE } from "@/lib/config";
import TopBar from "@/components/ui/TopBar";
import CommandPalette from "@/components/ui/CommandPalette";

export const metadata: Metadata = {
  title: "Certificates",
  description: `Certificates and credentials earned by ${SITE.fullName}.`,
  alternates: { canonical: "/certificates" },
};

export default function CertificatesPage() {
  const earned = CERTIFICATES.filter((c) => c.status !== "in-progress").length;

  return (
    <>
      <TopBar home={false} />
      <CommandPalette />

      <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-20 sm:px-8" id="main">
        <Link
          href="/#certificates"
          className="eyebrow no-print inline-flex items-center gap-1.5 transition-colors hover:text-[color:var(--color-azure-300)]"
        >
          <ArrowLeft size={11} /> Back
        </Link>

        <p className="eyebrow mt-6">Credentials</p>
        <h1 className="display mt-3 text-[clamp(2.1rem,6vw,3.6rem)]">Certificates</h1>
        <p
          className="mt-4 max-w-xl text-[15px] leading-relaxed"
          style={{ color: "var(--color-paper-dim)" }}
        >
          {earned} earned, {CERTIFICATES.length - earned} in progress. Coursework and credentials
          alongside the B.Tech at Amrita.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CERTIFICATES.map((c) => (
            <article
              key={c.id}
              className="card relative overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full"
                style={{ background: "rgba(116,160,255,0.06)" }}
              />

              <div className="flex items-start justify-between gap-3">
                <Award size={18} style={{ color: "var(--color-azure-300)" }} />
                {c.status === "in-progress" && <span className="chip">In progress</span>}
              </div>

              <h2 className="mt-4 text-[16px] font-semibold leading-snug">{c.title}</h2>
              <p className="mt-2 font-mono text-[11.5px]" style={{ color: "var(--color-paper-mute)" }}>
                {c.issuer} · {c.year}
              </p>

              {c.note && <p className="prose-dim mt-3.5 text-[13.5px]">{c.note}</p>}

              {(c.credentialUrl || c.file) && (
                <div className="mt-5 flex flex-wrap gap-4">
                  {c.credentialUrl && (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1.5 font-mono text-[11.5px]"
                    >
                      <ExternalLink size={12} /> Verify
                    </a>
                  )}
                  {c.file && (
                    <a
                      href={c.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1.5 font-mono text-[11.5px]"
                    >
                      <FileText size={12} /> View certificate
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}

          {/* Placeholder slot — a visible reminder of where new ones land. */}
          <article
            className="flex flex-col items-center justify-center rounded-[14px] p-8 text-center"
            style={{ border: "1px dashed var(--line-strong)", minHeight: 160 }}
          >
            <Award size={16} style={{ color: "var(--color-paper-mute)" }} />
            <p className="eyebrow mt-3">More on the way</p>
            <p className="mt-2 text-[12.5px]" style={{ color: "var(--color-paper-mute)" }}>
              Add entries in{" "}
              <code className="font-mono" style={{ color: "var(--color-azure-300)" }}>
                lib/certificates.ts
              </code>
            </p>
          </article>
        </div>
      </main>
    </>
  );
}
