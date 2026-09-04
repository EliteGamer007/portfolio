"use client";

import { useState } from "react";
import { Waypoints } from "lucide-react";
import Modal from "./Modal";
import { DIAGRAMS, type DiagramKey } from "@/components/diagrams/Diagrams";

export default function ArchButton({
  diagram,
  projectTitle,
}: {
  diagram: DiagramKey;
  projectTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const { title, caption, Svg } = DIAGRAMS[diagram];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-ghost group"
        aria-haspopup="dialog"
      >
        <Waypoints
          size={14}
          className="transition-transform duration-300 group-hover:rotate-90"
        />
        Architecture
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow={projectTitle}
        title={title}
      >
        <div className="px-5 py-6 sm:px-7">
          {/* Diagrams stay legible by scrolling sideways on narrow screens
              rather than shrinking into illegibility. */}
          <div
            className="overflow-x-auto rounded-xl"
            style={{ background: "rgba(6, 9, 15, 0.6)", border: "1px solid var(--line)" }}
          >
            <div className="min-w-[680px] p-2 sm:p-4">
              <Svg />
            </div>
          </div>

          <p className="prose-dim mt-5 max-w-2xl text-[13.5px]">{caption}</p>

          <p className="eyebrow mt-4 sm:hidden">Scroll the diagram sideways →</p>
        </div>
      </Modal>
    </>
  );
}
