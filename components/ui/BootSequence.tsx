"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "[  0.001] Initializing runtime kernel...",
  "[  0.048] Mounting storage volumes → /var/portfolio/projects",
  "[  0.112] Pulling containers: splitter:latest ✓",
  "[  0.198] Pulling containers: f1-telemetry:latest ✓",
  "[  0.231] Pulling containers: deepfake-detect:latest ✓",
  "[  0.290] Starting FastAPI inference server on :8000",
  "[  0.340] PostgreSQL: connection pool ready (max=20)",
  "[  0.401] ActivityPub federation layer: ONLINE",
  "[  0.478] WebSocket broker: binding to ws://0.0.0.0:8765",
  "[  0.512] Telemetry ingestion pipeline: 3 nodes active",
  "[  0.601] GitHub commit stream: synced (22 repos)",
  "[  0.688] All systems nominal. Launching interface...",
];

interface Props {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset on Strict Mode remount
    indexRef.current = 0;
    setVisibleLines([]);
    setDone(false);

    const interval = setInterval(() => {
      const line = BOOT_LINES[indexRef.current];
      if (line !== undefined) {
        setVisibleLines((prev) => [...prev, line]);
        indexRef.current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 500);
        }, 300);
      }
    }, 140);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col justify-center px-8 md:px-24"
          style={{ background: "#060A14" }}
        >
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(20,184,166,0.015) 3px, rgba(20,184,166,0.015) 4px)",
            }}
          />

          <div className="relative max-w-2xl w-full">
            {/* Log output */}
            <div className="space-y-1 font-mono text-xs">
              {visibleLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex gap-3"
                >
                  <span style={{ color: "rgba(45,212,191,0.4)" }}>$</span>
                  <span
                    style={{
                      color:
                        line?.includes("ONLINE") || line?.includes("✓") || line?.includes("nominal")
                          ? "#2DD4BF"
                          : line?.includes("Launching")
                          ? "#C7B27B"
                          : "rgba(226,232,240,0.6)",
                    }}
                  >
                    {line}
                  </span>
                </motion.div>
              ))}

              {/* Blinking cursor */}
              {!done && (
                <div className="flex gap-3 mt-1">
                  <span style={{ color: "rgba(45,212,191,0.4)" }}>$</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-3 bg-[#2DD4BF]"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
