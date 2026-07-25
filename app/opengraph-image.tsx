import { ImageResponse } from "next/og";
import { ORG, DEFAULT_DESCRIPTION } from "@/lib/seo/site";

// Imagen social (1200×630) generada con la marca. Se usa cuando alguien comparte
// el sitio en LinkedIn/WhatsApp/Slack, etc. Next la enlaza en <head> como og:image
// y twitter:image automáticamente.
export const alt = `${ORG.name} — ${ORG.tagline}`;
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
          justifyContent: "center",
          padding: "80px 90px",
          background: "linear-gradient(135deg, #0d1a2d 0%, #0a1424 55%, #07101d 100%)",
          position: "relative",
        }}
      >
        {/* Aura de marca */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 700,
            height: 700,
            borderRadius: 700,
            background: "radial-gradient(circle, rgba(43,111,212,0.45) 0%, rgba(43,111,212,0) 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 10,
            color: "#7fb3f8",
            marginBottom: 28,
          }}
        >
          ACCEDRA · IT SOLUTIONS
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          Todo tu IT, de una sola mano.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#9fb0c7",
            marginTop: 30,
            maxWidth: 880,
            lineHeight: 1.4,
          }}
        >
          {DEFAULT_DESCRIPTION}
        </div>
      </div>
    ),
    size,
  );
}
