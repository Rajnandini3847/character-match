import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#F4F1EA",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(196,106,75,0.15), transparent 60%), radial-gradient(circle at 80% 70%, rgba(143,167,135,0.15), transparent 60%)",
          color: "#191919",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            textTransform: "uppercase",
            letterSpacing: 8,
            color: "#C46A4B",
            display: "flex",
          }}
        >
          character mirror
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -2,
            display: "flex",
          }}
        >
          which fictional
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -2,
            display: "flex",
          }}
        >
          character{" "}
          <span style={{ fontStyle: "italic", color: "#C46A4B", marginLeft: 16, display: "flex" }}>
            are you?
          </span>
        </div>
        <div
          style={{
            marginTop: "auto",
            fontSize: 26,
            color: "#191919",
            opacity: 0.7,
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
          }}
        >
          <span>chota bheem</span>
          <span>·</span>
          <span>hermione</span>
          <span>·</span>
          <span>goku</span>
          <span>·</span>
          <span>wednesday</span>
          <span>·</span>
          <span>bluey</span>
          <span>·</span>
          <span>97 more</span>
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 20,
            color: "#191919",
            opacity: 0.5,
            display: "flex",
          }}
        >
          snap a photo · AI matches you · built with Claude Vision
        </div>
      </div>
    ),
    { ...size }
  );
}
