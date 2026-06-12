import { NextRequest, NextResponse } from "next/server";
import { CHARACTER_BY_ID } from "@/lib/characters";

export const runtime = "nodejs";

// 1 hour edge cache; same image rarely changes
export const revalidate = 3600;

interface WikiSummary {
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
  extract?: string;
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const character = CHARACTER_BY_ID[id];
  if (!character) return NextResponse.json({ error: "unknown_id" }, { status: 404 });

  const query = character.wikiQuery || character.name;
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    query.replace(/ /g, "_")
  )}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "character-match/0.1 (https://github.com/Rajnandini3847/character-match)",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "wiki_lookup_failed", status: res.status, query },
        { status: 200 }
      );
    }
    const data = (await res.json()) as WikiSummary;
    return NextResponse.json({
      id,
      name: character.name,
      thumbnail: data.thumbnail?.source ?? null,
      image: data.originalimage?.source ?? data.thumbnail?.source ?? null,
      extract: data.extract ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: "fetch_failed", message }, { status: 200 });
  }
}
