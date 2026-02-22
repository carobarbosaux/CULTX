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
import { NewsletterCTA } from "@/components/article/NewsletterCTA";
import { useChatStore } from "@/components/chat/ChatProvider";

interface ArticlePageClientProps {
  article: Article;
}

export function ArticlePageClient({ article }: ArticlePageClientProps) {
  const [profileType] = useState<string | null>(() =>
    typeof window !== "undefined" ? (getProfile()?.profileType ?? null) : null
  );
  const { addMessage, setArticleContext, setChatMode, setQuotedText, messages } = useChatStore();

  // "Explore topic" — sends selected text directly to the sidebar and triggers an AI reply
  async function handleExplore(selectedText: string) {
    const truncated = selectedText.length > 200 ? selectedText.slice(0, 200) + "…" : selectedText;
    setArticleContext(article.title);
    setChatMode("sidebar");
    addMessage({ role: "user", content: truncated });

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
    const response = getChatResponse({
      userMessage: selectedText,
      articleContext: article.title,
      profileType,
      messageCount: messages.length,
    });
    addMessage({ role: "assistant", content: response });
  }

  // "Send to chat" — places selected text as a quote in the chatbar for the user to compose around
  function handleSendToChat(selectedText: string) {
    const truncated = selectedText.length > 200 ? selectedText.slice(0, 200) + "…" : selectedText;
    setArticleContext(article.title);
    setQuotedText(truncated);
    setChatMode("sidebar");
  }

  return (
    <article className="min-h-screen px-4 py-12">
      <div className="mx-auto w-full" style={{ maxWidth: "720px" }}>
        <ArticleNav />
        <ArticleHeader article={article} />
        <ArticleToolbar article={article} />
        <ArticleBody
          body={article.body}
          onExplore={handleExplore}
          onSendToChat={handleSendToChat}
        />
        <ArticleEjes article={article} />
        <NewsletterCTA />
      </div>

    </article>
  );
}
