import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/lib/articles";

interface CarouselSectionProps {
  title: string;
  subtitle?: string;
  articles: Article[];
}

export function CarouselSection({ title, subtitle, articles }: CarouselSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-4">
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-sm mt-0.5"
            style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
