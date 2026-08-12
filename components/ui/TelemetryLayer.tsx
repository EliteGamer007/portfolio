"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Sparkline ─────────────────────────────────────────────────────────── */
function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 80;
  const H = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * H;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={W} height={H} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#2DD4BF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
      {/* Last point dot */}
      {data.length > 0 && (
        <circle
          cx={(((data.length - 1) / (data.length - 1)) * W)}
          cy={H - ((data[data.length - 1] - min) / range) * H}
          r="2.5"
          fill="#2DD4BF"
        />
      )}
    </svg>
  );
}

/* ─── Project alerts — fun fact notes ──────────────────────────────────── */
const ALERTS = [
  { project: "Splitter", note: "ActivityPub federation handles ~120 inbox ops/min", color: "#2DD4BF" },
  { project: "F1 Telemetry", note: "Polls FastF1 every 45s during live race sessions", color: "#C7B27B" },
  { project: "Deepfake Detect", note: "Hybrid local+Gemini fallback — runs offline in demos", color: "#A38E54" },
  { project: "NoughtsAndCrosses", note: "FastAPI serves game state via REST, ~4ms avg response", color: "#2DD4BF" },
  { project: "ML Regression", note: "XGBoost R² = 0.91 on e-commerce session data", color: "#C7B27B" },
  { project: "Archipelago", note: "Causal timeline reconstructed from execution log diffs", color: "#A38E54" },
];

/* ─── Skill tags for left panel ─────────────────────────────────────────── */
const SKILLS_LEFT = [
  { label: "Go", color: "#00ADD8" },
  { label: "Python", color: "#3776AB" },
  { label: "FastAPI", color: "#009688" },
  { label: "PostgreSQL", color: "#336791" },
  { label: "Docker", color: "#2496ED" },
  { label: "Redis", color: "#DC382D" },
];

const SKILLS_RIGHT = [
  { label: "XGBoost", color: "#C7B27B" },
  { label: "TypeScript", color: "#3178C6" },
  { label: "Next.js", color: "#f1f5f9" },
  { label: "WebSockets", color: "#2DD4BF" },
  { label: "ActivityPub", color: "#A38E54" },
  { label: "Pandas", color: "#150458" },
];

interface Props {
  activeSection: number;
}

export default function TelemetryLayer({ activeSection }: Props) {
  const [sparkData, setSparkData] = useState<number[]>([3, 7, 5, 12, 8, 15, 10, 18, 14, 20, 16, 22]);
  const [alertIndex, setAlertIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  /* Sparkline ticker */
  useEffect(() => {
    const sparkInterval = setInterval(() => {
      setSparkData((prev) => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 20 + 5)];
        return next;
      });
    }, 2500);

    // Rotate alerts every 8s
    const alertTimeout = setTimeout(() => {
      setShowAlert(true);
      const alertInterval = setInterval(() => {
        setShowAlert(false);
        setTimeout(() => {
          setAlertIndex((i) => (i + 1) % ALERTS.length);
          setShowAlert(true);
        }, 600);
      }, 8000);
      return () => clearInterval(alertInterval);
    }, 3000);

    return () => {
      clearInterval(sparkInterval);
      clearTimeout(alertTimeout);
    };
  }, []);

  const alert = ALERTS[alertIndex];

  return (
    <>
      {/* ── LEFT PANEL ───────────────────────────────────────────────────── */}
      <div
        className="fixed left-0 top-0 bottom-0 z-40 hidden xl:flex flex-col justify-between py-8 px-4"
        style={{ width: "160px", pointerEvents: "none" }}
      >
        <div className="flex flex-col gap-3" style={{ pointerEvents: "auto" }}>

          {/* Section indicator */}
          <div
            className="rounded-lg px-3 py-2"
            style={{
              background: "rgba(11,17,32,0.7)",
              border: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="font-mono text-[8px] uppercase tracking-widest mb-2" style={{ color: "rgba(226,232,240,0.3)" }}>
              CURRENT NODE
            </p>
            <p className="font-mono text-[10px] font-bold" style={{ color: "#C7B27B" }}>
              {["BOOT", "HERO", "SPLITTER", "F1-TELEMETRY", "DEEPFAKE", "ML-REG", "XO-GAME", "SKILLS", "CONTACT"][Math.min(activeSection, 8)] ?? "HERO"}
            </p>
          </div>

          {/* Skill tool chips */}
          <div
            className="rounded-lg px-3 py-2 flex flex-col gap-1.5"
            style={{
              background: "rgba(11,17,32,0.7)",
              border: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="font-mono text-[8px] uppercase tracking-widest mb-1" style={{ color: "rgba(226,232,240,0.3)" }}>
              STACK
            </p>
            {SKILLS_LEFT.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="font-mono text-[9px]" style={{ color: "rgba(226,232,240,0.55)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical line bottom */}
        <div
          className="mx-auto w-px"
          style={{
            height: "60px",
            background: "rgba(45,212,191,0.2)",
          }}
        />
      </div>

      {/* ── RIGHT PANEL ──────────────────────────────────────────────────── */}
      <div
        className="fixed right-0 top-0 bottom-0 z-40 hidden xl:flex flex-col justify-between py-8 px-4"
        style={{ width: "160px", pointerEvents: "none" }}
      >
        <div className="flex flex-col gap-3" style={{ pointerEvents: "auto" }}>
          {/* Sparkline widget */}
          <div
            className="rounded-lg px-3 py-3"
            style={{
              background: "rgba(11,17,32,0.85)",
              border: "1px solid rgba(45,212,191,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: "rgba(226,232,240,0.35)" }}>
                COMMIT DENSITY
              </span>
            </div>
            <Sparkline data={sparkData} />
            <p className="font-mono text-[8px] mt-2" style={{ color: "rgba(45,212,191,0.5)" }}>
              7d rolling avg
            </p>
          </div>

          {/* More stack tags */}
          <div
            className="rounded-lg px-3 py-2 flex flex-col gap-1.5"
            style={{
              background: "rgba(11,17,32,0.7)",
              border: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="font-mono text-[8px] uppercase tracking-widest mb-1" style={{ color: "rgba(226,232,240,0.3)" }}>
              ALSO
            </p>
            {SKILLS_RIGHT.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="font-mono text-[9px]" style={{ color: "rgba(226,232,240,0.55)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical text */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-px"
            style={{
              height: "40px",
              background: "rgba(20,184,166,0.3)",
            }}
          />
          <span
            className="font-mono text-[8px] uppercase tracking-[0.2em]"
            style={{
              color: "rgba(20,184,166,0.4)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            BACKEND • ML • CLOUD
          </span>
          <div
            className="w-px"
            style={{
              height: "40px",
              background: "rgba(20,184,166,0.3)",
            }}
          />
        </div>
      </div>

      {/* ── FLOATING PROJECT ALERT (bottom-center) ───────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:block" style={{ pointerEvents: "none" }}>
        <AnimatePresence mode="wait">
          {showAlert && (
            <motion.div
              key={alertIndex}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5"
              style={{
                background: "rgba(11,17,32,0.92)",
                border: `1px solid ${alert.color}25`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${alert.color}10`,
                maxWidth: "440px",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                style={{ background: alert.color }}
              />
              <span className="font-mono text-[10px]" style={{ color: "rgba(226,232,240,0.5)" }}>
                <span style={{ color: alert.color }}>[{alert.project}]</span>{" "}
                {alert.note}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
