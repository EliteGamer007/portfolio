import { ImageResponse } from "next/og";
import { PROJECTS, getProject } from "@/lib/projects";
import { SITE } from "@/lib/config";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #06090f 0%, #0c1424 55%, #101c33 100%)",
          color: "#e9edf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#6f7b96" }}>
          {(project?.subtitle ?? "CASE STUDY").toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 86, lineHeight: 1.04, letterSpacing: -2 }}>
            {project?.title ?? "Case study"}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#9dbcff",
              maxWidth: 900,
            }}
          >
            {project?.tagline ?? ""}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, color: "#a3aec7" }}>
          <div style={{ display: "flex", width: 44, height: 3, background: "#4f84f5" }} />
          {project ? project.techStack.slice(0, 4).join(" · ") : SITE.name}
        </div>
      </div>
    ),
    size
  );
}
