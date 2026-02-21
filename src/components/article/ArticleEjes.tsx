"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { useChatStore } from "@/components/chat/ChatProvider";
import { getChatResponse } from "@/ai/chatResponder";
import { getProfile } from "@/lib/profile";
import type { Article } from "@/lib/articles";

// Generate 3 contextual questions per article based on its tags and title
function getEjes(article: Article): string[] {
  const tag = article.tags[0] ?? "cultura";
  const title = article.title;

  // Tag-aware question templates
  const byTag: Record<string, [string, string, string]> = {
    Architecture: [
      `¿Cómo dialoga la arquitectura de «${title}» con las tradiciones prehispánicas?`,
      "¿Qué materiales locales se usan y por qué importa esa elección?",
      "¿Existe un movimiento de arquitectura comunitaria en México hoy?",
    ],
    "Regional history": [
      `¿Cuál es el contexto histórico que da forma a «${title}»?`,
      "¿Cómo influye la región en la identidad cultural de sus comunidades?",
      "¿Qué tensiones entre tradición y modernidad aparecen en este tema?",
    ],
    "Cultural heritage": [
      `¿Qué amenazas enfrenta el patrimonio descrito en «${title}»?`,
      "¿Cómo se transmite este conocimiento de generación en generación?",
      "¿Qué papel tienen las comunidades locales en su preservación?",
    ],
    Art: [
      `¿Qué corriente artística contextualiza «${title}»?`,
      "¿Cómo negocia este arte entre lo local y lo global?",
      "¿Qué artistas contemporáneos continúan esta conversación hoy?",
    ],
    Music: [
      `¿Cuáles son los orígenes del género musical en «${title}»?`,
      "¿Cómo refleja esta música la migración y el mestizaje?",
      "¿Existe riesgo de que este género desaparezca? ¿Por qué?",
    ],
    Literature: [
      `¿Qué autores han explorado los temas de «${title}»?`,
      "¿Cómo se relaciona esta literatura con la identidad nacional?",
      "¿Hay voces emergentes que reinterpreten esta tradición?",
    ],
  };

  const match = Object.keys(byTag).find((k) => article.tags.includes(k));
  if (match) return byTag[match];

  // Generic fallback
  return [
    `¿Cuál es el contexto histórico de «${title}»?`,
    "¿Cómo se relaciona este tema con la cultura mexicana contemporánea?",
    "¿Qué comunidades o actores son clave en esta conversación?",
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
        Ejes para profundizar
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
