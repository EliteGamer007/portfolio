"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowRight, X, Mail, ArrowDown } from "lucide-react";
import dynamic from "next/dynamic";
import { PROJECTS, type Project } from "@/lib/projects";

const BootSequence = dynamic(() => import("@/components/ui/BootSequence"), { ssr: false });
const TelemetryLayer = dynamic(() => import("@/components/ui/TelemetryLayer"), { ssr: false });

/* ── Inline SVGs ─────────────────────────────────────────────────────────── */
const GHIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const LIIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ── Polaroid ────────────────────────────────────────────────────────────── */
function Polaroid() {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: 12, scale: 0.7 }}
      animate={{ opacity: 1, rotate: 4, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotate: -3, scale: 1.06, transition: { duration: 0.2 } }}
      className="cursor-pointer select-none absolute bottom-2 right-0 hidden sm:block"
      style={{ width: 96, background: "#f5f0e8", padding: "6px 6px 20px", boxShadow: "4px 8px 24px rgba(0,0,0,0.55)" }}
    >
      <div style={{ width: 84, height: 84, background: "linear-gradient(145deg,#0B1120,#1a2540)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-geist-mono)", fontSize: 26, fontWeight: 900, color: "#2DD4BF" }}>SS</div>
      <p style={{ marginTop: 4, fontSize: 8, textAlign: "center", color: "#999", fontFamily: "var(--font-geist-mono)" }}>sanjeev, &apos;25</p>
    </motion.div>
  );
}

/* ── Section nav dots ────────────────────────────────────────────────────── */
const SECTION_LABELS = ["HOME", ...PROJECTS.map((p) => p.id.toUpperCase()), "SKILLS", "CONTACT"];

function NavDots({ active, total, onGo }: { active: number; total: number; onGo: (i: number) => void }) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-2 hidden xl:flex" style={{ marginRight: "170px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onGo(i)}
          title={SECTION_LABELS[i] ?? ""}
          className="transition-all duration-300"
          style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 3, background: i === active ? "#2DD4BF" : "rgba(255,255,255,0.2)" }}
        />
      ))}
    </div>
  );
}

/* ── XO side panel ───────────────────────────────────────────────────────── */
function XOPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed right-0 top-0 bottom-0 z-[100] flex flex-col"
      style={{ width: "min(480px, 100vw)", background: "#0B1120", borderLeft: "1px solid rgba(45,212,191,0.2)" }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#2DD4BF" }}>LIVE INSTANCE</p>
          <p className="text-sm font-bold text-white">NoughtsAndCrosses</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all">
          <X size={14} />
        </button>
      </div>
      <iframe
        src="https://noughts-and-crosses-sepia.vercel.app"
        className="flex-1 w-full"
        title="NoughtsAndCrosses game"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </motion.div>
  );
}

/* ── Project section ─────────────────────────────────────────────────────── */
function ProjectSection({ project, onOpenXO }: { project: Project; onOpenXO: () => void }) {
  const isXO = project.id === "noughts-crosses";

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-center justify-between pb-16 xl:pb-20 pt-24 px-6 md:px-16 xl:px-48 gap-8 lg:gap-16">
      <div className="flex-1 max-w-xl space-y-4 z-10">
        {/* Status + index */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{project.subtitle}</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: "#f8fafc" }}>{project.title}</h2>

        <p className="text-sm text-slate-400 leading-relaxed">{project.description}</p>

        {/* Fun fact */}
        <div className="flex items-start gap-2 rounded-lg px-3 py-2.5" style={{ background: `${project.accent}0d`, border: `1px solid ${project.accent}22` }}>
          <span className="font-mono text-[9px] mt-0.5" style={{ color: project.accent }}>FACT</span>
          <p className="font-mono text-[10px] text-slate-400 leading-relaxed">{project.funFact}</p>
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-1">
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <GHIcon /> Source
          </a>
          {isXO && (
            <button onClick={onOpenXO}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105"
              style={{ background: "#14B8A6", color: "#060A14" }}>
              <ArrowRight size={12} /> Play Live
            </button>
          )}
          {!isXO && project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105"
              style={{ background: "#14B8A6", color: "#060A14" }}>
              <ExternalLink size={12} /> Live Instance
            </a>
          )}
        </div>
      </div>

      {/* Video Demo Placeholder */}
      <div className="flex-1 w-full max-w-2xl relative rounded-xl overflow-hidden border z-10" style={{ borderColor: "rgba(255,255,255,0.05)", aspectRatio: "16/9", background: "rgba(6,10,20,0.6)", backdropFilter: "blur(12px)" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-white/5 rounded-xl m-2 border-dashed">
           <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">Video Demo Space</span>
           <span className="font-mono text-[9px] text-slate-700">16:9 Aspect Ratio</span>
        </div>
      </div>
    </div>
  );
}

/* ── Animated background per section ────────────────────────────────────── */
const SECTION_ACCENTS = ["#2DD4BF", "#2DD4BF", "#C7B27B", "#A38E54", "#C7B27B", "#2DD4BF", "#A38E54", "#14B8A6", "#2DD4BF"];

function SectionBackground({ index }: { index: number }) {
  const accent = SECTION_ACCENTS[index] ?? "#2DD4BF";
  return (
    <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }} className="absolute inset-0 grid-bg">
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 60% at 70% 50%, ${accent}07, transparent)` }} />
      <div className="absolute inset-0" style={{ background: "rgba(6,10,20,0.75)" }} />
    </motion.div>
  );
}

/* ── Hero section ────────────────────────────────────────────────────────── */
function HeroContent() {
  const fadeUp = { hidden: { opacity: 0, y: 28 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } }) };
  return (
    <div className="w-full h-full flex items-center px-6 md:px-16 xl:px-48">
      <div className="max-w-3xl space-y-6">
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "#14B8A6" }}>
          ✦ &nbsp; Available for opportunities
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="relative">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.93]" style={{ color: "#f8fafc" }}>
            Sanjeev<br />
            <span style={{ color: "#2DD4BF" }}>
              Srinivas
            </span>
          </h1>
          <Polaroid />
        </motion.div>

        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="text-base md:text-lg font-semibold" style={{ color: "#94a3b8" }}>
          Software Developer &amp; Systems Architect
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="w-16 h-px bg-[#14B8A6]/50" />

        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={4}
          className="text-sm leading-relaxed text-slate-400 max-w-lg">
          Dual-degree student — <span style={{ color: "#C7B27B" }}>B.Tech CSE</span> &amp; <span style={{ color: "#C7B27B" }}>IIT Madras B.S.</span> Building scalable backend pipelines, distributed systems, and ML architectures at production scale.
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="flex flex-wrap gap-3">
          <a href="mailto:sanjnivas@gmail.com" id="hero-email"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "#14B8A6", color: "#060A14" }}>
            <Mail size={13} /> sanjnivas@gmail.com
          </a>
          <a href="https://github.com/EliteGamer007" target="_blank" rel="noopener noreferrer" id="hero-github"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:border-[#C7B27B] hover:text-[#C7B27B]"
            style={{ borderColor: "rgba(163,142,84,0.4)", color: "#A38E54" }}>
            <GHIcon /> EliteGamer007
          </a>
          <a href="https://linkedin.com/in/sanjeev-srinivas" target="_blank" rel="noopener noreferrer" id="hero-linkedin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:border-white/30 hover:text-white"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
            <LIIcon /> LinkedIn
          </a>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="flex items-center gap-2 pt-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Scroll to explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ArrowDown size={12} className="text-slate-600" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Skills section ──────────────────────────────────────────────────────── */
const SKILL_GROUPS = [
  { label: "Backend", items: ["Go", "Python", "FastAPI", "Flask", "gRPC", "REST"], color: "#2DD4BF" },
  { label: "Data & ML", items: ["XGBoost", "Pandas", "Scikit-learn", "Jupyter", "Matplotlib"], color: "#C7B27B" },
  { label: "Cloud & Infra", items: ["Docker", "Railway", "Cloudflare R2", "PostgreSQL", "Redis"], color: "#A38E54" },
  { label: "Frontend", items: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Streamlit"], color: "#2DD4BF" },
];

function SkillsContent() {
  return (
    <div className="w-full h-full flex items-center px-6 md:px-16 xl:px-48">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] mb-2" style={{ color: "#14B8A6" }}>Technical Stack</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: "#f8fafc" }}>What I Know</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {SKILL_GROUPS.map((g) => (
            <div key={g.label} className="rounded-xl p-4 border" style={{ background: "#0B1120", borderColor: "rgba(255,255,255,0.06)" }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: g.color }}>{g.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <span key={item} className="font-mono text-[10px] px-2 py-1 rounded" style={{ background: `${g.color}10`, color: `${g.color}cc`, border: `1px solid ${g.color}25` }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="font-mono text-xs text-slate-600 italic">+ written a research paper on Sitting Duck cyber-attacks · GeoGuessr nerd · DNS/networking curious</p>
      </div>
    </div>
  );
}

/* ── Contact section ─────────────────────────────────────────────────────── */
function ContactContent() {
  return (
    <div className="w-full h-full flex items-center px-6 md:px-16 xl:px-48">
      <div className="max-w-2xl space-y-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "#14B8A6" }}>Get In Touch</p>
        <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]" style={{ color: "#f8fafc" }}>
          Let&apos;s Build<br />
          <span style={{ color: "#2DD4BF" }}>
            Something Real.
          </span>
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed max-w-md">
          Open to internships, research collaborations, and interesting engineering problems. If you have a hard system to build — I want to hear about it.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:sanjnivas@gmail.com" id="contact-email"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#14B8A6", color: "#060A14" }}>
            <Mail size={14} /> sanjnivas@gmail.com
          </a>
          <a href="https://github.com/EliteGamer007" target="_blank" rel="noopener noreferrer" id="contact-github"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-all hover:border-white/30 hover:text-white"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
            <GHIcon /> GitHub / EliteGamer007
          </a>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-slate-700">Chennai, India · IST (UTC+5:30)</p>
      </div>
    </div>
  );
}

/* ── Section counter ─────────────────────────────────────────────────────── */
const TOTAL_SECTIONS = 1 + PROJECTS.length + 2; // hero + projects + skills + contact

/* ════════════════════════════════════════════════════════════════════════════
   ROOT PAGE
   ════════════════════════════════════════════════════════════════════════════ */
const sectionVariants = {
  enter: (d: number) => ({ opacity: 0, x: d === 1 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d === 1 ? -60 : 60 }),
};

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [section, setSection] = useState(0);
  const [direction, setDirection] = useState(1);
  const [xoOpen, setXoOpen] = useState(false);
  const scrolling = useRef(false);

  const goTo = useCallback((i: number) => {
    setSection((prev) => {
      const next = Math.max(0, Math.min(TOTAL_SECTIONS - 1, i));
      if (next !== prev) setDirection(next > prev ? 1 : -1);
      return next;
    });
  }, []);

  /* Wheel handler */
  useEffect(() => {
    if (!booted) return;
    const onWheel = (e: WheelEvent) => {
      if (scrolling.current) return;
      scrolling.current = true;
      goTo(section + (e.deltaY > 0 ? 1 : -1));
      setTimeout(() => { scrolling.current = false; }, 900);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [booted, section, goTo]);

  /* Keyboard handler */
  useEffect(() => {
    if (!booted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") goTo(section + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") goTo(section - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [booted, section, goTo]);

  /* Touch handler */
  const touchStart = useRef(0);
  useEffect(() => {
    if (!booted) return;
    const onTouchStart = (e: TouchEvent) => { touchStart.current = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) goTo(section + (delta > 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onTouchStart); window.removeEventListener("touchend", onTouchEnd); };
  }, [booted, section, goTo]);

  const projectIndex = section - 1; // 0-based project index (section 1 = first project)

  return (
    <>
      {/* Boot loader */}
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      {/* Telemetry layer */}
      {booted && <TelemetryLayer activeSection={section} />}

      {/* Nav dots */}
      {booted && <NavDots active={section} total={TOTAL_SECTIONS} onGo={goTo} />}

      {/* Minimal top-left logo */}
      {booted && (
        <div className="fixed top-5 left-5 z-50 xl:left-44">
          <button onClick={() => goTo(0)} className="font-mono text-sm font-black" style={{ color: "#2DD4BF" }}>SS</button>
        </div>
      )}

      {/* Section counter top-right */}
      {booted && (
        <div className="fixed top-5 right-5 z-50 xl:right-44 font-mono text-[10px] text-slate-600 tracking-widest">
          {String(section + 1).padStart(2, "0")} / {String(TOTAL_SECTIONS).padStart(2, "0")}
        </div>
      )}

      {/* Main locked scroll container */}
      <main className="fixed inset-0 overflow-hidden" style={{ visibility: booted ? "visible" : "hidden" }}>
        <AnimatePresence mode="wait">
          <SectionBackground key={`bg-${section}`} index={section} />
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`section-${section}`}
            custom={direction}
            variants={sectionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
            className="absolute inset-0"
          >
            {section === 0 && <HeroContent />}
            {section >= 1 && section <= PROJECTS.length && (
              <ProjectSection project={PROJECTS[projectIndex]} onOpenXO={() => setXoOpen(true)} />
            )}
            {section === PROJECTS.length + 1 && <SkillsContent />}
            {section === PROJECTS.length + 2 && <ContactContent />}
          </motion.div>
        </AnimatePresence>

        {/* Footer label */}
        <div className="absolute bottom-4 right-6 xl:right-48 font-mono text-[8px] uppercase tracking-widest text-slate-700">
          {SECTION_LABELS[section]}
        </div>

        {/* Mobile swipe hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-widest text-slate-700 md:hidden">
          swipe to navigate
        </div>
      </main>

      {/* XO side panel */}
      <AnimatePresence>
        {xoOpen && <XOPanel onClose={() => setXoOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
