"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, FileText, Mail, Home, Radar, Check, Award } from "lucide-react";
import { Github, Linkedin, type IconProps } from "./BrandIcons";
import { PROJECTS } from "@/lib/projects";
import { SITE } from "@/lib/config";

type Cmd = {
  id: string;
  label: string;
  group: "Go to" | "Case studies" | "Links";
  hint?: string;
  Icon: React.ComponentType<IconProps>;
  run: () => void;
};

/** Ask the rail to scroll to a panel; fall back to a hash navigation. */
export function goToPanel(id: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("rail:goto", { detail: id }));
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Opening always starts from a clean query, so there is no state to sync
  // after the fact.
  const openPalette = useCallback(() => {
    setQ("");
    setActive(0);
    setOpen(true);
  }, []);
  const togglePalette = useCallback(() => {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        setQ("");
        setActive(0);
      }
      return !wasOpen;
    });
  }, []);

  const navigate = useCallback(
    (panelId: string) => {
      if (pathname === "/") goToPanel(panelId);
      else router.push(`/#${panelId}`);
    },
    [pathname, router]
  );

  const commands = useMemo<Cmd[]>(() => {
    const list: Cmd[] = [
      { id: "home", label: "Home", group: "Go to", Icon: Home, run: () => navigate("home") },
      {
        id: "certificates",
        label: "Certificates",
        group: "Go to",
        hint: "/certificates",
        Icon: Award,
        run: () => router.push("/certificates"),
      },
      {
        id: "research",
        label: "Sitting Duck research & DNS tool",
        group: "Go to",
        hint: "live",
        Icon: Radar,
        run: () => navigate("research"),
      },
      {
        id: "stack",
        label: "Stack & activity",
        group: "Go to",
        Icon: ArrowRight,
        run: () => navigate("stack"),
      },
      {
        id: "contact",
        label: "Contact",
        group: "Go to",
        Icon: Mail,
        run: () => navigate("contact"),
      },
      {
        id: "resume",
        label: "Résumé",
        group: "Go to",
        hint: "/resume",
        Icon: FileText,
        run: () => router.push("/resume"),
      },
    ];

    for (const p of PROJECTS) {
      list.push({
        id: `work-${p.slug}`,
        label: p.title,
        group: "Case studies",
        hint: p.subtitle,
        Icon: ArrowRight,
        run: () => router.push(`/work/${p.slug}`),
      });
    }

    list.push(
      {
        id: "copy-email",
        label: copied ? "Copied" : "Copy email address",
        group: "Links",
        hint: SITE.email,
        Icon: copied ? Check : Mail,
        run: () => {
          void navigator.clipboard?.writeText(SITE.email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        },
      },
      {
        id: "github",
        label: "GitHub",
        group: "Links",
        hint: `@${SITE.githubUser}`,
        Icon: Github,
        run: () => window.open(SITE.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        group: "Links",
        Icon: Linkedin,
        run: () => window.open(SITE.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "pdf",
        label: "Download résumé PDF",
        group: "Links",
        Icon: FileText,
        run: () => window.open(SITE.resumePdf, "_blank", "noopener,noreferrer"),
      }
    );

    return list;
  }, [navigate, router, copied]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase().includes(needle)
    );
  }, [q, commands]);

  /* ⌘K / Ctrl+K anywhere, and "/" when not already typing. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        openPalette();
      }
    };
    const onToggle = () => togglePalette();

    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:toggle", onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:toggle", onToggle);
    };
  }, [open, openPalette, togglePalette]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    listRef.current
      ?.querySelectorAll("li")
      [active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = results[active];
      if (!cmd) return;
      cmd.run();
      if (cmd.id !== "copy-email") setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  if (typeof document === "undefined") return null;

  let lastGroup = "";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[12vh]">
          <motion.button
            type="button"
            aria-label="Close command palette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default"
            style={{ background: "rgba(4,7,14,0.7)", backdropFilter: "blur(5px)" }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[560px] overflow-hidden rounded-xl"
            style={{
              background: "#0a0f1a",
              border: "1px solid var(--line-strong)",
              boxShadow: "0 26px 70px rgba(0,0,0,0.6)",
            }}
          >
            <div
              className="flex items-center gap-3 px-4"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <Search size={15} style={{ color: "var(--color-paper-mute)" }} />
              <input
                autoFocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search projects, pages, links…"
                aria-label="Search commands"
                className="w-full bg-transparent py-3.5 text-[14px] outline-none"
                style={{ color: "var(--color-paper)" }}
              />
              <kbd
                className="hidden shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] sm:block"
                style={{ border: "1px solid var(--line)", color: "var(--color-paper-mute)" }}
              >
                ESC
              </kbd>
            </div>

            <ul ref={listRef} className="max-h-[54vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <li className="px-4 py-6 text-center text-[13px]" style={{ color: "var(--color-paper-mute)" }}>
                  Nothing matches “{q}”.
                </li>
              )}
              {results.map((c, i) => {
                const showGroup = c.group !== lastGroup;
                lastGroup = c.group;
                return (
                  <li key={c.id}>
                    {showGroup && <p className="eyebrow px-4 pb-1 pt-3">{c.group}</p>}
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => {
                        c.run();
                        if (c.id !== "copy-email") setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      style={{ background: i === active ? "rgba(116,160,255,0.09)" : "transparent" }}
                    >
                      <c.Icon
                        size={14}
                        style={{ color: i === active ? "var(--color-azure-300)" : "var(--color-paper-mute)" }}
                      />
                      <span className="flex-1 truncate text-[13.5px]" style={{ color: "var(--color-paper)" }}>
                        {c.label}
                      </span>
                      {c.hint && (
                        <span className="hidden truncate font-mono text-[11px] sm:block" style={{ color: "var(--color-paper-mute)" }}>
                          {c.hint}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
