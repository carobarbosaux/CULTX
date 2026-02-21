"use client";
import { useRef, useState } from "react";
import { ArrowUp, ChatTeardrop, Microphone, X } from "@phosphor-icons/react";

// Simple tooltip wrapper — shows label above on hover
function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: "absolute",
          bottom: "calc(100% + 6px)",
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontSize: "0.7rem",
          fontFamily: "var(--font-ui)",
          color: "var(--color-text-primary)",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "6px",
          padding: "3px 8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.15s ease",
          zIndex: 100,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// Horizontal waveform SVG icon for voice mode
function WaveformIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="2"  y1="12" x2="2"  y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6"  y1="8"  x2="6"  y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="4"  x2="10" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="7"  x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="9"  x2="18" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
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
  const [profileType] = useState<string | null>(() =>
    typeof window !== "undefined" ? (getProfile()?.profileType ?? null) : null
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        }}
      >
        {/* Article context badge */}
        {articleContext && isExpanded && (
          <div className="flex items-center gap-2 px-4 pt-3">
            <span
              className="flex-1 truncate rounded-md px-2 py-0.5 text-xs"
              style={{
                backgroundColor: "var(--color-surface-raised)",
                color: "var(--color-text-secondary)",
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
              {/* Voice mode */}
              <Tooltip label="Modo de voz">
                <button
                  type="button"
                  onClick={() => setChatMode("sidebar")}
                  aria-label="Modo de voz"
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:opacity-80"
                  style={{
                    backgroundColor: "var(--color-surface-raised)",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <WaveformIcon size={14} />
                </button>
              </Tooltip>

              {/* Dictate (default) → Send (when input has text) */}
              {inputValue.trim() ? (
                <Tooltip label="Enviar mensaje">
                  <button
                    type="button"
                    onClick={handleSend}
                    aria-label="Enviar mensaje"
                    disabled={isTyping}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "#ffffff",
                      opacity: isTyping ? 0.5 : 1,
                    }}
                  >
                    <ArrowUp size={15} weight="thin" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip label={isVoiceActive ? "Detener dictado" : "Dictar mensaje"}>
                  <button
                    type="button"
                    onClick={() => setIsVoiceActive((v) => !v)}
                    aria-label={isVoiceActive ? "Detener dictado" : "Dictar mensaje"}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: isVoiceActive
                        ? "var(--color-accent)"
                        : "var(--color-washi-200)",
                      color: isVoiceActive ? "#fff" : "var(--color-text-secondary)",
                      border: isVoiceActive
                        ? "1px solid var(--color-accent)"
                        : "1px solid var(--color-border)",
                    }}
                  >
                    <Microphone size={14} weight={isVoiceActive ? "fill" : "thin"} />
                  </button>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
