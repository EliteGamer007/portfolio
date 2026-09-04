"use client";

import { useEffect, useRef } from "react";

/**
 * A quiet layer of stack glyphs drifting behind the content.
 *
 * Every mark is drawn by hand rather than pulled from a logo set — simple
 * geometry that always renders correctly, at an opacity low enough to read as
 * texture instead of decoration. The whole layer parallaxes against the rail.
 */

type Glyph = (props: { size: number }) => React.ReactElement;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Braces: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M8.5 3.5C6.5 3.5 6.5 7 6.5 8.5S5.5 12 4 12c1.5 0 2.5 2 2.5 3.5s0 5 2 5" />
    <path d="M15.5 3.5c2 0 2 3.5 2 5s1 3.5 2.5 3.5c-1.5 0-2.5 2-2.5 3.5s0 5-2 5" />
  </svg>
);

const Terminal: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
    <path d="M6.5 9.5 9.5 12l-3 2.5M12.5 15h5" />
  </svg>
);

const Database: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
    <path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13" />
    <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
  </svg>
);

const Container: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" />
    <path d="M3 7l9 4.5L21 7M12 11.5v10" />
  </svg>
);

const Branch: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <circle cx="6.5" cy="5" r="2.5" />
    <circle cx="6.5" cy="19" r="2.5" />
    <circle cx="17.5" cy="9" r="2.5" />
    <path d="M6.5 7.5v9M17.5 11.5c0 3.5-4 3-8 5" />
  </svg>
);

const Cloud: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M6.5 18.5a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 16.8 9a3.8 3.8 0 0 1 .7 9.5z" />
  </svg>
);

const Network: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="4.5" r="2.2" />
    <circle cx="4.5" cy="17" r="2.2" />
    <circle cx="19.5" cy="17" r="2.2" />
    <path d="M10.6 6.4 6 15M13.4 6.4 18 15M6.7 17h10.6" />
  </svg>
);

const Globe: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.2 9.5h17.6M3.2 14.5h17.6" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
  </svg>
);

const Signal: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M3 15.5c2-4 3.2 3 5 3s2.4-11 4-11 2.2 8 4 8 2.6-4 5-4" />
  </svg>
);

const Hexagon: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 2.5 20.5 7.3v9.4L12 21.5 3.5 16.7V7.3z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Key: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <circle cx="7.5" cy="12" r="4" />
    <path d="M11.5 12H21M18 12v3.5M14.8 12v2.5" />
  </svg>
);

const Layers: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3 21.5 8 12 13 2.5 8z" />
    <path d="M2.5 12.5 12 17.5l9.5-5M2.5 16.5 12 21.5l9.5-5" />
  </svg>
);

/** Word marks, for the parts of the stack a glyph can't say. */
const WORDS = ["Go", "py", "TS", "SQL", "HTTP", "gRPC"];

interface Item {
  x: number;
  y: number;
  size: number;
  depth: number;
  duration: number;
  delay: number;
  opacity: number;
  glyph?: Glyph;
  word?: string;
}

/* Positions are hand-placed so nothing lands behind the reading column. */
const ITEMS: Item[] = [
  { x: 7, y: 16, size: 30, depth: 0.22, duration: 27, delay: 0, opacity: 0.1, glyph: Braces },
  { x: 88, y: 12, size: 34, depth: 0.4, duration: 31, delay: 2.4, opacity: 0.11, glyph: Container },
  { x: 78, y: 74, size: 27, depth: 0.3, duration: 24, delay: 1.1, opacity: 0.09, glyph: Database },
  { x: 15, y: 78, size: 32, depth: 0.5, duration: 29, delay: 3.2, opacity: 0.1, glyph: Network },
  { x: 94, y: 45, size: 24, depth: 0.18, duration: 33, delay: 0.6, opacity: 0.08, glyph: Cloud },
  { x: 3, y: 47, size: 26, depth: 0.36, duration: 26, delay: 4.1, opacity: 0.09, glyph: Terminal },
  { x: 62, y: 8, size: 22, depth: 0.26, duration: 30, delay: 1.8, opacity: 0.08, glyph: Branch },
  { x: 45, y: 88, size: 28, depth: 0.44, duration: 28, delay: 2.9, opacity: 0.09, glyph: Globe },
  { x: 70, y: 30, size: 20, depth: 0.14, duration: 35, delay: 5.0, opacity: 0.07, glyph: Hexagon },
  { x: 30, y: 6, size: 25, depth: 0.32, duration: 25, delay: 3.7, opacity: 0.08, glyph: Signal },
  { x: 55, y: 66, size: 23, depth: 0.2, duration: 32, delay: 0.9, opacity: 0.07, glyph: Key },
  { x: 22, y: 38, size: 21, depth: 0.28, duration: 34, delay: 4.6, opacity: 0.07, glyph: Layers },
  { x: 84, y: 60, size: 15, depth: 0.34, duration: 29, delay: 1.5, opacity: 0.13, word: WORDS[0] },
  { x: 10, y: 62, size: 15, depth: 0.24, duration: 27, delay: 3.0, opacity: 0.12, word: WORDS[1] },
  { x: 66, y: 92, size: 15, depth: 0.46, duration: 31, delay: 2.1, opacity: 0.12, word: WORDS[2] },
  { x: 38, y: 22, size: 15, depth: 0.16, duration: 33, delay: 4.9, opacity: 0.1, word: WORDS[3] },
  { x: 92, y: 84, size: 15, depth: 0.38, duration: 26, delay: 0.3, opacity: 0.11, word: WORDS[4] },
  { x: 48, y: 48, size: 15, depth: 0.12, duration: 36, delay: 5.4, opacity: 0.09, word: WORDS[5] },
];

export default function FloatingStack() {
  const layerRef = useRef<HTMLDivElement>(null);

  /* Parallax: the layer slides against the rail, deeper items moving more. */
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>(".rail");
    const layer = layerRef.current;
    if (!rail || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const progress = rail.scrollLeft / (rail.clientWidth || 1);
        for (const el of Array.from(layer.children) as HTMLElement[]) {
          const depth = Number(el.dataset.depth ?? 0);
          el.style.setProperty("--px", `${-progress * depth * 120}px`);
        }
      });
    };

    rail.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      rail.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="floaters" aria-hidden="true" ref={layerRef}>
      {ITEMS.map((it, i) => (
        <div
          key={i}
          data-depth={it.depth}
          className="floater"
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            opacity: it.opacity,
            translate: "var(--px, 0px) 0",
            ["--drift-duration" as string]: `${it.duration}s`,
            ["--drift-delay" as string]: `${it.delay}s`,
          }}
        >
          {it.word ? (
            <span
              className="font-mono font-medium"
              style={{ fontSize: it.size, letterSpacing: "-0.02em" }}
            >
              {it.word}
            </span>
          ) : (
            it.glyph && <it.glyph size={it.size} />
          )}
        </div>
      ))}
    </div>
  );
}
