export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  /** Year or range shown on the card. */
  year: string;
  /** Optional one-liner — what it actually covered. */
  note?: string;
  /** Public verification link, if the issuer provides one. */
  credentialUrl?: string;
  /** A PDF or image dropped in /public/certificates. */
  file?: string;
  /** "earned" renders normally; "in-progress" gets a muted badge. */
  status?: "earned" | "in-progress";
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ADDING A CERTIFICATE
 *
 *  1. Drop the PDF or image into  public/certificates/
 *  2. Copy the block below, and fill it in:
 *
 *     {
 *       id: "aws-cloud-practitioner",          // unique, kebab-case
 *       title: "AWS Certified Cloud Practitioner",
 *       issuer: "Amazon Web Services",
 *       year: "2026",
 *       note: "Core AWS services, billing and the shared responsibility model.",
 *       credentialUrl: "https://…",            // optional
 *       file: "/certificates/aws-ccp.pdf",     // optional
 *     },
 *
 *  Everything else — the rail panel, the /certificates page and the count —
 *  follows from this list. Nothing else needs editing.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const CERTIFICATES: Certificate[] = [
  {
    id: "iitm-diploma-ds",
    title: "Diploma in Data Science & Programming",
    issuer: "IIT Madras",
    year: "2025",
    note: "Machine learning, data structures, database systems and business analytics.",
  },
  {
    id: "iitm-bsc-programming",
    title: "BSc in Programming & Data Science",
    issuer: "IIT Madras",
    year: "2024 — present",
    note: "Ongoing degree track alongside the B.Tech at Amrita.",
    status: "in-progress",
  },
];
