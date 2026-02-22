import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { Article } from "@/lib/articles";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.id}`} className="block flex-shrink-0 w-[280px]">
      <Card
        className="h-full hover:shadow-md transition-shadow duration-[200ms] cursor-pointer overflow-hidden"
      >
        <div style={{ aspectRatio: "16/9", overflow: "hidden", borderBottom: "1px solid var(--color-border)" }}>
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", backgroundColor: "var(--color-surface-raised)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><rect x="2" y="6" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M2 22 L9 16 L14 20 L20 14 L30 22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            </div>
          )}
        </div>

        <div className="p-5">
        {/* Tag chip */}
        {article.tags[0] && (
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs mb-3"
            style={{
              backgroundColor: "var(--color-surface-raised)",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-ui)",
            }}
          >
            {article.tags[0]}
          </span>
        )}

        {/* Title */}
        <p
          className="text-base font-medium leading-snug line-clamp-2 mb-3"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          {article.title}
        </p>

        {/* Author + reading time */}
        <div
          className="flex items-center justify-between text-xs"
          style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-muted)" }}
        >
          <span>{article.author}</span>
          <span>{article.readingTime} min read</span>
        </div>
        </div>
      </Card>
    </Link>
  );
}
