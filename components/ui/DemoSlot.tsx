import { Play } from "lucide-react";

/**
 * The 16:9 space a project demo drops into.
 *
 * Until there's a video it stays a framed viewport rather than an empty box —
 * drop a file in and swap the placeholder for a <video>.
 */
export default function DemoSlot({
  label,
  videoSrc,
  poster,
}: {
  label: string;
  videoSrc?: string;
  poster?: string;
}) {
  return (
    <div className="demo-slot">
      {videoSrc ? (
        <video
          className="h-full w-full object-cover"
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          aria-label={`${label} demo`}
        />
      ) : (
        <>
          <span className="bracket tl" />
          <span className="bracket tr" />
          <span className="bracket bl" />
          <span className="bracket br" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{
                border: "1px solid rgba(116,160,255,0.35)",
                background: "rgba(116,160,255,0.07)",
              }}
            >
              <Play size={15} style={{ color: "var(--color-azure-300)", marginLeft: 2 }} />
            </div>
            <p className="eyebrow">Demo · {label}</p>
          </div>

          <p
            className="absolute bottom-3 left-0 right-0 text-center font-mono text-[9px]"
            style={{ color: "var(--color-paper-mute)", opacity: 0.6 }}
          >
            16 : 9
          </p>
        </>
      )}
    </div>
  );
}
