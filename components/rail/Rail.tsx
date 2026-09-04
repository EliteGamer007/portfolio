"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface PanelMeta {
  id: string;
  label: string;
}

/**
 * The horizontal rail.
 *
 * Scrolling is the browser's, not ours — CSS scroll-snap does the settling, so
 * momentum, trackpads, touch and the scrollbar all behave natively. The only
 * thing intercepted is the vertical wheel, translated to horizontal movement,
 * and only when the panel under the cursor has nothing left to scroll itself.
 */
export default function Rail({
  panels,
  children,
}: {
  panels: PanelMeta[];
  children: ReactNode;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const animRef = useRef(0);
  /**
   * Where the rail is heading. Navigation steps from this rather than from
   * `index`, which is repainted from a rAF-throttled scroll listener and so
   * lags behind rapid keypresses.
   */
  const targetRef = useRef(0);

  /** The panel currently filling the viewport, read straight off the DOM. */
  const liveIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return 0;
    return Math.round(rail.scrollLeft / (rail.clientWidth || 1));
  }, []);

  /** Abandon an in-flight jump and hand scrolling back to the browser. */
  const stopAnim = useCallback(() => {
    targetRef.current = liveIndex();
    if (!animRef.current) return;
    cancelAnimationFrame(animRef.current);
    animRef.current = 0;
    if (railRef.current) railRef.current.style.scrollSnapType = "";
  }, [liveIndex]);

  /**
   * Jump to a panel.
   *
   * The scroll is tweened by hand rather than with `behavior: "smooth"` —
   * native smooth scrolling is silently ignored in enough environments
   * (and cancelled outright by scroll snapping across several snap points)
   * that depending on it means the nav quietly does nothing.
   */
  const scrollToIndex = useCallback(
    (i: number, smooth = true) => {
      const rail = railRef.current;
      if (!rail) return;

      const target = Math.max(0, Math.min(panels.length - 1, i));
      const panel = rail.children[target] as HTMLElement | undefined;
      if (!panel) return;

      const from = rail.scrollLeft;
      // Measured against the rail, so this holds even if a panel is not
      // exactly one viewport wide.
      const to = panel.getBoundingClientRect().left - rail.getBoundingClientRect().left + from;
      const distance = to - from;
      if (Math.abs(distance) < 1) return;

      // Cancel any jump already running first — it resets the target ref, so
      // claim the destination afterwards.
      stopAnim();
      targetRef.current = target;

      // A hidden tab never runs rAF, so animating there would leave the rail
      // parked where it started.
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!smooth || reduce || document.hidden) {
        rail.scrollLeft = to;
        return;
      }

      // Snapping fights a scroll it did not start; lift it for the tween.
      rail.style.scrollSnapType = "none";

      const panelsCrossed = Math.abs(distance) / (rail.clientWidth || 1);
      const duration = Math.min(240 + panelsCrossed * 90, 620);
      const started = performance.now();
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const step = (now: number) => {
        const t = Math.min((now - started) / duration, 1);
        rail.scrollLeft = from + distance * easeOutCubic(t);
        if (t < 1) {
          animRef.current = requestAnimationFrame(step);
        } else {
          animRef.current = 0;
          rail.style.scrollSnapType = "";
        }
      };
      animRef.current = requestAnimationFrame(step);
    },
    [panels.length, stopAnim]
  );

  // A jump in progress must yield the moment the user takes over.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    // Not keydown — arrow navigation goes through scrollToIndex, which
    // already cancels the previous jump before starting its own.
    const events = ["wheel", "touchstart", "pointerdown"] as const;
    events.forEach((e) => rail.addEventListener(e, stopAnim, { passive: true }));
    return () => {
      events.forEach((e) => rail.removeEventListener(e, stopAnim));
      stopAnim();
    };
  }, [stopAnim]);

  /* ── Track position ─────────────────────────────────────────────────── */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const w = rail.clientWidth || 1;
        const max = rail.scrollWidth - w;
        const i = Math.round(rail.scrollLeft / w);
        setIndex(i);
        if (!animRef.current) targetRef.current = i;
        setProgress(max > 0 ? rail.scrollLeft / max : 0);
      });
    };

    rail.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      rail.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* ── Vertical wheel → horizontal rail ───────────────────────────────── */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onWheel = (e: WheelEvent) => {
      // A deliberate horizontal gesture already does the right thing.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // If this panel still has somewhere to scroll vertically, let it.
      const panel = (e.target as HTMLElement)?.closest?.(".panel") as HTMLElement | null;
      if (panel && panel.scrollHeight > panel.clientHeight + 1) {
        const atTop = panel.scrollTop <= 0;
        const atBottom =
          panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
      }

      // Anything inside its own scroller (a modal, a code block) keeps it too.
      if ((e.target as HTMLElement)?.closest?.("[data-own-scroll]")) return;

      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    };

    rail.addEventListener("wheel", onWheel, { passive: false });
    return () => rail.removeEventListener("wheel", onWheel);
  }, []);

  /* ── Keyboard ───────────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t?.tagName === "INPUT" ||
        t?.tagName === "TEXTAREA" ||
        t?.isContentEditable ||
        document.querySelector('[role="dialog"]')
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        scrollToIndex(targetRef.current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        scrollToIndex(targetRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToIndex(panels.length - 1);
      } else if (/^[1-9]$/.test(e.key)) {
        const n = Number(e.key) - 1;
        if (n < panels.length) {
          e.preventDefault();
          scrollToIndex(n);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panels.length, scrollToIndex]);

  /* ── External jumps: command palette, in-page links, initial #hash ──── */
  useEffect(() => {
    const jump = (id: string, smooth = true) => {
      const i = panels.findIndex((p) => p.id === id);
      if (i >= 0) scrollToIndex(i, smooth);
    };

    const onGoto = (e: Event) => jump((e as CustomEvent<string>).detail);
    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (id) jump(id);
    };

    window.addEventListener("rail:goto", onGoto as EventListener);
    window.addEventListener("hashchange", onHash);

    // Land on the right panel when arriving at /#something.
    const initial = window.location.hash.slice(1);
    if (initial) {
      const t = window.setTimeout(() => jump(initial, false), 80);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener("rail:goto", onGoto as EventListener);
        window.removeEventListener("hashchange", onHash);
      };
    }

    return () => {
      window.removeEventListener("rail:goto", onGoto as EventListener);
      window.removeEventListener("hashchange", onHash);
    };
  }, [panels, scrollToIndex]);

  /* ── Reveal-on-enter for anything marked .reveal ────────────────────── */
  useEffect(() => {
    // The hidden state is gated on this class, so it is only ever added when
    // there is a working observer to take it back off again.
    if (!("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    let io: IntersectionObserver | null = null;

    const start = () => {
      if (io) return;
      root.classList.add("js-reveal");
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15 }
      );
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => io!.observe(el));
    };

    // A hidden tab doesn't run the observer, so wait until it is on screen
    // rather than hiding content that nothing will bring back.
    if (document.visibilityState === "visible") start();
    else document.addEventListener("visibilitychange", start, { once: true });

    return () => {
      document.removeEventListener("visibilitychange", start);
      io?.disconnect();
    };
  }, []);

  const atStart = index <= 0;
  const atEnd = index >= panels.length - 1;

  return (
    <>
      <div
        ref={railRef}
        className="rail"
        id="main"
        tabIndex={-1}
        role="region"
        aria-label="Portfolio sections — use arrow keys to move between them"
      >
        {children}
      </div>

      {/* ── Progress + navigation, pinned to the bottom edge ───────────── */}
      <nav
        className="no-print fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6"
        style={{
          background: "linear-gradient(to top, rgba(6,9,15,0.92), transparent)",
        }}
        aria-label="Section navigation"
      >
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollToIndex(targetRef.current - 1)}
            disabled={atStart}
            aria-label="Previous section"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all disabled:opacity-25"
            style={{ border: "1px solid var(--line)", color: "var(--color-paper-dim)" }}
          >
            <ArrowLeft size={13} />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(targetRef.current + 1)}
            disabled={atEnd}
            aria-label="Next section"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all disabled:opacity-25"
            style={{ border: "1px solid var(--line)", color: "var(--color-paper-dim)" }}
          >
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Continuous progress line — reads as position, not decoration */}
        <div className="relative h-px flex-1" style={{ background: "var(--line)" }}>
          <div
            className="absolute inset-y-0 left-0 origin-left"
            style={{
              width: `${Math.max(progress * 100, 2)}%`,
              background: "var(--color-azure-400)",
              transition: "width 0.18s linear",
            }}
          />
          {/* Tick per panel, doubling as a jump target on wider screens */}
          <div className="absolute inset-0 hidden items-center justify-between md:flex">
            {panels.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => scrollToIndex(i)}
                title={p.label}
                aria-label={`Go to ${p.label}`}
                aria-current={i === index ? "true" : undefined}
                className="group relative h-6 w-6"
              >
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                  style={{
                    width: i === index ? 7 : 4,
                    height: i === index ? 7 : 4,
                    background: i <= index ? "var(--color-azure-400)" : "var(--color-ink-600)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <p
          className="eyebrow shrink-0 tabular-nums"
          style={{ color: "var(--color-paper-dim)" }}
          aria-live="polite"
        >
          <span className="hidden sm:inline">{panels[index]?.label} · </span>
          {String(index + 1).padStart(2, "0")}/{String(panels.length).padStart(2, "0")}
        </p>
      </nav>
    </>
  );
}
