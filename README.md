# character-match

> Which fictional character are you today? Snap a photo, find out in seconds.

A camera-based web app that matches your appearance to a fictional character from a curated DB of ~100 (Indian, anime, animation, movies/TV, games, books). Powered by Claude Vision.

## Live demo

https://character-match.vercel.app *(requires `ANTHROPIC_API_KEY` env var on the deploy)*

## How it works

1. Open camera (or upload a photo) → snap
2. Image goes to `/api/match` → Claude Haiku 4.5 with vision + a curated character roster as the system prompt (cached across requests)
3. Claude returns JSON: `{ character_id, why, vibe_tags, confidence }` via `output_config.format` (guaranteed JSON shape)
4. `/api/character-img` fetches the character's image from Wikipedia
5. Result page shows you + the character + the "why" + a share button

## Stack

- Next.js 14 (app router) + TypeScript + Tailwind
- `@anthropic-ai/sdk` (Claude Haiku 4.5, vision)
- Wikipedia REST API for character thumbnails
- No DB, no storage, no auth

## Privacy

Photos are sent to Anthropic's API for the match and **not stored** on our side. The `/api/match` route is stateless. Your face does not get logged.

## Run locally

```bash
git clone https://github.com/Rajnandini3847/character-match
cd character-match
npm install
cp .env.example .env.local
# add ANTHROPIC_API_KEY=sk-ant-... to .env.local
npm run dev
```

Visit http://localhost:3000.

## Deploy

```bash
vercel --prod
```

Then in Vercel: Project Settings → Environment Variables → add `ANTHROPIC_API_KEY`.

## Customize the character DB

Edit `lib/characters.ts`. Each character is:

```ts
{
  id: "chota-bheem",        // stable id Claude picks from
  name: "Chota Bheem",
  source: "Chhota Bheem",
  sourceType: "cartoon",
  region: "india",
  vibeTags: ["strong", "kind", "energetic", ...],
  wikiQuery: "Chhota Bheem"  // Wikipedia article title for the image
}
```

Add as many as you want — Claude scales fine to a few hundred entries.

## License

MIT.
