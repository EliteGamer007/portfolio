"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/* ─── Inline SVG brand icons ────────────────────────────────────────────── */
const GitHubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

/* ─── Project data ──────────────────────────────────────────────────────── */
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  videoUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  status: "production" | "research" | "active";
  accent: string;
}

const PROJECTS: Project[] = [
  {
    id: "splitter",
    title: "Splitter",
    subtitle: "Federated Microblogging",
    description:
      "Decentralised social platform on the ActivityPub protocol. Microservices backend in Go, federated inbox/outbox routing, and a Next.js frontend — self-hosted, interoperable, and Twitter-alternative.",
    techStack: ["Go", "Next.js", "ActivityPub", "PostgreSQL", "Redis"],
    videoUrl: "https://pub-placeholder.r2.dev/splitter-demo.mp4",
    githubUrl: "https://github.com/sanjeev-srinivas/splitter",
    status: "production",
    accent: "#2DD4BF",
  },
  {
    id: "dpf-soot",
    title: "DPF Soot Load Prediction",
    subtitle: "End-to-End ML Pipeline",
    description:
      "XGBoost regression pipeline predicting diesel particulate filter soot from engine sensor telemetry. FastAPI inference server, Dockerised for edge deployment with model versioning and drift detection.",
    techStack: ["Python", "XGBoost", "FastAPI", "Docker", "Scikit-learn"],
    videoUrl: "https://pub-placeholder.r2.dev/dpf-demo.mp4",
    githubUrl: "https://github.com/sanjeev-srinivas/dpf-soot-prediction",
    status: "active",
    accent: "#C7B27B",
  },
  {
    id: "f1-telemetry",
    title: "F1 Telemetry Dashboard",
    subtitle: "Live Race Analytics",
    description:
      "Real-time F1 analytics streaming lap-by-lap telemetry, tyre strategies, and sector breakdowns. Background polling every 45s via FastF1, interactive circuit maps in Plotly, live Streamlit leaderboard.",
    techStack: ["Python", "FastF1", "Streamlit", "Plotly", "Redis"],
    videoUrl: "https://pub-placeholder.r2.dev/f1-demo.mp4",
    githubUrl: "https://github.com/sanjeev-srinivas/f1-telemetry",
    status: "active",
    accent: "#2DD4BF",
  },
  {
    id: "archipelago",
    title: "Archipelago Framework",
    subtitle: "Distributed Systems Research",
    description:
      "Research platform for visualising cluster execution state across distributed node networks. Ingests structured logs, reconstructs causal timelines, renders interactive topology graphs for consensus post-mortems.",
    techStack: ["Go", "React", "WebSockets", "Log Ingestion", "Grafana"],
    videoUrl: "https://pub-placeholder.r2.dev/archipelago-demo.mp4",
    githubUrl: "https://github.com/sanjeev-srinivas/archipelago",
    status: "research",
    accent: "#A38E54",
  },
];

const STATUS_LABELS: Record<Project["status"], string> = {
  production: "Production",
  active: "Active Dev",
  research: "Research",
};

/* ─── Slide index dots ──────────────────────────────────────────────────── */
function SlideDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i === active ? "20px" : "6px",
            height: "6px",
            borderRadius: "3px",
            background: i === active ? "#2DD4BF" : "rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function VideoCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const project = PROJECTS[activeIndex];

  return (
    <div className="relative w-full">
      {/* Nav: prev */}
      <button
        id="carousel-prev"
        aria-label="Previous project"
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center border border-white/15 bg-black/40 backdrop-blur-md hover:border-[#2DD4BF] hover:text-[#2DD4BF] transition-all duration-300 text-slate-400"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Nav: next */}
      <button
        id="carousel-next"
        aria-label="Next project"
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center border border-white/15 bg-black/40 backdrop-blur-md hover:border-[#2DD4BF] hover:text-[#2DD4BF] transition-all duration-300 text-slate-400"
      >
        <ChevronRight size={16} />
      </button>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        onSwiper={(s) => { swiperRef.current = s; }}
        onSlideChange={(s) => setActiveIndex(s.realIndex % PROJECTS.length)}
        className="w-full rounded-2xl overflow-hidden"
      >
        {PROJECTS.map((p) => (
          <SwiperSlide key={p.id}>
            {/* ── Cinematic frame — everything lives inside ── */}
            <div
              className="relative w-full"
              style={{ minHeight: "480px", height: "clamp(480px, 55vh, 620px)" }}
            >
              {/* Video background */}
              <video
                src={p.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden="true"
              />

              {/* Fallback bg when video hasn't loaded */}
              <div
                className="absolute inset-0 -z-10 grid-bg"
                style={{ background: "#0B1120" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[12rem] font-black tracking-widest select-none"
                    style={{
                      color: p.accent,
                      opacity: 0.04,
                      fontFamily: "var(--font-geist-mono)",
                    }}
                  >
                    {p.id.toUpperCase().slice(0, 3)}
                  </span>
                </div>
              </div>

              {/* Multi-directional gradient so text is always readable */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: `
                    linear-gradient(to top,  rgba(6,10,20,0.97) 0%, rgba(6,10,20,0.7) 38%, transparent 65%),
                    linear-gradient(to right, rgba(6,10,20,0.85) 0%, rgba(6,10,20,0.4) 40%, transparent 70%)
                  `,
                }}
              />

              {/* Accent colour strip on left edge */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 z-20"
                style={{ background: `linear-gradient(to bottom, transparent, ${p.accent}, transparent)` }}
              />

              {/* ── Info overlay ── */}
              <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-8">

                {/* Top row: status badge + slide counter */}
                <div className="flex items-start justify-between">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm"
                    style={{
                      background: `${p.accent}22`,
                      color: p.accent,
                      border: `1px solid ${p.accent}50`,
                    }}
                  >
                    ● {STATUS_LABELS[p.status]}
                  </span>
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                  </span>
                </div>

                {/* Bottom: left = title+desc, right = stack+links */}
                <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">

                  {/* Left column */}
                  <div className="flex-1 space-y-2.5 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono">
                      {p.subtitle}
                    </p>
                    <h3
                      className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight"
                      style={{ color: "#f8fafc" }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300/70 leading-relaxed max-w-md">
                      {p.description}
                    </p>
                  </div>

                  {/* Right column */}
                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 md:justify-end">
                      {p.techStack.map((tech) => (
                        <span key={tech} className="tech-tag" style={{ opacity: 0.85 }}>
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links + dots */}
                    <div className="flex items-center gap-4">
                      <SlideDots total={PROJECTS.length} active={activeIndex} />
                      <div className="w-px h-4 bg-white/10" />
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          id={`github-link-${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-[#2DD4BF] transition-colors duration-200 font-medium"
                        >
                          <GitHubIcon />
                          Source
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          id={`live-link-${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-[#2DD4BF] transition-colors duration-200 font-medium"
                        >
                          <ExternalLink size={12} />
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
