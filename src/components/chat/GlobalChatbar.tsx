"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChatTeardrop, Microphone, Phone, X } from "@phosphor-icons/react";
import { useChatStore } from "@/components/chat/ChatProvider";
import { getChatResponse } from "@/ai/chatResponder";
import { getProfile } from "@/lib/profile";
import { LOCAL_STORAGE_KEYS, GUEST_AI_LIMIT } from "@/lib/constants";

function getGuestInteractions(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_INTERACTIONS) ?? "0", 10);
}
function incrementGuestInteractions(): number {
  const next = getGuestInteractions() + 1;
  localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_INTERACTIONS, String(next));
  return next;
}

// ────────────────────────────────────────────────────────────────────────────────
// Suggested prompts — article-context-aware
// ────────────────────────────────────────────────────────────────────────────────
function getSuggestedPrompts(articleContext: string | null): string[] {
  if (articleContext) {
    return [
      `¿Cuál es el contexto histórico de «${articleContext}»?`,
      `Explícame los personajes clave de este tema`,
      `¿Cómo se relaciona esto con la cultura mexicana actual?`,
    ];
  }
  return [
    "¿Cuáles son las tradiciones más importantes de México?",
    "Cuéntame sobre el muralismo mexicano",
    "¿Qué es el patrimonio cultural inmaterial?",
  ];
}

// ────────────────────────────────────────────────────────────────────────────────
// GlobalChatbar
//
// Collapsed: narrow pill (icon + short text)
// Expanded: card with textarea, voice/dictate/send buttons
// Suggested prompts fade in above the bar when expanded
// Always visible except on fullscreen chat page
// ────────────────────────────────────────────────────────────────────────────────

export function GlobalChatbar() {
  const { chatMode, articleContext, messages, setChatMode, setArticleContext, addMessage } =
    useChatStore();
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [profileType, setProfileType] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const profile = getProfile();
    setProfileType(profile?.profileType ?? null);
  }, []);

  if (chatMode === "fullscreen") return null;

  const isExpanded = isFocused || inputValue.length > 0;
  const isSidebarOpen = chatMode === "sidebar";
  const suggestedPrompts = getSuggestedPrompts(articleContext);

  const placeholderText = articleContext
    ? `Pregunta sobre «${articleContext}»…`
    : "Pregunta sobre cultura mexicana…";

  async function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    const isGuest = !getProfile()?.isLoggedIn;

    addMessage({ role: "user", content: trimmed });
    setInputValue("");
    setIsFocused(false);
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    if (isGuest) {
      const count = incrementGuestInteractions();
      if (count > GUEST_AI_LIMIT) {
        // Guest limit reached — inject signup nudge as AI message
        addMessage({
          role: "assistant",
          content:
            "Has alcanzado el límite de 3 conversaciones gratuitas. Crea una cuenta para seguir explorando la cultura mexicana sin límites — es gratis.\n\n👉 [Crear cuenta](/signup)",
        });
        setIsTyping(false);
        setChatMode("sidebar");
        return;
      }
    }

    const response = getChatResponse({
      userMessage: trimmed,
      articleContext,
      profileType,
      messageCount: messages.length,
    });
    addMessage({ role: "assistant", content: response });
    setIsTyping(false);
    setChatMode("sidebar");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") {
      setIsFocused(false);
      textareaRef.current?.blur();
    }
  }

  function handlePromptClick(prompt: string) {
    setInputValue(prompt);
    textareaRef.current?.focus();
  }

  return (
    <div
      className="fixed bottom-4 flex flex-col items-center transition-all duration-300"
      style={{
        left: "0",
        right: isSidebarOpen ? "380px" : "0",
        paddingLeft: "16px",
        paddingRight: "16px",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* ── Suggested prompts — fade in when expanded, single-row scroll ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          margin: "0 auto 8px",
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          pointerEvents: isExpanded ? "auto" : "none",
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        } as React.CSSProperties}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            width: "max-content",
            paddingBottom: "2px",
          }}
        >
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handlePromptClick(prompt);
              }}
              className="text-xs px-3 py-1.5 rounded-full border transition-all duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--color-text-secondary)",
                borderColor: "var(--color-border)",
                backgroundColor: "color-mix(in srgb, var(--color-surface) 92%, transparent)",
                backdropFilter: "blur(8px)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                pointerEvents: "auto",
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main bar ── */}
      <div
        className="pointer-events-auto transition-all duration-200"
        style={{
          width: isExpanded ? "100%" : "auto",
          maxWidth: isExpanded ? "580px" : "300px",
          minWidth: isExpanded ? "300px" : "180px",
          margin: "0 auto",
          borderRadius: isExpanded ? "16px" : "999px",
          border: "1px solid",
          borderColor: isFocused ? "var(--color-accent)" : "var(--color-border)",
          backgroundColor: isExpanded
            ? "var(--color-surface)"
            : "color-mix(in srgb, var(--color-surface) 85%, transparent)",
          backdropFilter: "blur(12px)",
          boxShadow: isExpanded
            ? "0 8px 32px rgba(0,0,0,0.14)"
            : "0 2px 10px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Article context badge */}
        {articleContext && isExpanded && (
          <div className="flex items-center gap-2 px-4 pt-3">
            <span
              className="flex-1 truncate rounded-md px-2 py-0.5 text-xs"
              style={{
                backgroundColor: "var(--color-surface-raised)",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-ui)",
              }}
            >
              Contexto: {articleContext}
            </span>
            <button
              type="button"
              onClick={() => setArticleContext(null)}
              aria-label="Quitar contexto"
              className="shrink-0 rounded p-0.5 transition-opacity duration-200 hover:opacity-70"
              style={{ color: "var(--color-text-muted)" }}
            >
              <X size={11} weight="thin" />
            </button>
          </div>
        )}

        {/* Input + actions row */}
        <div
          className="flex items-end gap-2 px-4"
          style={{ paddingTop: isExpanded ? "12px" : "9px", paddingBottom: "9px" }}
        >
          {!isExpanded && (
            <ChatTeardrop
              size={14}
              weight="thin"
              style={{ color: "var(--color-accent)", flexShrink: 0, marginBottom: "1px" }}
            />
          )}

          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholderText}
            rows={isExpanded ? 2 : 1}
            disabled={isTyping}
            aria-label="Escribe tu pregunta al compañero cultural de IA"
            className="flex-1 resize-none bg-transparent border-none outline-none text-sm"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-primary)",
              lineHeight: "1.5",
              cursor: isTyping ? "not-allowed" : "text",
              opacity: isTyping ? 0.5 : 1,
              minWidth: 0,
            }}
          />

          {/* Action buttons — visible when expanded */}
          {isExpanded && (
            <div className="flex items-center gap-1.5 flex-shrink-0 pb-0.5">
              {/* Voice conversation */}
              <button
                type="button"
                onClick={() => setChatMode("sidebar")}
                aria-label="Iniciar conversación de voz"
                title="Hablar con el compañero"
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:opacity-80"
                style={{
                  backgroundColor: "var(--color-surface-raised)",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Phone size={14} weight="thin" />
              </button>

              {/* Dictate */}
              <button
                type="button"
                onClick={() => setIsVoiceActive((v) => !v)}
                aria-label={isVoiceActive ? "Detener dictado" : "Dictar mensaje"}
                title={isVoiceActive ? "Detener dictado" : "Dictar mensaje"}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: isVoiceActive
                    ? "var(--color-accent)"
                    : "var(--color-surface-raised)",
                  color: isVoiceActive ? "#fff" : "var(--color-text-muted)",
                  border: isVoiceActive
                    ? "1px solid var(--color-accent)"
                    : "1px solid var(--color-border)",
                }}
              >
                <Microphone size={14} weight={isVoiceActive ? "fill" : "thin"} />
              </button>

              {/* Send */}
              <button
                type="button"
                onClick={handleSend}
                aria-label="Enviar mensaje"
                disabled={!inputValue.trim() || isTyping}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 disabled:opacity-40"
                style={{
                  backgroundColor:
                    inputValue.trim() && !isTyping
                      ? "var(--color-accent)"
                      : "var(--color-surface-raised)",
                  color:
                    inputValue.trim() && !isTyping ? "#ffffff" : "var(--color-text-muted)",
                }}
              >
                <ArrowUp size={15} weight="thin" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
