"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Character } from "@/lib/characters";

type Phase = "idle" | "starting" | "ready" | "captured" | "matching" | "result" | "error";

interface MatchResult {
  match: Character;
  why: string;
  vibe_tags: string[];
  confidence: "low" | "medium" | "high";
  warning?: string;
}

interface CharacterImg {
  thumbnail: string | null;
  image: string | null;
  extract: string | null;
}

export default function PlayPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [charImg, setCharImg] = useState<CharacterImg | null>(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => stopStream();
  }, []);

  const startCamera = async () => {
    setPhase("starting");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase("ready");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "couldn't open camera";
      setError(msg);
      setPhase("error");
    }
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const capture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror back the flipped preview so the saved image matches what you saw
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setSnapshot(dataUrl);
    setPhase("captured");
    stopStream();
    await runMatch(dataUrl);
  };

  const pickFile = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    setSnapshot(dataUrl);
    setPhase("captured");
    stopStream();
    await runMatch(dataUrl);
  };

  const runMatch = async (dataUrl: string) => {
    setPhase("matching");
    setResult(null);
    setCharImg(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: dataUrl,
          mediaType: "image/jpeg",
        }),
      });
      const data = await res.json();
      if (data.error) {
        const matchData = data.demo ?? null;
        if (matchData) {
          setResult(matchData as MatchResult);
          setPhase("result");
          fetchCharImg(matchData.match.id);
        } else {
          setError(data.message || data.error);
          setPhase("error");
        }
        return;
      }
      setResult(data as MatchResult);
      setPhase("result");
      fetchCharImg(data.match.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "match failed";
      setError(msg);
      setPhase("error");
    }
  };

  const fetchCharImg = async (id: string) => {
    try {
      const res = await fetch(`/api/character-img?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!data.error) setCharImg(data);
    } catch {
      // non-fatal
    }
  };

  const reset = () => {
    setSnapshot(null);
    setResult(null);
    setCharImg(null);
    setError(null);
    setPhase("idle");
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="text-xs uppercase tracking-[0.3em] text-ink/60 hover:text-terracotta">
          ← back
        </Link>
        <div className="text-xs uppercase tracking-[0.3em] text-terracotta">
          character mirror
        </div>
      </header>

      {phase === "idle" && (
        <IdleView
          onStart={startCamera}
          onPickFile={(f) => void pickFile(f)}
        />
      )}

      {phase === "starting" && (
        <CenteredCard>
          <p className="text-ink/60 text-sm pulse">opening camera…</p>
        </CenteredCard>
      )}

      {phase === "ready" && (
        <CameraView videoRef={videoRef} onCapture={capture} onCancel={() => { stopStream(); reset(); }} />
      )}

      {(phase === "matching" || phase === "captured") && snapshot && (
        <MatchingView snapshot={snapshot} />
      )}

      {phase === "result" && result && snapshot && (
        <ResultView
          snapshot={snapshot}
          result={result}
          charImg={charImg}
          onReset={reset}
        />
      )}

      {phase === "error" && (
        <CenteredCard>
          <h2 className="font-display text-2xl mb-3">something broke</h2>
          <p className="text-ink/60 text-sm mb-6">{error}</p>
          <button
            onClick={reset}
            className="bg-ink text-cream px-6 py-2 rounded-full text-sm font-medium hover:bg-terracotta transition-colors"
          >
            try again
          </button>
        </CenteredCard>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}

function IdleView({
  onStart,
  onPickFile,
}: {
  onStart: () => void;
  onPickFile: (f: File) => void;
}) {
  return (
    <div className="space-y-10 py-12">
      <div className="space-y-4">
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.05]">
          ready when you are.
        </h1>
        <p className="text-ink/60 max-w-md leading-relaxed">
          We'll need camera access — your photo never leaves your machine
          until you snap, and isn't stored on our side after.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onStart}
          className="bg-ink text-cream font-display text-xl px-7 py-3.5 rounded-full hover:bg-terracotta transition-colors block"
        >
          open camera →
        </button>
        <label className="block">
          <span className="text-sm text-ink/60 underline cursor-pointer hover:text-terracotta">
            or upload a photo instead
          </span>
          <input
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPickFile(f);
            }}
          />
        </label>
      </div>
    </div>
  );
}

function CameraView({
  videoRef,
  onCapture,
  onCancel,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCapture: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="relative aspect-square w-full max-w-md mx-auto bg-ink rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-ink/60 backdrop-blur rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-red-500 pulse" />
          <span className="text-cream text-[10px] uppercase tracking-widest">live</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onCapture}
          className="shutter"
          aria-label="snap"
        />
        <button
          onClick={onCancel}
          className="text-xs uppercase tracking-widest text-ink/40 hover:text-terracotta"
        >
          cancel
        </button>
      </div>
    </div>
  );
}

function MatchingView({ snapshot }: { snapshot: string }) {
  const lines = [
    "looking at your hair…",
    "reading your vibe…",
    "consulting the roster…",
    "narrowing it down…",
    "almost there…",
  ];
  return (
    <div className="space-y-6 py-6">
      <div className="aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-ink/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={snapshot} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="text-center space-y-3">
        <div className="font-display text-2xl pulse">finding your character…</div>
        <div className="text-xs text-ink/50 uppercase tracking-widest">
          {lines[Math.floor((Date.now() / 1200) % lines.length)]}
        </div>
      </div>
    </div>
  );
}

function ResultView({
  snapshot,
  result,
  charImg,
  onReset,
}: {
  snapshot: string;
  result: MatchResult;
  charImg: CharacterImg | null;
  onReset: () => void;
}) {
  const { match, why, vibe_tags, confidence } = result;
  const charImageUrl = charImg?.thumbnail || charImg?.image;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-xs uppercase tracking-[0.3em] text-terracotta">
          you are
        </div>
        <h1 className="font-display text-5xl sm:text-6xl italic">{match.name}</h1>
        <div className="text-sm text-ink/60">
          from <em>{match.source}</em>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <figure className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={snapshot}
            alt="you"
            className="aspect-square w-full object-cover rounded-2xl bg-ink/5"
          />
          <figcaption className="text-[10px] uppercase tracking-widest text-ink/40 text-center">
            you
          </figcaption>
        </figure>
        <figure className="space-y-2">
          {charImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={charImageUrl}
              alt={match.name}
              className="aspect-square w-full object-cover rounded-2xl bg-ink/5"
            />
          ) : (
            <div className="aspect-square w-full rounded-2xl bg-ink/5 flex items-center justify-center text-center p-4">
              <span className="font-display text-3xl italic text-ink/40">
                {match.name}
              </span>
            </div>
          )}
          <figcaption className="text-[10px] uppercase tracking-widest text-ink/40 text-center">
            {match.name}
          </figcaption>
        </figure>
      </div>

      <blockquote className="border-l-2 border-terracotta pl-4 py-1 text-lg leading-relaxed font-display italic">
        "{why}"
      </blockquote>

      <div className="flex flex-wrap gap-2">
        {vibe_tags.map((t) => (
          <span
            key={t}
            className="text-xs border border-ink/15 bg-cream/80 rounded-full px-3 py-1 lowercase"
          >
            {t}
          </span>
        ))}
        <span className="text-xs text-ink/40 ml-auto">
          confidence: {confidence}
        </span>
      </div>

      {result.warning && (
        <div className="text-xs text-ink/50 italic">{result.warning}</div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onReset}
          className="flex-1 bg-ink text-cream font-display text-lg py-3 rounded-full hover:bg-terracotta transition-colors"
        >
          try again
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `I'm ${match.name}`,
                text: `Character Mirror says I'm ${match.name} from ${match.source}. "${why}"`,
                url: window.location.origin,
              });
            } else {
              navigator.clipboard?.writeText(
                `Character Mirror says I'm ${match.name} from ${match.source}. ${window.location.origin}`
              );
            }
          }}
          className="px-6 bg-cream border border-ink text-ink font-medium py-3 rounded-full hover:bg-ink hover:text-cream transition-colors"
        >
          share
        </button>
      </div>
    </div>
  );
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-center">{children}</div>
    </div>
  );
}
