"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import Modal from "./Modal";

export default function LiveEmbedButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-primary" aria-haspopup="dialog">
        <Play size={13} />
        Play it here
      </button>

      <Modal open={open} onClose={() => setOpen(false)} variant="sheet" eyebrow="Live instance" title={title}>
        <div className="flex h-full flex-col">
          <iframe
            src={url}
            title={`${title} — live instance`}
            className="min-h-0 w-full flex-1"
            sandbox="allow-scripts allow-same-origin allow-forms"
            loading="lazy"
          />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline flex shrink-0 items-center gap-2 px-5 py-3 font-mono text-[11px]"
            style={{ borderTop: "1px solid var(--line)" }}
          >
            <ExternalLink size={12} /> Open in a new tab
          </a>
        </div>
      </Modal>
    </>
  );
}
