import Link from "next/link";
import { ArrowUpRight, Mail, FileText, MapPin, Award, Download } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { SITE, EDUCATION } from "@/lib/config";
import { SKILL_GROUPS, type Project } from "@/lib/projects";
import { CERTIFICATES } from "@/lib/certificates";
import type { GitHubStats } from "@/lib/github";
import ContributionGraph from "@/components/ui/ContributionGraph";
import DnsChecker from "@/components/ui/DnsChecker";
import ArchButton from "@/components/ui/ArchButton";
import LiveEmbedButton from "@/components/ui/LiveEmbedButton";
import DemoSlot from "@/components/ui/DemoSlot";
import StickyNotes from "@/components/ui/StickyNotes";

/* ── Shell ──────────────────────────────────────────────────────────────── */

export function Panel({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel" id={id} aria-label={label}>
      <div className="panel-inner">{children}</div>
    </section>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

export function HeroPanel({ stats }: { stats: GitHubStats | null }) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <p className="eyebrow reveal flex items-center gap-2">
        <span
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: "var(--color-azure-400)" }}
        />
        {SITE.location} · Open to internships
      </p>

      <h1
        className="display reveal mt-5 text-[clamp(2.9rem,10vw,6.5rem)]"
        style={{ ["--reveal-delay" as string]: "60ms" }}
      >
        Sanjeev
        <br />
        <span style={{ color: "var(--color-azure-300)" }}>Srinivas</span>
      </h1>

      <p
        className="reveal mt-6 max-w-xl text-[15px] leading-relaxed"
        style={{ ["--reveal-delay" as string]: "140ms", color: "var(--color-paper-dim)" }}
      >
        Final-year CS student at Amrita, reading Data Science at IIT Madras alongside it. I build
        backend systems — a social network that federates across servers it doesn&apos;t control, a
        deepfake detector that watches motion instead of pixels, and a race telemetry pit wall that
        keeps every view on one clock.
      </p>

      <div
        className="reveal mt-8 flex flex-wrap items-center gap-2.5"
        style={{ ["--reveal-delay" as string]: "210ms" }}
      >
        <a href={`mailto:${SITE.email}`} className="btn btn-primary">
          <Mail size={14} /> Get in touch
        </a>
        <Link href="/resume" className="btn btn-ghost">
          <FileText size={14} /> Résumé
        </Link>
        <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          <Github size={14} /> GitHub
        </a>
      </div>

      {/* Real figures only — this row disappears if GitHub is unreachable. */}
      {stats && stats.totalYear > 0 && (
        <div
          className="reveal mt-9 flex flex-wrap items-center gap-x-7 gap-y-3"
          style={{ ["--reveal-delay" as string]: "280ms" }}
        >
          {[
            { v: stats.totalYear, k: "commits this year" },
            { v: stats.repoCount, k: "public repos" },
            { v: stats.longestStreak, k: "day streak" },
          ].map((s) => (
            <div key={s.k}>
              <p
                className="font-mono text-[19px] font-medium"
                style={{ color: "var(--color-azure-300)" }}
              >
                {s.v}
              </p>
              <p className="eyebrow mt-0.5">{s.k}</p>
            </div>
          ))}
        </div>
      )}

      <p className="eyebrow reveal mt-8" style={{ ["--reveal-delay" as string]: "340ms" }}>
        Scroll sideways, or press <kbd>→</kbd> · <kbd>⌘K</kbd> to search
      </p>
    </div>
  );
}

/* ── Certificates ───────────────────────────────────────────────────────── */

export function CertificatesPanel() {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow reveal">Credentials</p>
          <h2
            className="display reveal mt-3 text-[clamp(2rem,5.5vw,3.4rem)]"
            style={{ ["--reveal-delay" as string]: "60ms" }}
          >
            Certificates
          </h2>
        </div>
        <Link
          href="/certificates"
          className="btn btn-ghost reveal"
          style={{ ["--reveal-delay" as string]: "120ms" }}
        >
          See all {CERTIFICATES.length} <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATES.slice(0, 3).map((c, i) => (
          <article
            key={c.id}
            className="card reveal group relative overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1"
            style={{ ["--reveal-delay" as string]: `${140 + i * 70}ms` }}
          >
            <div
              className="absolute -right-7 -top-7 h-20 w-20 rounded-full"
              style={{ background: "rgba(116,160,255,0.07)" }}
            />
            <Award size={16} style={{ color: "var(--color-azure-300)" }} />
            <h3 className="mt-3.5 text-[14.5px] font-semibold leading-snug">{c.title}</h3>
            <p className="mt-1.5 font-mono text-[11px]" style={{ color: "var(--color-paper-mute)" }}>
              {c.issuer} · {c.year}
            </p>
            {c.note && <p className="prose-dim mt-3 text-[12.5px]">{c.note}</p>}
            {c.status === "in-progress" && (
              <span className="chip mt-3.5 inline-flex">In progress</span>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

/* ── Project ────────────────────────────────────────────────────────────── */

export function ProjectPanel({ project, index }: { project: Project; index: number }) {
  return (
    <div className="grid w-full items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
      <div className="relative min-w-0">
        <span className="ghost-index hidden text-[13rem] lg:block" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>

        <p className="eyebrow reveal">
          {project.subtitle} · {project.year}
        </p>

        <h2
          className="display reveal mt-3.5 text-[clamp(1.9rem,5vw,3.2rem)]"
          style={{ ["--reveal-delay" as string]: "60ms" }}
        >
          {project.title}
        </h2>

        <p
          className="reveal mt-4 max-w-lg text-[14.5px] leading-relaxed"
          style={{ ["--reveal-delay" as string]: "120ms", color: "var(--color-paper-dim)" }}
        >
          {project.tagline}
        </p>

        <div
          className="reveal mt-5 flex flex-wrap gap-1.5"
          style={{ ["--reveal-delay" as string]: "180ms" }}
        >
          {project.techStack.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>

        <div
          className="reveal mt-6 flex flex-wrap items-center gap-2.5"
          style={{ ["--reveal-delay" as string]: "240ms" }}
        >
          <Link href={`/work/${project.slug}`} className="btn btn-primary">
            Case study <ArrowUpRight size={14} />
          </Link>

          {project.diagram && (
            <ArchButton diagram={project.diagram} projectTitle={project.title} />
          )}

          {project.embeddable && project.liveUrl && (
            <LiveEmbedButton url={project.liveUrl} title={project.title} />
          )}

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <Github size={14} /> Source
          </a>

          {!project.embeddable && project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Live <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Demo frame, with the notes taped over its right edge. */}
      <div
        className="reveal flex min-w-0 flex-col lg:flex-row lg:items-start"
        style={{ ["--reveal-delay" as string]: "300ms" }}
      >
        <div className="min-w-0 flex-1">
          <DemoSlot label={project.title} />
        </div>
        <StickyNotes
          notes={project.decisions}
          className="mt-6 lg:z-10 lg:-ml-10 lg:-mt-7 lg:w-[186px] lg:shrink-0"
        />
      </div>
    </div>
  );
}

/* ── Research + the live DNS tool ───────────────────────────────────────── */

export function ResearchPanel() {
  return (
    <div className="grid w-full items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <div className="min-w-0">
        <p className="eyebrow reveal">Research interest · DNS security</p>

        <h2
          className="display reveal mt-3.5 text-[clamp(2rem,5.5vw,3.4rem)]"
          style={{ ["--reveal-delay" as string]: "60ms" }}
        >
          Sitting Duck
        </h2>

        <div
          className="reveal mt-5 max-w-lg space-y-4 text-[14.5px]"
          style={{ ["--reveal-delay" as string]: "120ms", color: "var(--color-paper-dim)" }}
        >
          <p>
            I spent a while researching a domain-hijack class called{" "}
            <em style={{ color: "var(--color-paper)" }}>Sitting Duck</em>. The setup is that a
            parent zone still delegates a domain to nameservers that no longer serve it — the
            delegation is live, the zone behind it is gone.
          </p>
          <p>
            If someone can claim that nameserver at the provider, they inherit authority over the
            domain without ever touching the registrar or the owner&apos;s account. The
            uncomfortable part is how normal the domain looks from the outside while it&apos;s
            exposed.
          </p>
          <p style={{ color: "var(--color-paper-mute)" }}>
            Not published — a research project I did on my own, and the reason the tool on the right
            exists.
          </p>
        </div>
      </div>

      <div className="reveal min-w-0" style={{ ["--reveal-delay" as string]: "200ms" }}>
        <p className="eyebrow mb-3">Try it — inspect any domain&apos;s delegation</p>
        <DnsChecker />
      </div>
    </div>
  );
}

/* ── Stack + real activity ──────────────────────────────────────────────── */

export function StackPanel({ stats }: { stats: GitHubStats | null }) {
  return (
    <div className="grid w-full items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
      <div className="min-w-0">
        <p className="eyebrow reveal">Stack</p>
        <h2
          className="display reveal mt-3.5 text-[clamp(2rem,5.5vw,3.4rem)]"
          style={{ ["--reveal-delay" as string]: "60ms" }}
        >
          What I work with
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5 sm:gap-x-8 sm:gap-y-6">
          {SKILL_GROUPS.map((g, i) => (
            <div
              key={g.label}
              className="reveal"
              style={{ ["--reveal-delay" as string]: `${120 + i * 60}ms` }}
            >
              <p className="eyebrow mb-2.5">{g.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-7 space-y-2.5" style={{ ["--reveal-delay" as string]: "380ms" }}>
          <p className="eyebrow">Education</p>
          {EDUCATION.map((e) => (
            <div key={e.degree} className="flex flex-wrap items-baseline gap-x-3">
              <p className="text-[13.5px]" style={{ color: "var(--color-paper)" }}>
                {e.degree}
              </p>
              <p className="font-mono text-[11px]" style={{ color: "var(--color-paper-mute)" }}>
                {e.school} · {e.detail} · {e.period}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="reveal min-w-0" style={{ ["--reveal-delay" as string]: "260ms" }}>
        <ContributionGraph stats={stats} />
      </div>
    </div>
  );
}

/* ── Contact ────────────────────────────────────────────────────────────── */

export function ContactPanel() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <p className="eyebrow reveal">Get in touch</p>

      <h2
        className="display reveal mt-5 text-[clamp(2.4rem,7.5vw,4.6rem)]"
        style={{ ["--reveal-delay" as string]: "60ms" }}
      >
        Let&apos;s build
        <br />
        <span style={{ color: "var(--color-azure-300)" }}>something real.</span>
      </h2>

      <p
        className="reveal mt-6 max-w-md text-[15px] leading-relaxed"
        style={{ ["--reveal-delay" as string]: "130ms", color: "var(--color-paper-dim)" }}
      >
        Open to internships, research collaborations, and problems that need a system rather than a
        script. If you have something hard to build, I&apos;d like to hear about it.
      </p>

      <div
        className="reveal mt-8 flex flex-wrap gap-2.5"
        style={{ ["--reveal-delay" as string]: "200ms" }}
      >
        <a href={`mailto:${SITE.email}`} className="btn btn-primary">
          <Mail size={14} /> {SITE.email}
        </a>
        <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          <Github size={14} /> GitHub
        </a>
        <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          <Linkedin size={14} /> LinkedIn
        </a>
        <a href={SITE.resumePdf} download className="btn btn-ghost">
          <Download size={14} /> Résumé PDF
        </a>
      </div>

      <p
        className="eyebrow reveal mt-10 flex items-center gap-2"
        style={{ ["--reveal-delay" as string]: "260ms" }}
      >
        <MapPin size={11} /> {SITE.location} · {SITE.timezone}
      </p>
    </div>
  );
}
