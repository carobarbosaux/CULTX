import type { Article } from "@/lib/articles";

interface ArticleHeaderProps {
  article: Article;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="mb-10">
      {/* Cover image placeholder — replace with <img src={article.coverImage} ... /> when ready */}
      <div
        className="w-full mb-8 rounded-lg overflow-hidden"
        style={{
          aspectRatio: "16/7",
          backgroundColor: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-ui)",
        }}
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect x="2" y="6" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 22 L9 16 L14 20 L20 14 L30 22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>cover · {article.id}</span>
      </div>

      {article.tags[0] && (
        <span
          className="inline-block rounded-full px-3 py-1 text-xs mb-5"
          style={{
            backgroundColor: "var(--color-surface-raised)",
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-ui)",
            border: "1px solid var(--color-border)",
          }}
        >
          {article.tags[0]}
        </span>
      )}

      <h1
        className="text-4xl md:text-5xl font-semibold leading-tight mb-4"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
      >
        {article.title}
      </h1>

      <p
        className="text-xl leading-relaxed mb-6"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text-secondary)",
          fontStyle: "italic",
        }}
      >
        {article.subtitle}
      </p>

      <div className="border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
        <div
          className="flex items-center gap-4 text-sm flex-wrap"
          style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
        >
          <span className="font-medium" style={{ color: "var(--color-text-secondary)" }}>
            {article.author}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingTime} min de lectura</span>
        </div>
      </div>
    </header>
  );
}
