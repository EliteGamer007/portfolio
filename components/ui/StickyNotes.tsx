/**
 * Notes, taped to the corner of the demo frame.
 *
 * Paper colours and tilts alternate so a stack never looks stamped out; each
 * note holds a single line, which is the whole point of them.
 */

const PAPER = ["#f2e6a8", "#dcecc0", "#f3d9c0", "#dfe4f5"];
const TILT = [-2.6, 2.1, -1.6, 2.8];

export default function StickyNotes({
  notes,
  className = "",
}: {
  notes: { label: string; body: string }[];
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {notes.map((n, i) => (
        <div
          key={n.label}
          className="sticky-note"
          style={{
            background: PAPER[i % PAPER.length],
            transform: `rotate(${TILT[i % TILT.length]}deg)`,
          }}
        >
          <span className="sticky-note-label">{n.label}</span>
          {n.body}
        </div>
      ))}
    </div>
  );
}
