"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-ghost">
      <Printer size={14} /> Print
    </button>
  );
}
