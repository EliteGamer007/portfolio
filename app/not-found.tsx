import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Error 404 · NXDOMAIN, near enough</p>

      <h1 className="display mt-5 text-[clamp(3rem,12vw,6rem)]">
        No route
        <br />
        <span style={{ color: "var(--color-azure-300)" }}>to that page.</span>
      </h1>

      <p className="mt-6 max-w-sm text-[14.5px]" style={{ color: "var(--color-paper-dim)" }}>
        The delegation is fine, there&apos;s just nothing served here.
      </p>

      <Link href="/" className="btn btn-primary mt-8">
        <ArrowLeft size={14} /> Back to the start
      </Link>
    </main>
  );
}
