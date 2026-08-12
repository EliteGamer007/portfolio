import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sanjeev Srinivas — Software Developer & Systems Architect",
  description:
    "Portfolio of Sanjeev Srinivas — dual-degree CS student specialising in backend architecture, distributed systems, data science, and cloud infrastructure.",
  keywords: [
    "Sanjeev Srinivas",
    "Software Developer",
    "Backend Engineer",
    "Data Science",
    "Cloud Infrastructure",
    "Distributed Systems",
    "Next.js",
    "Go",
    "Python",
  ],
  authors: [{ name: "Sanjeev Srinivas" }],
  openGraph: {
    title: "Sanjeev Srinivas — Software Developer & Systems Architect",
    description:
      "Scalable backend pipelines, distributed systems, and ML architectures.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased noise-overlay">
        {children}
      </body>
    </html>
  );
}
