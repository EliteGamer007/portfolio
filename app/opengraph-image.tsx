import { ImageResponse } from "next/og";
import { SITE } from "@/lib/config";

export const alt = `${SITE.fullName} — backend and distributed systems`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #06090f 0%, #0c1424 55%, #101c33 100%)",
          color: "#e9edf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#6f7b96" }}>
          {SITE.domain.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, lineHeight: 1.02, letterSpacing: -3 }}>
            Sanjeev Srinivas
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 34, color: "#9dbcff" }}>
            Backend &amp; distributed systems
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, color: "#a3aec7" }}>
          <div style={{ display: "flex", width: 44, height: 3, background: "#4f84f5" }} />
          Go · Python · Next.js · ActivityPub
        </div>
      </div>
    ),
    size
  );
}
