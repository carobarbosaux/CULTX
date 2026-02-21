import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Article } from "@/lib/articles";

interface HeroSectionProps {
  article: Article;
}

export function HeroSection({ article }: HeroSectionProps) {
  return (
    <section
      className="border-b py-16 px-4"
      style={{
        backgroundColor: "var(--color-surface-raised)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Tag chip */}
          {article.tags[0] && (
            <span
              className="inline-block rounded-full px-3 py-1 text-xs mb-4"
              style={{
                backgroundColor: "var(--color-washi-200)",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-ui)",
              }}
            >
              {article.tags[0]}
            </span>
          )}

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-semibold leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            {article.title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg mt-3"
            style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
          >
            {article.subtitle}
          </p>

          {/* Author + reading time */}
          <p
            className="text-sm mt-4"
            style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-muted)" }}
          >
            {article.author} · {article.readingTime} min read
          </p>

          {/* CTA */}
          <div className="mt-6">
            <Link href={`/article/${article.id}`}>
              <Button variant="secondary" size="md">
                Read article
              </Button>
            </Link>
          </div>
        </div>

        {/* Cover image placeholder */}
        <div
          className="w-full md:w-[360px] flex-shrink-0 rounded-lg overflow-hidden"
          style={{
            aspectRatio: "4/3",
            backgroundColor: "var(--color-washi-200)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text-muted)",
          }}
          aria-hidden="true"
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="6" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 22 L9 16 L14 20 L20 14 L30 22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
