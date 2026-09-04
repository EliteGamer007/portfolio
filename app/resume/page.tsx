import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, Mail, Phone } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { SITE, EDUCATION, CERTIFICATIONS, LANGUAGES, INTERESTS } from "@/lib/config";
import { PROJECTS, SKILL_GROUPS } from "@/lib/projects";
import TopBar from "@/components/ui/TopBar";
import CommandPalette from "@/components/ui/CommandPalette";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${SITE.fullName} — backend and distributed systems, Go and Python.`,
  alternates: { canonical: "/resume" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2
        className="mb-3.5 pb-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em]"
        style={{ color: "var(--color-azure-300)", borderBottom: "1px solid var(--line)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  return (
    <>
      <div className="no-print">
        <TopBar home={false} />
        <CommandPalette />
      </div>

      <main className="doc" id="main">
        <div className="no-print mb-10 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="eyebrow inline-flex items-center gap-1.5 transition-colors hover:text-[color:var(--color-azure-300)]"
          >
            <ArrowLeft size={11} /> Back
          </Link>
          <div className="flex flex-wrap gap-2.5">
            <PrintButton />
            <a href={SITE.resumePdf} download className="btn btn-primary">
              <Download size={14} /> PDF
            </a>
          </div>
        </div>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <header>
          <h1 className="display text-[clamp(2.2rem,7vw,3.2rem)]">{SITE.fullName}</h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--color-paper-dim)" }}>
            Backend &amp; distributed systems · {SITE.location}
          </p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11.5px]">
            <li className="flex items-center gap-1.5">
              <Phone size={11} className="no-print" />
              {SITE.phone}
            </li>
            <li className="flex items-center gap-1.5">
              <Mail size={11} className="no-print" />
              <a href={`mailto:${SITE.email}`} className="link-underline">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="no-print"><Github size={11} /></span>
              <a href={SITE.github} className="link-underline">
                github.com/{SITE.githubUser}
              </a>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="no-print"><Linkedin size={11} /></span>
              <a href={SITE.linkedin} className="link-underline">
                linkedin.com/in/sanjeev-srinivas
              </a>
            </li>
          </ul>
        </header>

        <Section title="About">
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-paper-dim)" }}>
            Final-year B.Tech Computer Science student with project experience across full-stack
            development, data analytics and cloud architecture. Proficient in Python, Go, and modern
            backend and frontend frameworks.
          </p>
        </Section>

        <Section title="Education">
          <ul className="space-y-3.5">
            {EDUCATION.map((e) => (
              <li key={e.degree}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[14px]" style={{ color: "var(--color-paper)" }}>
                    {e.degree}
                  </p>
                  <p className="font-mono text-[11px]" style={{ color: "var(--color-paper-mute)" }}>
                    {e.period}
                  </p>
                </div>
                <p className="mt-0.5 text-[13px]" style={{ color: "var(--color-paper-dim)" }}>
                  {e.school} — {e.detail}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Skills">
          <ul className="space-y-2.5">
            {SKILL_GROUPS.map((g) => (
              <li key={g.label} className="flex flex-wrap gap-x-2 text-[13.5px]">
                <span className="shrink-0" style={{ color: "var(--color-paper)" }}>
                  {g.label}:
                </span>
                <span style={{ color: "var(--color-paper-dim)" }}>{g.items.join(", ")}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Projects">
          <ul className="space-y-6">
            {PROJECTS.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[14px]" style={{ color: "var(--color-paper)" }}>
                    {p.title}
                  </p>
                  <p className="font-mono text-[10.5px]" style={{ color: "var(--color-paper-mute)" }}>
                    {p.techStack.join(" · ")}
                  </p>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {p.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-2.5 text-[13px]">
                      <span style={{ color: "var(--color-azure-400)" }}>—</span>
                      <span style={{ color: "var(--color-paper-dim)" }}>{h}</span>
                    </li>
                  ))}
                </ul>
                <p className="no-print mt-2 font-mono text-[11px]">
                  <a href={p.githubUrl} className="link-underline">
                    Source
                  </a>
                  {p.liveUrl && (
                    <>
                      {"  ·  "}
                      <a href={p.liveUrl} className="link-underline">
                        Live
                      </a>
                    </>
                  )}
                  {"  ·  "}
                  <Link href={`/work/${p.slug}`} className="link-underline">
                    Case study
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Research">
          <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--color-paper-dim)" }}>
            Independent research into <span style={{ color: "var(--color-paper)" }}>Sitting Duck</span>{" "}
            domain hijacking — where a parent zone keeps delegating to nameservers that no longer
            serve the zone, letting an attacker claim authority without touching the registrar. Built
            a public delegation inspector as a companion tool.
          </p>
        </Section>

        <Section title="Certifications">
          <ul className="space-y-1.5">
            {CERTIFICATIONS.map((c) => (
              <li key={c} className="text-[13.5px]" style={{ color: "var(--color-paper-dim)" }}>
                {c}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Other">
          <ul className="space-y-1.5 text-[13.5px]" style={{ color: "var(--color-paper-dim)" }}>
            <li>
              <span style={{ color: "var(--color-paper)" }}>Languages:</span> {LANGUAGES}
            </li>
            <li>
              <span style={{ color: "var(--color-paper)" }}>Interests:</span> {INTERESTS}
            </li>
          </ul>
        </Section>
      </main>
    </>
  );
}
