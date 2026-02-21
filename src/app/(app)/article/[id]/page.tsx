import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/articles";
import { ArticlePageClient } from "@/components/article/ArticlePageClient";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  return <ArticlePageClient article={article} />;
}
