"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { useChatStore } from "@/components/chat/ChatProvider";
import { getChatResponse } from "@/ai/chatResponder";
import { getProfile } from "@/lib/profile";
import type { Article } from "@/lib/articles";

// Generate 3 contextual questions per article based on its tags and title
function getEjes(article: Article): string[] {
  const title = article.title;

  // Tag-aware question templates
  const byTag: Record<string, [string, string, string]> = {
    Architecture: [
      `How does the architecture in «${title}» dialogue with pre-Hispanic traditions?`,
      "What local materials are used and why does that choice matter?",
      "Is there a community architecture movement in Mexico today?",
    ],
    "Regional history": [
      `What is the historical context that shapes «${title}»?`,
      "How does the region influence the cultural identity of its communities?",
      "What tensions between tradition and modernity appear in this topic?",
    ],
    "Cultural heritage": [
      `What threats does the heritage described in «${title}» face?`,
      "How is this knowledge passed down from generation to generation?",
      "What role do local communities play in its preservation?",
    ],
    Art: [
      `What artistic movement contextualizes «${title}»?`,
      "How does this art negotiate between the local and the global?",
      "Which contemporary artists continue this conversation today?",
    ],
    Music: [
      `What are the origins of the musical genre in «${title}»?`,
      "How does this music reflect migration and cultural mixing?",
      "Is there a risk that this genre could disappear? Why?",
    ],
    Literature: [
      `Which authors have explored the themes of «${title}»?`,
      "How does this literature relate to national identity?",
      "Are there emerging voices reinterpreting this tradition?",
    ],
  };

  const match = Object.keys(byTag).find((k) => article.tags.includes(k));
  if (match) return byTag[match];

  // Generic fallback
  return [
    `What is the historical context of «${title}»?`,
    "How does this topic relate to contemporary Mexican culture?",
    "Which communities or actors are key to this conversation?",
  ];
}

interface ArticleEjesProps {
  article: Article;
}

export function ArticleEjes({ article }: ArticleEjesProps) {
  const { addMessage, setArticleContext, setChatMode, messages } = useChatStore();
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);

  const ejes = getEjes(article);

  async function handleEjeClick(question: string, idx: number) {
    if (loadingIdx !== null) return;

    // Set article context and open sidebar
    setArticleContext(article.title);
    setChatMode("sidebar");

    // Add user message
    addMessage({ role: "user", content: question });
    setLoadingIdx(idx);

    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    const profile = getProfile();
    const response = getChatResponse({
      userMessage: question,
      articleContext: article.title,
      profileType: profile?.profileType ?? null,
      messageCount: messages.length,
    });
    addMessage({ role: "assistant", content: response });
    setLoadingIdx(null);
  }

  return (
    <div
      className="mt-12 mb-4"
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: "32px",
      }}
    >
      <p
        className="text-xs uppercase tracking-widest mb-4"
        style={{
          fontFamily: "var(--font-ui)",
          color: "var(--color-text-muted)",
          letterSpacing: "0.1em",
        }}
      >
        Explore further
      </p>

      <div className="flex flex-col gap-2">
        {ejes.map((question, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleEjeClick(question, idx)}
            disabled={loadingIdx !== null}
            className="group flex items-center justify-between gap-3 w-full text-left rounded-lg px-4 py-3 transition-all duration-150"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: loadingIdx === idx ? "var(--color-text-muted)" : "var(--color-text-secondary)",
              fontFamily: "var(--font-ui)",
              fontSize: "0.875rem",
              cursor: loadingIdx !== null ? "default" : "pointer",
              opacity: loadingIdx !== null && loadingIdx !== idx ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (loadingIdx !== null) return;
              e.currentTarget.style.borderColor = "var(--color-accent)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <span className="flex-1">{question}</span>
            <ArrowRight
              size={15}
              weight="thin"
              style={{
                flexShrink: 0,
                color: loadingIdx === idx ? "var(--color-accent)" : "var(--color-text-muted)",
                transition: "transform 150ms ease",
              }}
              className="group-hover:translate-x-0.5"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
