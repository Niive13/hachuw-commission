import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants/site";

export const runtime = "edge";
export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Ambil foto dari public folder (URL absolute wajib untuk edge runtime).
  const profileUrl = `${SITE.url}/hachuw-profile.png`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #FFFBF7 0%, #FFE4EC 50%, #EDE4FF 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
          gap: "60px",
        }}
      >
        {/* Kiri: Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div style={{ fontSize: 28, color: "#F76C8E", fontWeight: 600 }}>
            ✨ Portfolio & Commission
          </div>

          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#3A2A22",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 24,
            }}
          >
            Hachuw
          </div>

          <div
            style={{
              width: 100,
              height: 6,
              background: "#F76C8E",
              borderRadius: 999,
              marginTop: 24,
              marginBottom: 24,
            }}
          />

          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#8A7A70",
            }}
          >
            Freelance Illustrator
          </div>

          <div
            style={{
              fontSize: 22,
              color: "#A89A90",
              marginTop: 32,
            }}
          >
            Illustration · PNGTuber · Custom Emote
          </div>
        </div>

        {/* Kanan: Foto Hachuw */}
        <div
          style={{
            width: 380,
            height: 380,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            overflow: "hidden",
            border: "8px solid #FFFFFF",
            boxShadow: "0 20px 40px -12px rgba(247, 108, 142, 0.4)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profileUrl}
            alt="Hachuw"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}