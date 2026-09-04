"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Command } from "lucide-react";
import { goToPanel } from "./CommandPalette";

export default function TopBar({ home = true }: { home?: boolean }) {
  // The platform never changes mid-session, so there is nothing to subscribe
  // to — this just reads it on the client and renders "Ctrl" on the server.
  const mac = useSyncExternalStore(
    () => () => {},
    () => /mac|iphone|ipad/i.test(navigator.userAgent),
    () => false
  );

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6">
      {home ? (
        <button
          type="button"
          onClick={() => goToPanel("home")}
          aria-label="Back to start"
          className="font-mono text-[13px] tracking-tight"
          style={{ color: "var(--color-azure-300)" }}
        >
          SS<span style={{ color: "var(--color-paper-mute)" }}>.</span>
        </button>
      ) : (
        <Link
          href="/"
          className="font-mono text-[13px] tracking-tight"
          style={{ color: "var(--color-azure-300)" }}
        >
          SS<span style={{ color: "var(--color-paper-mute)" }}>.</span>
        </Link>
      )}

      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("palette:toggle"))}
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors"
        style={{ border: "1px solid var(--line)", color: "var(--color-paper-mute)" }}
        aria-label="Open command palette"
      >
        <Command size={12} />
        <span className="hidden font-mono text-[10.5px] sm:inline">
          {mac ? "⌘" : "Ctrl"} K
        </span>
        <span className="font-mono text-[10.5px] sm:hidden">Search</span>
      </button>
    </header>
  );
}
