/**
 * Hand-authored architecture diagrams.
 *
 * Each one draws the path a request actually takes through the system, rather
 * than a box-and-logo stack. Shared primitives below keep the three consistent.
 */

const C = {
  nodeFill: "rgba(17, 24, 39, 0.92)",
  nodeStroke: "rgba(140, 165, 220, 0.2)",
  groupStroke: "rgba(140, 165, 220, 0.16)",
  line: "rgba(140, 165, 220, 0.32)",
  accent: "#74a0ff",
  accentFill: "rgba(116, 160, 255, 0.1)",
  accentStroke: "rgba(116, 160, 255, 0.45)",
  text: "#e9edf7",
  dim: "#a3aec7",
  mute: "#79849f",
};

const MONO = "var(--font-mono), ui-monospace, monospace";
const SANS = "var(--font-sans), system-ui, sans-serif";

/* ── Primitives ─────────────────────────────────────────────────────────── */

function Node({
  x,
  y,
  w = 210,
  h = 50,
  label,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={9}
        fill={accent ? C.accentFill : C.nodeFill}
        stroke={accent ? C.accentStroke : C.nodeStroke}
        strokeWidth={1}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 4 : y + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={SANS}
        fontSize={13}
        fill={accent ? C.accent : C.text}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily={MONO}
          fontSize={9.5}
          fill={C.mute}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Group({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        fill="rgba(116, 160, 255, 0.022)"
        stroke={C.groupStroke}
        strokeWidth={1}
        strokeDasharray="4 5"
      />
      <text
        x={x + 16}
        y={y + 20}
        fontFamily={MONO}
        fontSize={9.5}
        letterSpacing="0.14em"
        fill={C.mute}
      >
        {label.toUpperCase()}
      </text>
    </g>
  );
}

function Arrow({ d, dashed = false }: { d: string; dashed?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={C.line}
      strokeWidth={1.3}
      strokeDasharray={dashed ? "5 4" : undefined}
      markerEnd="url(#arrowhead)"
    />
  );
}

function Line({ d }: { d: string }) {
  return <path d={d} fill="none" stroke={C.line} strokeWidth={1.3} />;
}

function Caption({
  x,
  y,
  children,
  anchor = "middle",
  accent = false,
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
  accent?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={MONO}
      fontSize={10}
      fill={accent ? C.accent : C.mute}
    >
      {children}
    </text>
  );
}

function Defs() {
  return (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="9"
        markerHeight="9"
        refX="7.5"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L8,3 L0,6 z" fill={C.line} />
      </marker>
    </defs>
  );
}

/* ── Splitter: one post crossing the federation boundary ────────────────── */

function SplitterDiagram() {
  return (
    <svg viewBox="0 0 940 470" role="img" aria-labelledby="splitter-diagram-title">
      <title id="splitter-diagram-title">
        A post travelling from one Splitter instance to another over ActivityPub
      </title>
      <Defs />

      <Group x={24} y={54} w={330} h={368} label="Instance A — sanjeev.social" />
      <Node x={54} y={98} label="Next.js client" sub="composes a post" />
      <Node x={54} y={178} label="Go API · outbox" sub="signs the activity" accent />
      <Node x={54} y={296} w={150} h={46} label="PostgreSQL" sub="social graph" />
      <Node x={214} y={296} w={110} h={46} label="Redis" sub="queue" />

      <Arrow d="M159,148 L159,174" />
      <Arrow d="M120,228 L120,292" />
      <Arrow d="M200,228 L262,292" />

      <Group x={586} y={54} w={330} h={368} label="Instance B — someone-else.net" />
      <Node x={616} y={98} label="Inbox handler" sub="POST /users/x/inbox" />
      <Node x={616} y={178} label="Verify signature" sub="keyId · digest · date" accent />
      <Node x={616} y={258} label="Fan out to followers" sub="timeline write" />
      <Node x={616} y={344} w={210} h={46} label="PostgreSQL" sub="local copy" />

      <Arrow d="M721,148 L721,174" />
      <Arrow d="M721,228 L721,254" />
      <Arrow d="M721,308 L721,340" />

      {/* The federation hop itself */}
      <Arrow d="M264,203 C 400,203 440,123 610,123" />
      <Caption x={437} y={148} accent>
        signed HTTP delivery
      </Caption>
      <Caption x={437} y={166}>
        Signature: keyId=&quot;…#main-key&quot;
      </Caption>

      {/* Key fetch, going the other way */}
      <Arrow d="M608,216 C 470,278 320,278 200,232" dashed />
      <Caption x={430} y={292}>
        fetches A&apos;s public key to verify
      </Caption>

      <Caption x={470} y={444}>
        no shared database — the only thing crossing the boundary is a signed document
      </Caption>
    </svg>
  );
}

/* ── Deepfake: physics features, with the cloud branch optional ─────────── */

function DeepfakeDiagram() {
  return (
    <svg viewBox="0 0 940 470" role="img" aria-labelledby="deepfake-diagram-title">
      <title id="deepfake-diagram-title">
        Video analysed into motion features, then scored either by Gemini or offline heuristics
      </title>
      <Defs />

      <Node x={24} y={208} w={170} h={58} label="Video upload" sub="Cloud Run" />
      <Arrow d="M198,237 L232,237" />

      <Group x={236} y={112} w={260} h={250} label="Per-frame extraction" />
      <Node x={260} y={148} w={212} h={50} label="MediaPipe" sub="478 3D landmarks/frame" accent />
      <Arrow d="M366,202 L366,232" />
      <Node x={260} y={236} w={212} h={50} label="Motion features" />
      <Caption x={366} y={312}>
        chin-velocity jitter
      </Caption>
      <Caption x={366} y={330}>
        saccade timing · micro-tremor
      </Caption>

      {/* The fork: one set of features, two ways to score it */}
      <Line d="M500,237 L528,237" />
      <Arrow d="M528,237 L528,141 L552,141" />
      <Arrow d="M528,237 L528,307 L552,307" />

      <Node x={556} y={112} w={220} h={58} label="Vertex AI Gemini" sub="forensic reasoning" accent />
      <Node x={556} y={278} w={220} h={58} label="Physics heuristics" sub="fully offline" />

      <Arrow d="M776,141 L820,141 L820,194" />
      <Arrow d="M776,307 L820,307 L820,254" />
      <Node x={742} y={198} w={156} h={52} label="Verdict" sub="Firestore" />

      <Caption x={470} y={410}>
        the offline path is the same extractor without the reasoning layer — not a separate codebase
      </Caption>
      <Caption x={470} y={432} accent>
        so a demo still runs with no cloud credits
      </Caption>
    </svg>
  );
}

/* ── F1: everything hanging off one session clock ───────────────────────── */

function F1Diagram() {
  return (
    <svg viewBox="0 0 940 470" role="img" aria-labelledby="f1-diagram-title">
      <title id="f1-diagram-title">
        FastF1 data polled into a cache, then read by three views through one shared session clock
      </title>
      <Defs />

      <Node x={24} y={186} w={180} h={58} label="FastF1" sub="live + historical" />
      <Arrow d="M208,215 L244,215" />
      <Node x={248} y={186} w={190} h={58} label="FastAPI poller" sub="every 45s" accent />
      <Arrow d="M442,215 L478,215" />
      <Node x={482} y={186} w={160} h={58} label="Redis" sub="session cache" />

      {/* The clock — the thing the whole design turns on */}
      <Arrow d="M562,180 L562,150" />
      <rect
        x={442}
        y={92}
        width={240}
        height={56}
        rx={9}
        fill={C.accentFill}
        stroke={C.accentStroke}
      />
      <text
        x={562}
        y={114}
        textAnchor="middle"
        fontFamily={SANS}
        fontSize={13.5}
        fill={C.accent}
      >
        Shared session clock
      </text>
      <text
        x={562}
        y={132}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={9.5}
        fill={C.mute}
      >
        one timestamp, three consumers
      </text>

      <Group x={686} y={54} w={230} h={362} label="Next.js views" />
      <Node x={716} y={92} w={190} h={56} label="Track map" sub="GPS interpolation" />
      <Node x={716} y={196} w={190} h={56} label="Driver delta" sub="Δt over distance" />
      <Node x={716} y={300} w={190} h={56} label="Flag timeline" sub="race control" />

      {/* One spine out of the clock, branching into all three views */}
      <Line d="M682,120 L700,120" />
      <Line d="M700,120 L700,328" />
      <Arrow d="M700,120 L712,120" />
      <Arrow d="M700,224 L712,224" />
      <Arrow d="M700,328 L712,328" />

      <Caption x={470} y={444}>
        because every view reads the same clock, no panel can drift out of sync with another
      </Caption>
    </svg>
  );
}

/* ── Registry ───────────────────────────────────────────────────────────── */

export const DIAGRAMS = {
  splitter: {
    title: "How a post crosses instances",
    caption:
      "One post, leaving Instance A signed and arriving at Instance B as a document it has to verify before trusting.",
    Svg: SplitterDiagram,
  },
  deepfake: {
    title: "Extraction, then two ways to score it",
    caption:
      "Landmarks become motion features once; after that, either Gemini reasons over them or the offline heuristics do.",
    Svg: DeepfakeDiagram,
  },
  f1: {
    title: "One clock, three views",
    caption:
      "Session data lands in cache, and every view reads position through the same shared timestamp.",
    Svg: F1Diagram,
  },
} as const;

export type DiagramKey = keyof typeof DIAGRAMS;
