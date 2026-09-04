"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  /** "sheet" slides in from the right; "center" scales up in place. */
  variant?: "sheet" | "center";
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  title,
  eyebrow,
  variant = "center",
  children,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  /* Escape to close, Tab kept inside the dialog, scroll locked behind it. */
  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus in once the panel has mounted.
    const focusTimer = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panelRef.current)?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      restoreTo.current?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const isSheet = variant === "sheet";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex" role="presentation">
          <motion.button
            type="button"
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 cursor-default"
            style={{ background: "rgba(4, 7, 14, 0.72)", backdropFilter: "blur(6px)" }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={isSheet ? { x: "100%" } : { opacity: 0, scale: 0.97, y: 12 }}
            animate={isSheet ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isSheet ? { x: "100%" } : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className={
              isSheet
                ? "relative ml-auto flex h-full w-full max-w-[520px] flex-col"
                : "relative m-auto flex max-h-[92dvh] w-[min(1040px,94vw)] flex-col overflow-hidden rounded-2xl"
            }
            style={{
              background: "#0a0f1a",
              border: "1px solid var(--line-strong)",
              borderRadius: isSheet ? 0 : undefined,
              borderRight: isSheet ? "none" : undefined,
              boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
            }}
          >
            <header
              className="flex shrink-0 items-start justify-between gap-4 px-5 py-4 sm:px-7"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <div className="min-w-0">
                {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
                <h2 className="truncate text-[15px] font-medium text-[color:var(--color-paper)]">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[color:var(--color-paper-mute)] transition-colors hover:text-[color:var(--color-paper)]"
                style={{ border: "1px solid var(--line)" }}
              >
                <X size={15} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
