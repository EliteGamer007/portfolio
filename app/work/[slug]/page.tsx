import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import { PROJECTS, getProject } from "@/lib/projects";
import { SITE } from "@/lib/config";
import TopBar from "@/components/ui/TopBar";
import CommandPalette from "@/components/ui/CommandPalette";
import ArchButton from "@/components/ui/ArchButton";
import LiveEmbedButton from "@/components/ui/LiveEmbedButton";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const description = project.tagline;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${SITE.name}`,
      description,
      url: `${SITE.url}/work/${project.slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: project.title, description },
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prev = PROJECTS[i - 1];
  const next = PROJECTS[i + 1];

  return (
    <>
      <TopBar home={false} />
      <CommandPalette />

      <main className="mx-auto w-full max-w-6xl px-5 pb-10 pt-20 sm:px-8" id="main">
        <Link
          href={`/#${project.slug}`}
          className="eyebrow no-print inline-flex items-center gap-1.5 transition-colors hover:text-[color:var(--color-azure-300)]"
        >
          <ArrowLeft size={11} /> All work
        </Link>

        <p className="eyebrow mt-6">
          {String(i + 1).padStart(2, "0")} · {project.subtitle} · {project.year}
        </p>

        <h1 className="display mt-3 text-[clamp(2.1rem,6vw,3.6rem)]">{project.title}</h1>

        <p
          className="mt-4 max-w-2xl text-[16px] leading-relaxed"
          style={{ color: "var(--color-paper-dim)" }}
        >
          {project.tagline}
        </p>

        {/* Everything below sits side by side so the whole case study reads
            in one screen instead of a scroll. */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="min-w-0">
            <h2 className="eyebrow">Overview</h2>
            <p
              className="mt-3 text-[14.5px] leading-relaxed"
              style={{ color: "var(--color-paper-dim)" }}
            >
              {project.description}
            </p>

            <h2 className="eyebrow mt-9">What it does</h2>
            <ul className="mt-2.5 space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span
                    className="mt-[9px] h-1 w-1 shrink-0 rounded-full"
                    style={{ background: "var(--color-azure-400)" }}
                  />
                  <span className="text-[14px]" style={{ color: "var(--color-paper-dim)" }}>
                    {h}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-1.5">
              {project.techStack.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>

            <div className="no-print mt-7 flex flex-wrap gap-2.5">
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
                  className="btn btn-primary"
                >
                  Live instance <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </div>

          <aside className="card h-fit p-5 sm:p-6">
            <p className="eyebrow mb-4">Notes</p>
            <ul className="space-y-5">
              {project.decisions.map((d) => (
                <li key={d.label}>
                  <p className="text-[12.5px]" style={{ color: "var(--color-azure-300)" }}>
                    {d.label}
                  </p>
                  <p className="prose-dim mt-1.5 text-[13.5px]">{d.body}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <nav
          className="no-print mt-12 flex flex-wrap items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid var(--line)" }}
          aria-label="More work"
        >
          {prev ? (
            <Link href={`/work/${prev.slug}`} className="group min-w-0">
              <p className="eyebrow mb-1 flex items-center gap-1.5">
                <ArrowLeft size={10} /> Previous
              </p>
              <p className="truncate text-[14px] transition-colors group-hover:text-[color:var(--color-azure-300)]">
                {prev.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/work/${next.slug}`} className="group min-w-0 text-right">
              <p className="eyebrow mb-1 flex items-center justify-end gap-1.5">
                Next <ArrowRight size={10} />
              </p>
              <p className="truncate text-[14px] transition-colors group-hover:text-[color:var(--color-azure-300)]">
                {next.title}
              </p>
            </Link>
          )}
        </nav>
      </main>
    </>
  );
}
