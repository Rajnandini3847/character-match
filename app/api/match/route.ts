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
      `- ${c.id} | ${c.name} (${c.source}, ${c.sourceType}, ${c.region})
  look:  ${c.look}
  vibe:  ${c.vibeTags.join(", ")}`
  ).join("\n\n");

  return `You are a playful, perceptive character-matching engine. The user sends a single photo of a person. You pick exactly ONE fictional character from a fixed roster whose visual appearance and vibe best match that person.

## How to match (in priority order)

1. SPECIFIC VISIBLE FEATURES first. Look at the photo for: hair (length, color, texture, style — e.g. "long red curly hair", "short black bowl cut", "platinum braid"), face shape, eye color if visible, facial expression, signature clothing or accessories (glasses, hat, scarf, hoodie, sari, dhoti), build (small/tall/round/lean), and posture/energy.

2. MATCH THE LOOK against the "look:" field of each character in the roster. The look field is your primary signal — if the photo shows someone with very long curly red hair and freckles, Merida's "look: huge wild red curly hair, freckled, blue medieval dress" should win over a generic redhead like Kim Possible (shoulder-length, no freckles).

3. MATCH THE VIBE against the "vibe:" field as a secondary signal. The vibe encodes energy/personality cues — quiet/intense/playful/regal/etc. A studious-looking person in glasses leans Hermione or Naina, not Loki.

4. Gender and skin tone do NOT need to match. A man can match Hermione if the styling fits. A light-skinned person can match Chota Bheem if the vibe is right. Vibe and specific styling matter more than demographics.

5. REGIONAL WEIGHTING. If the photo or styling reads Indian (kurta, sari, bindi, dhoti, Indian-coded clothing or features), strongly prefer characters with region "india" — Chota Bheem, Mighty Raju, Geet, Munna Bhai, Piku, etc. If the photo reads East Asian / cosplay-anime, lean into the anime roster. Otherwise, the full roster is fair game.

6. AVOID THE GENERIC ANSWER. If two characters could match equally, pick the more specific or interesting one. "Smiling person with cheerful energy" alone is too vague to land on Joy — Joy needs glowing optimism AND bright yellow palette / pixie hair vibes. If nothing matches strongly, set confidence to "low" and pick the closest.

7. ONE-SENTENCE "WHY". When you explain the match, reference specific things you actually saw in the photo (hair, expression, clothing, posture). Don't just restate the character's traits — tie them back to the photo. Keep it playful, max 30 words.

## Worked examples

- Photo: young Indian woman, long wavy dark hair, big smile, casual kurti.
  → geet (specific: long-haired, bubbly, Indian, free-spirit) — NOT a generic Bollywood match.

- Photo: pale teen with deadpan stare and dark hair in two braids.
  → wednesday (the braids + deadpan are unmistakable) — NOT mikasa (different vibe).

- Photo: bearded man in fedora, weathered look.
  → indiana (fedora is the giveaway) — NOT gandalf (no robes/long beard).

- Photo: woman with very long red curly hair and freckles.
  → merida (specific match) — NOT a generic redhead like natasha or kim-possible.

- Photo: chubby smiling boy with brown skin and big eyes.
  → chota-bheem (Indian + young + warm + cheerful) is a strong match.

## Output

Return ONLY valid JSON matching the provided schema. No prose outside the JSON, no markdown fences. The character_id field MUST be one of the exact ids from the roster below — do not invent ids, do not paraphrase them.

# CHARACTER ROSTER

Each entry has an id (use this exact string), display name, source, type, region, a "look" line for visual matching, and a "vibe" line for energy matching.

${list}

REMINDER: Return only valid JSON with fields character_id (exact id from the roster), why (1 sentence, references the photo), vibe_tags (3-5 keywords from the photo), confidence (low|medium|high). The character_id must be an exact id from the roster above.`;
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
