"use client";

import { useState } from "react";
import { getProfile } from "@/lib/profile";
import { getChatResponse } from "@/ai/chatResponder";
import type { Article } from "@/lib/articles";
import { ArticleNav } from "@/components/article/ArticleNav";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleToolbar } from "@/components/article/ArticleToolbar";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleEjes } from "@/components/article/ArticleEjes";
import { ContextualExplorePanel } from "@/components/article/ContextualExplorePanel";
import { NewsletterCTA } from "@/components/article/NewsletterCTA";
import { useChatStore } from "@/components/chat/ChatProvider";

interface ArticlePageClientProps {
  article: Article;
}

export function ArticlePageClient({ article }: ArticlePageClientProps) {
  const [exploreText, setExploreText] = useState<string | null>(null);
  const [profileType] = useState<string | null>(() =>
    typeof window !== "undefined" ? (getProfile()?.profileType ?? null) : null
  );
  const { addMessage, setArticleContext, setChatMode, messages } = useChatStore();

  // "Llevar al chat" — quotes selected text and triggers an AI reply in the sidebar
  async function handleSendToChat(selectedText: string) {
    const truncated = selectedText.length > 200 ? selectedText.slice(0, 200) + "…" : selectedText;
    const question = `«${truncated}»\n\n¿Puedes profundizar en este fragmento?`;
    setArticleContext(article.title);
    setChatMode("sidebar");
    addMessage({ role: "user", content: question });

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
    const response = getChatResponse({
      userMessage: selectedText,
      articleContext: article.title,
      profileType,
      messageCount: messages.length,
    });
    addMessage({ role: "assistant", content: response });
  }

  return (
    <article className="min-h-screen px-4 py-12">
      <div className="mx-auto w-full" style={{ maxWidth: "720px" }}>
        <ArticleNav />
        <ArticleHeader article={article} />
        <ArticleToolbar article={article} />
        <ArticleBody
          body={article.body}
          onExplore={(text) => setExploreText(text)}
          onSendToChat={handleSendToChat}
        />
        <ArticleEjes article={article} />
        <NewsletterCTA />
      </div>

      <ContextualExplorePanel
        selectedText={exploreText}
        profileType={profileType}
        articleId={article.id}
        onClose={() => setExploreText(null)}
      />
    </article>
  );
}
