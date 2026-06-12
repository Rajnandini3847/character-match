import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://character-match-puce.vercel.app"),
  title: "Character Mirror — which fictional character are you?",
  description:
    "Open your camera, snap a photo, get matched to a fictional character — from Chota Bheem to Hermione. Built with Claude Vision.",
  openGraph: {
    title: "Character Mirror",
    description:
      "Which fictional character are you today? Snap a photo, find out in seconds.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Character Mirror" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-ink antialiased">
        <div className="grain min-h-screen">{children}</div>
      </body>
    </html>
  );
}
