export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  /** One-line hook used on the rail panel. */
  tagline: string;
  /** Full paragraph used on the case-study page. */
  description: string;
  /** What the system actually does, in concrete terms. */
  highlights: string[];
  /** One-line notes, shown as sticky notes on the panel. */
  decisions: { label: string; body: string }[];
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  /** Key into DIAGRAMS — omitted when there's no architecture worth drawing. */
  diagram?: "splitter" | "deepfake" | "f1";
  /** Set true to embed the live instance in a side panel. */
  embeddable?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "splitter",
    title: "Splitter",
    subtitle: "Federated social platform",
    year: "2025",
    tagline:
      "A social network with no centre — independent servers that talk to each other over ActivityPub.",
    description:
      "A decentralised social network in Go and Next.js that federates across independently-hosted instances — users on different servers share one social graph without sharing one owner. ActivityPub with HTTP Signature verification, DID authentication, and end-to-end encrypted DMs.",
    highlights: [
      "ActivityPub inbox/outbox routing with HTTP Signature verification on every inbound activity",
      "DID-based authentication — identity is portable between instances, not owned by one",
      "End-to-end encrypted direct messaging, with keys never leaving the client",
      "Go microservices behind PostgreSQL and Redis; Next.js frontend",
    ],
    decisions: [
      { label: "Why Go", body: "One post fans out to hundreds of signed deliveries — goroutines keep that a for-loop." },
      { label: "Hardest bug", body: "Digest header hashed after re-serialising the JSON, so every signature mismatched." },
    ],
    techStack: ["Go", "Next.js", "ActivityPub", "PostgreSQL", "Redis", "DID Auth"],
    githubUrl: "https://github.com/EliteGamer007/splitter",
    liveUrl: "https://splitter-social.vercel.app/",
    diagram: "splitter",
  },
  {
    slug: "deepfake-detection",
    title: "Physics-Based Deepfake Detection",
    subtitle: "Biomechanical forensics",
    year: "2025",
    tagline:
      "Most detectors hunt for visual artifacts. This one looks at whether the face moves like a real face.",
    description:
      "A deepfake detector that analyses biomechanical motion rather than visual artifacts — 478-point 3D facial landmarks per frame via MediaPipe, then chin-velocity jitter, saccade timing and micro-tremor. Vertex AI Gemini reasons over those features, and an offline physics-heuristic mode takes over with zero code changes.",
    highlights: [
      "478-point 3D facial landmark extraction per frame via MediaPipe",
      "Chin-velocity jitter, saccade timing, and micro-tremor as primary signals",
      "Event-driven pipeline on Cloud Run, Firebase Functions and Firestore",
      "Offline physics-heuristic mode for when cloud infrastructure isn't available",
    ],
    decisions: [
      { label: "The idea", body: "Artifacts get easier to hide every generation. Motion has to stay physically consistent." },
      { label: "Hardest bug", body: "Landmark noise looked identical to micro-tremor until I split them by frequency band." },
    ],
    techStack: ["Python", "MediaPipe", "Vertex AI", "GCP", "Firebase", "FastAPI"],
    githubUrl: "https://github.com/EliteGamer007/deepfake-detection",
    diagram: "deepfake",
  },
  {
    slug: "f1-telemetry",
    title: "F1 Telemetry Dashboard",
    subtitle: "Pit-wall race analytics",
    year: "2025",
    tagline:
      "A pit wall in the browser — track map, driver deltas and flag periods, all on one session clock.",
    description:
      'A "pit wall"-style Formula 1 dashboard. A FastAPI backend pulls live and historical session data through FastF1; a Next.js frontend renders a per-circuit track map, driver deltas and flag periods — all synced to one shared session clock.',
    highlights: [
      "Per-circuit track map generated from GPS coordinate interpolation",
      "Driver comparison by time-delta-over-distance, not just lap time",
      "Automated proximity detection for traffic during qualifying laps",
      "Race-control flag periods overlaid on the session timeline",
    ],
    decisions: [
      { label: "The idea", body: "One session clock feeds every view, so no panel can drift out of sync." },
      { label: "Hardest bug", body: "Lap data and car telemetry sit on different time bases — aligning them took longer than the UI." },
    ],
    techStack: ["Python", "FastAPI", "FastF1", "Next.js", "Plotly", "Redis"],
    githubUrl: "https://github.com/EliteGamer007/F1-Telemetry-Analysis",
    diagram: "f1",
  },
  {
    slug: "quiz-master",
    title: "Quiz Master v2",
    subtitle: "Full-stack coursework, done properly",
    year: "2024",
    tagline:
      "A quiz platform where the interesting part was getting slow work off the request path.",
    description:
      "A quiz platform built for the IIT Madras Modern Application Development II course — auth, admin quiz authoring, timed sessions and analytics, on a Vue.js and Flask stack.",
    highlights: [
      "Role-separated auth: admins author quizzes, users take timed sessions",
      "Celery + Redis job queue for PDF export and email notification",
      "Analytics dashboard over attempt history and per-question accuracy",
    ],
    decisions: [
      { label: "Worth keeping", body: "PDF export and email on a Celery queue, off the request path entirely." },
    ],
    techStack: ["Python", "Flask", "Vue.js", "SQLite", "Celery", "Redis"],
    githubUrl: "https://github.com/EliteGamer007/quiz-master-app-v2",
  },
  {
    slug: "noughts-and-crosses",
    title: "Noughts & Crosses",
    subtitle: "The smallest full-stack thing",
    year: "2024",
    tagline: "Deliberately minimal — server-side game state, and a client that ships no JavaScript.",
    description:
      "Tic-tac-toe served by FastAPI with a plain HTML and CSS frontend — two-player, all game state server-side. A deliberate baseline: the simplest architecture that is still honestly full-stack.",
    highlights: [
      "Entire game state is a nine-element list held on the server",
      "Zero client-side JavaScript — every move is a plain form round-trip",
      "Sub-millisecond move processing; the network is the only real latency",
    ],
    decisions: [
      { label: "Why bother", body: "Nine-element list on the server, zero client JS — a baseline for how little you need." },
    ],
    techStack: ["Python", "FastAPI", "HTML", "CSS", "Uvicorn"],
    githubUrl: "https://github.com/EliteGamer007/NoughtsAndCrosses",
    liveUrl: "https://noughts-and-crosses-sepia.vercel.app",
    embeddable: true,
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export const SKILL_GROUPS = [
  { label: "Languages", items: ["Python", "Go", "TypeScript", "C++", "Java", "JavaScript"] },
  { label: "Backend", items: ["FastAPI", "Flask", "PostgreSQL", "Redis", "REST", "Celery"] },
  { label: "Cloud & Infra", items: ["GCP", "AWS", "Docker", "Cloud Run", "Firebase", "Vercel"] },
  { label: "Frontend & Data", items: ["Next.js", "React", "Pandas", "Scikit-learn", "MediaPipe", "Plotly"] },
] as const;
