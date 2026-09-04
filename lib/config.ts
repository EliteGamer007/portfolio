/** Central site config — single source of truth for identity + links. */
export const SITE = {
  domain: "portfolio-von-sanjeev.tech",
  url: "https://portfolio-von-sanjeev.tech",
  name: "Sanjeev Srinivas",
  fullName: "Sanjeev Srinivas S",
  role: "Backend & Distributed Systems",
  title: "Sanjeev Srinivas — Backend & Distributed Systems",
  description:
    "Final-year CS student building federated systems, physics-based deepfake detection, and race telemetry. Go, Python, Next.js.",
  email: "sanjnivas@gmail.com",
  phone: "+91 90802 39140",
  github: "https://github.com/EliteGamer007",
  githubUser: "EliteGamer007",
  linkedin: "https://linkedin.com/in/sanjeev-srinivas",
  location: "Coimbatore, India",
  timezone: "IST (UTC+5:30)",
  resumePdf: "/Sanjeev-Srinivas-Resume.pdf",
} as const;

export const EDUCATION = [
  {
    degree: "B.Tech, Computer Science & Engineering",
    school: "Amrita Vishwa Vidyapeetham, Coimbatore",
    detail: "CGPA 8.62",
    period: "2023 — 2027",
  },
  {
    degree: "BS, Data Science & Programming",
    school: "IIT Madras (Online)",
    detail: "CGPA 7.16",
    period: "2024 — Present",
  },
] as const;

export const CERTIFICATIONS = [
  "Diploma in Data Science & Programming — IIT Madras",
  "BSc in Programming and Data Science — IIT Madras",
] as const;

export const LANGUAGES = "English, Tamil, Hindi · Spanish (beginner), German (basic)";
export const INTERESTS = "Geography and maps, racing games, simulators";
