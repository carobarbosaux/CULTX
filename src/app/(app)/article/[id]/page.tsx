import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/articles";
import { ArticleNav } from "@/components/article/ArticleNav";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleToolbar } from "@/components/article/ArticleToolbar";
import { ArticleBody } from "@/components/article/ArticleBody";
import { SendToChatButton } from "@/components/article/SendToChatButton";
import { NewsletterCTA } from "@/components/article/NewsletterCTA";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen px-4 py-12">
      <div className="mx-auto w-full" style={{ maxWidth: "720px" }}>
        <ArticleNav />
        <ArticleHeader article={article} />
        <ArticleToolbar />
        <ArticleBody body={article.body} />
        <SendToChatButton articleTitle={article.title} />
        <NewsletterCTA />
      </div>
    </article>
  );
}
