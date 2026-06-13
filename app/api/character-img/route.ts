import { NextRequest, NextResponse } from "next/server";
import { CHARACTER_BY_ID } from "@/lib/characters";

export const runtime = "nodejs";
export const revalidate = 86400; // 24h edge cache — character images don't change

interface WikiSummary {
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
  extract?: string;
  type?: string; // "standard" | "disambiguation" | "no-extract"
  description?: string;
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const character = CHARACTER_BY_ID[id];
  if (!character) return NextResponse.json({ error: "unknown_id" }, { status: 404 });

  // Tier 1: explicit override (hand-curated for chars without their own Wiki article)
  if (character.imageUrl) {
    return NextResponse.json({
      id,
      name: character.name,
      thumbnail: character.imageUrl,
      image: character.imageUrl,
      source: "override",
    });
  }

  // Tier 2 + 3: try multiple wiki queries in order, return the first that has an image.
  // Order matters: character-specific titles first, then the show as a fallback.
  const candidates = uniqueQueries([
    character.wikiQuery,
    `${character.name} (character)`,
    `${character.name} (${character.source})`,
    character.name,
    character.source,
  ]);

  for (const q of candidates) {
    const result = await fetchWikiSummary(q);
    if (result?.thumbnail?.source) {
      return NextResponse.json({
        id,
        name: character.name,
        thumbnail: result.thumbnail.source,
        image: result.originalimage?.source ?? result.thumbnail.source,
        extract: result.extract ?? null,
        source: `wiki:${q}`,
      });
    }
  }

  return NextResponse.json({
    id,
    name: character.name,
    thumbnail: null,
    image: null,
    source: "none",
    error: "no_image_found",
  });
}

async function fetchWikiSummary(query: string): Promise<WikiSummary | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    query.replace(/ /g, "_")
  )}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "character-match/0.1 (https://github.com/Rajnandini3847/character-match)",
        Accept: "application/json",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WikiSummary;
    // Skip disambiguation pages — they almost never carry a useful image
    if (data.type === "disambiguation") return null;
    return data;
  } catch {
    return null;
  }
}

function uniqueQueries(arr: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of arr) {
    if (!q) continue;
    const key = q.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
