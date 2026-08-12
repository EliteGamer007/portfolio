export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  status: "online" | "inactive" | "research";
  accent: string;
  funFact: string;
  bgClass: string;
}

export const PROJECTS: Project[] = [
  {
    id: "splitter",
    title: "Splitter",
    subtitle: "Federated Social Media",
    description:
      "A modern federated social platform with DID authentication, E2E encrypted DMs, and ActivityPub federation. Multiple server instances — you control your data. Built with Go microservices, federated inbox/outbox routing, and a Next.js frontend.",
    techStack: ["Go", "Next.js", "ActivityPub", "PostgreSQL", "Redis", "DID Auth"],
    githubUrl: "https://github.com/EliteGamer007/splitter",
    liveUrl: "https://splitter-demo.sanjeev.dev",
    status: "online",
    accent: "#2DD4BF",
    funFact: "Handles ~120 ActivityPub inbox operations per minute at peak federation load",
    bgClass: "bg-splitter",
  },
  {
    id: "noughts-crosses",
    title: "NoughtsAndCrosses",
    subtitle: "XO / Tic-Tac-Toe — Live",
    description:
      "Classic Noughts & Crosses served via FastAPI with a clean HTML/CSS frontend. Two-player mode with game state managed server-side. The simplest possible full-stack architecture — REST API powering a zero-JS game UI.",
    techStack: ["Python", "FastAPI", "HTML", "CSS", "Uvicorn"],
    githubUrl: "https://github.com/EliteGamer007/NoughtsAndCrosses",
    liveUrl: "https://noughts-and-crosses-sepia.vercel.app",
    status: "online",
    accent: "#2DD4BF",
    funFact: "Entire game state fits in a single 9-element Python list — sub-1ms move processing",
    bgClass: "bg-xo",
  },
  {
    id: "f1-telemetry",
    title: "F1 Telemetry Dashboard",
    subtitle: "Live Race Analytics",
    description:
      "Full pit-wall experience for Formula 1. Streams lap-by-lap telemetry, tyre strategy, sector breakdowns and dynamic circuit maps. Background polling via FastF1 every 45s during live sessions with a real-time Streamlit leaderboard.",
    techStack: ["TypeScript", "Python", "FastF1", "Streamlit", "Plotly", "Redis"],
    githubUrl: "https://github.com/EliteGamer007/F1-Telemetry-Analysis",
    status: "inactive",
    accent: "#C7B27B",
    funFact: "Track map renders DRS zones and sector splits in real time using GPS coordinate interpolation",
    bgClass: "bg-f1",
  },
  {
    id: "deepfake-detection",
    title: "Deepfake Detection",
    subtitle: "Hybrid Forensic System",
    description:
      "Comprehensive deepfake detection combining facial landmark extraction, AI-powered video analysis (Gemini), and a local fallback heuristic engine. Runs fully offline in demo mode when cloud credits run out — a hybrid prototype for production scenarios.",
    techStack: ["Python", "Gemini API", "Firebase", "OpenCV", "FastAPI", "Flask"],
    githubUrl: "https://github.com/EliteGamer007/deepfake-detection",
    status: "inactive",
    accent: "#A38E54",
    funFact: "Local forensic fallback achieves 84% accuracy without any cloud API calls",
    bgClass: "bg-deepfake",
  },
  {
    id: "ml-regression",
    title: "E-Commerce Purchase Predictor",
    subtitle: "ML Regression Pipeline",
    description:
      "Tree-based ML pipeline that predicts purchase value from multi-session e-commerce behaviour across digital touchpoints. Uses XGBoost with feature engineering over session depth, click sequences, and recency signals.",
    techStack: ["Python", "XGBoost", "Jupyter", "Pandas", "Scikit-learn", "Matplotlib"],
    githubUrl: "https://github.com/EliteGamer007/ML_Regression",
    status: "inactive",
    accent: "#C7B27B",
    funFact: "R² = 0.91 on holdout set — session depth is the single strongest purchase predictor",
    bgClass: "bg-ml",
  },
  {
    id: "quiz-master",
    title: "Quiz Master v2",
    subtitle: "Full-Stack Web App",
    description:
      "Modern quiz application built for the IITM B.Sc Modern App Development II course. Features user authentication, admin quiz creation, timed sessions, and analytics dashboards. Built with Vue.js frontend and Flask backend.",
    techStack: ["Python", "Flask", "Vue.js", "SQLite", "Celery", "Redis"],
    githubUrl: "https://github.com/EliteGamer007/quiz-master-app-v2",
    status: "inactive",
    accent: "#A38E54",
    funFact: "Async job queue with Celery handles PDF export and email notifications without blocking",
    bgClass: "bg-quiz",
  },
];
