import { PROJECTS } from "@/lib/projects";
import { getGitHubStats } from "@/lib/github";
import { SITE } from "@/lib/config";
import Rail, { type PanelMeta } from "@/components/rail/Rail";
import {
  Panel,
  HeroPanel,
  CertificatesPanel,
  ProjectPanel,
  ResearchPanel,
  StackPanel,
  ContactPanel,
} from "@/components/rail/panels";
import FloatingStack from "@/components/ui/FloatingStack";
import CommandPalette from "@/components/ui/CommandPalette";
import TopBar from "@/components/ui/TopBar";

// Rebuild hourly so the GitHub activity stays current without going dynamic.
export const revalidate = 3600;

const PANELS: PanelMeta[] = [
  { id: "home", label: "Home" },
  { id: "certificates", label: "Certificates" },
  ...PROJECTS.map((p) => ({ id: p.slug, label: p.title })),
  { id: "research", label: "Research" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export default async function Home() {
  const stats = await getGitHubStats();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <TopBar />
      <CommandPalette />
      <FloatingStack />

      <Rail panels={PANELS}>
        <Panel id="home" label="Home">
          <HeroPanel stats={stats} />
        </Panel>

        <Panel id="certificates" label="Certificates">
          <CertificatesPanel />
        </Panel>

        {PROJECTS.map((project, i) => (
          <Panel key={project.slug} id={project.slug} label={project.title}>
            <ProjectPanel project={project} index={i} />
          </Panel>
        ))}

        <Panel id="research" label="Research">
          <ResearchPanel />
        </Panel>

        <Panel id="stack" label="Stack">
          <StackPanel stats={stats} />
        </Panel>

        <Panel id="contact" label="Contact">
          <ContactPanel />
        </Panel>
      </Rail>

      {/* Crawlable copy of everything the rail shows, so the page is not an
          empty shell to anything that doesn't run JavaScript. */}
      <div className="sr-only">
        <h2>Projects by {SITE.fullName}</h2>
        {PROJECTS.map((p) => (
          <article key={p.slug}>
            <h3>
              {p.title} — {p.subtitle}
            </h3>
            <p>{p.description}</p>
            <ul>
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <p>Built with {p.techStack.join(", ")}.</p>
            <a href={`/work/${p.slug}`}>Read the {p.title} case study</a>
          </article>
        ))}
      </div>
    </>
  );
}
