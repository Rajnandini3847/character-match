import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { CHARACTERS, CHARACTER_BY_ID } from "@/lib/characters";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = buildSystemPrompt();

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "missing_api_key",
        message:
          "ANTHROPIC_API_KEY not set. Add it in Vercel → Project Settings → Environment Variables (or .env.local for local dev).",
        demo: demoResult(),
      },
      { status: 200 }
    );
  }

  let body: { image?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { image, mediaType = "image/jpeg" } = body;
  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "missing_image" }, { status: 400 });
  }
  const base64 = image.replace(/^data:image\/[a-z]+;base64,/, "");
  if (base64.length > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "image_too_large" }, { status: 413 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const safeMediaType = allowedTypes.includes(mediaType)
    ? (mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif")
    : "image/jpeg";

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: safeMediaType, data: base64 },
            },
            {
              type: "text",
              text: "Pick the ONE character from your list whose appearance or vibe best matches the person in this photo. Look at hair, face, expression, clothing, and overall energy. Return only the JSON.",
            },
          ],
        },
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              character_id: {
                type: "string",
                description:
                  "The exact id from the character list (e.g. 'chota-bheem', 'naruto', 'hermione').",
              },
              why: {
                type: "string",
                description:
                  "One playful sentence (max 30 words) explaining the match — reference specific features you saw in the photo.",
              },
              vibe_tags: {
                type: "array",
                items: { type: "string" },
                description: "3-5 short keywords describing the person in the photo.",
              },
              confidence: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "How confident you are in this match.",
              },
            },
            required: ["character_id", "why", "vibe_tags", "confidence"],
            additionalProperties: false,
          },
        },
      },
    });

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );
    if (!textBlock) {
      return NextResponse.json({ error: "no_text_in_response" }, { status: 502 });
    }

    let parsed: {
      character_id: string;
      why: string;
      vibe_tags: string[];
      confidence: string;
    };
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      return NextResponse.json(
        { error: "invalid_model_output", raw: textBlock.text },
        { status: 502 }
      );
    }

    const character = CHARACTER_BY_ID[parsed.character_id];
    if (!character) {
      // Model picked a name not in our list — return what it said anyway,
      // client will handle missing image
      return NextResponse.json({
        match: {
          id: parsed.character_id,
          name: parsed.character_id,
          source: "unknown",
          sourceType: "unknown",
          region: "unknown",
        },
        why: parsed.why,
        vibe_tags: parsed.vibe_tags,
        confidence: parsed.confidence,
        usage: response.usage,
        warning: "Model returned an id not in the curated DB.",
      });
    }

    return NextResponse.json({
      match: character,
      why: parsed.why,
      vibe_tags: parsed.vibe_tags,
      confidence: parsed.confidence,
      usage: response.usage,
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "rate_limited", message: "Too many requests. Try again in a moment." },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: "api_error", message: err.message, status: err.status },
        { status: err.status ?? 500 }
      );
    }
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: "internal_error", message }, { status: 500 });
  }
}

function buildSystemPrompt(): string {
  const list = CHARACTERS.map(
    (c) =>
      `- ${c.id} | ${c.name} (${c.source}, ${c.sourceType}, ${c.region}) — ${c.vibeTags.join(", ")}`
  ).join("\n");
  return `You are a playful character-matching engine. Given a photo of a person, you pick ONE fictional character from a fixed roster whose visual appearance or vibe best matches.

ROSTER (use the id field exactly when returning a match — do not invent characters):

${list}

Matching rules:
- Consider hair (length, color, style), face shape, facial expression, clothing style, posture, and overall energy/vibe.
- It does NOT have to be the same gender or skin tone — vibe and style matter more.
- If multiple characters could match, pick the one that matches most specific visible features (e.g. "long red curly hair" → Merida wins over a generic redhead).
- For Indian users especially: lean into Indian / Bollywood / Indian-animation matches when the photo or styling reads Indian.
- Return ONLY valid JSON. Never include prose outside the JSON.`;
}

function demoResult() {
  // shown when no API key is configured, so the UI still has something to render
  return {
    match: CHARACTER_BY_ID["chota-bheem"],
    why: "Demo mode — set ANTHROPIC_API_KEY to get a real match.",
    vibe_tags: ["demo", "no api key"],
    confidence: "low",
  };
}
