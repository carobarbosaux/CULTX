"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/lib/profile";
import type { Article } from "@/lib/articles";
import { ArticleNav } from "@/components/article/ArticleNav";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleToolbar } from "@/components/article/ArticleToolbar";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ContextualExplorePanel } from "@/components/article/ContextualExplorePanel";
import { SendToChatButton } from "@/components/article/SendToChatButton";
import { NewsletterCTA } from "@/components/article/NewsletterCTA";

interface ArticlePageClientProps {
  article: Article;
}

/**
 * Client wrapper for the article page that holds explore state.
 * Keeps page.tsx as a server component (for data fetching) while enabling
 * client-side text selection and contextual explore panel interactions.
 */
export function ArticlePageClient({ article }: ArticlePageClientProps) {
  const [exploreText, setExploreText] = useState<string | null>(null);
  const [profileType, setProfileType] = useState<string | null>(null);

  // Read profile from localStorage on mount to determine AI depth label.
  useEffect(() => {
    const profile = getProfile();
    if (profile?.profileType) {
      setProfileType(profile.profileType);
    }
  }, []);

  return (
    <article className="min-h-screen px-4 py-12">
      <div className="mx-auto w-full" style={{ maxWidth: "720px" }}>
        <ArticleNav />
        <ArticleHeader article={article} />
        <ArticleToolbar />
        <ArticleBody
          body={article.body}
          onExplore={(text) => setExploreText(text)}
        />
        <SendToChatButton articleTitle={article.title} />
        <NewsletterCTA />
      </div>

      {/* Side panel rendered outside the max-width container so it can span full height */}
      <ContextualExplorePanel
        selectedText={exploreText}
        profileType={profileType}
        articleId={article.id}
        onClose={() => setExploreText(null)}
      />
    </article>
  );
}
