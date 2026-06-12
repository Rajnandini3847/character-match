import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <div className="space-y-10">
        <header className="space-y-6">
          <div className="text-xs uppercase tracking-[0.3em] text-terracotta">
            character mirror
          </div>
          <h1 className="font-display text-5xl sm:text-7xl leading-[0.95] tracking-tight">
            which fictional character{" "}
            <span className="italic text-terracotta">are you</span> today?
          </h1>
          <p className="text-lg text-ink/70 max-w-xl leading-relaxed">
            Open your camera, snap a photo, and an AI matches you to a fictional
            character — from <em>Chota Bheem</em> to <em>Hermione</em> to{" "}
            <em>Levi Ackerman</em>. Different vibe today? Try again. It changes.
          </p>
        </header>

        <Link
          href="/play"
          className="inline-block bg-ink text-cream font-display text-xl sm:text-2xl px-8 py-4 rounded-full hover:bg-terracotta transition-colors"
        >
          open camera →
        </Link>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8">
          {[
            { name: "Chota Bheem", source: "Cartoon" },
            { name: "Hermione", source: "Harry Potter" },
            { name: "Goku", source: "Dragon Ball" },
            { name: "Wednesday", source: "TV" },
            { name: "Bluey", source: "Cartoon" },
            { name: "Lara Croft", source: "Game" },
            { name: "Sherlock", source: "Book" },
            { name: "Geet", source: "Bollywood" },
          ].map((c) => (
            <div
              key={c.name}
              className="border border-ink/15 bg-cream/60 rounded-lg p-3"
            >
              <div className="font-display text-lg">{c.name}</div>
              <div className="text-xs text-ink/50">{c.source}</div>
            </div>
          ))}
        </section>

        <section className="pt-10 border-t border-ink/10 text-sm text-ink/60 space-y-2">
          <p>
            <strong>How it works:</strong> Your photo goes to Claude Vision (an
            AI model), which compares it to a curated list of ~100 characters
            and picks the best match.
          </p>
          <p>
            <strong>Privacy:</strong> Photos aren't stored anywhere on our side.
            They're sent to Anthropic for the match and discarded.
          </p>
        </section>
      </div>
    </main>
  );
}
