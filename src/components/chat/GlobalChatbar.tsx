"use client";
import { useEffect, useState } from "react";
import { ChatTeardrop, ArrowUp, ArrowsOut, X } from "@phosphor-icons/react";
import { useChatStore } from "@/components/chat/ChatProvider";
import { getChatResponse } from "@/ai/chatResponder";
import { getProfile } from "@/lib/profile";

// ────────────────────────────────────────────────────────────────────────────────
// GlobalChatbar — multi-state chatbar using shared chatStore
//
// States:
//   minimal   → pill button always visible at bottom
//   drawer    → expanded input bar with context badge
//   sidebar   → hidden (ConversationSidebar renders its own UI — plan 04-03)
//   fullscreen → hidden (AIConversationPage renders its own UI — plan 04-04)
//
// Drawer send UX: after the user sends a message from the drawer, the chatbar
// automatically switches to sidebar mode so the AI response is visible in the
// larger, scrollable sidebar surface.
// ────────────────────────────────────────────────────────────────────────────────

export function GlobalChatbar() {
  const { chatMode, articleContext, messages, setChatMode, setArticleContext, addMessage } =
    useChatStore();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [profileType, setProfileType] = useState<string | null>(null);

  // Load profile type on mount (SSR-safe — getProfile reads localStorage)
  useEffect(() => {
    const profile = getProfile();
    setProfileType(profile?.profileType ?? null);
  }, []);

  // Sidebar and fullscreen modes: this component is invisible — those modes render
  // their own UI in their respective components.
  if (chatMode === "sidebar" || chatMode === "fullscreen") {
    return null;
  }

  // Context-aware placeholder text
  const placeholderText = articleContext
    ? `Pregunta sobre «${articleContext}»…`
    : "Pregunta sobre cultura mexicana…";

  // ── Minimal (pill) state ────────────────────────────────────────────────────
  if (chatMode === "minimal") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-4 pointer-events-none">
        <button
          type="button"
          onClick={() => setChatMode("drawer")}
          aria-label="Abrir compañero cultural de IA"
          className="pointer-events-auto flex items-center gap-3 rounded-full border px-5 py-3 transition-shadow duration-[200ms] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <ChatTeardrop size={18} weight="thin" style={{ color: "var(--color-accent)" }} />
          <span
            className="text-sm"
            style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-muted)" }}
          >
            {placeholderText}
          </span>
        </button>
      </div>
    );
  }

  // ── Drawer state ────────────────────────────────────────────────────────────

  async function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;
    addMessage({ role: "user", content: trimmed });
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking: 800–1200ms random delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    const response = getChatResponse({
      userMessage: trimmed,
      articleContext,
      profileType,
      messageCount: messages.length,
    });
    addMessage({ role: "assistant", content: response });
    setIsTyping(false);

    // Auto-expand to sidebar after responding so the user can read the full reply
    setChatMode("sidebar");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Send on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t px-4 py-3"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-surface)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        {/* Context badge — visible when an article has been sent to chat */}
        {articleContext && (
          <div className="flex items-center gap-2">
            <span
              className="flex-1 truncate rounded-md px-3 py-1 text-xs"
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
              aria-label="Quitar contexto del artículo"
              className="shrink-0 rounded p-1 transition-opacity duration-[200ms] hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
              style={{ color: "var(--color-text-muted)" }}
            >
              <X size={12} weight="thin" />
            </button>
          </div>
        )}

        {/* Input row */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholderText}
              rows={2}
              disabled={isTyping}
              aria-label="Escribe tu pregunta al compañero cultural de IA"
              className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm focus:outline-none transition-[border-color] duration-[200ms]"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-ui)",
                cursor: isTyping ? "not-allowed" : "text",
                opacity: isTyping ? 0.5 : 1,
              }}
              onFocus={(e) => {
                if (!isTyping) {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            />
          </div>

          {/* Action buttons column */}
          <div className="flex flex-col gap-1.5 pb-0.5">
            {/* Close drawer → return to minimal pill */}
            <button
              type="button"
              onClick={() => setChatMode("minimal")}
              aria-label="Cerrar chat"
              className="p-1.5 rounded transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
              style={{ color: "var(--color-text-muted)" }}
            >
              <X size={16} weight="thin" />
            </button>

            {/* Expand to sidebar */}
            <button
              type="button"
              onClick={() => setChatMode("sidebar")}
              aria-label="Abrir como panel lateral"
              className="p-1.5 rounded transition-colors duration-[200ms] hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
              style={{ color: "var(--color-text-muted)" }}
            >
              <ArrowsOut size={16} weight="thin" />
            </button>

            {/* Send message */}
            <button
              type="button"
              onClick={handleSend}
              aria-label="Enviar mensaje"
              disabled={!inputValue.trim() || isTyping}
              className="p-1.5 rounded-full transition-colors duration-[200ms] disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
              style={{
                backgroundColor:
                  inputValue.trim() && !isTyping
                    ? "var(--color-accent)"
                    : "var(--color-surface-raised)",
                color:
                  inputValue.trim() && !isTyping ? "#ffffff" : "var(--color-text-muted)",
              }}
            >
              <ArrowUp size={16} weight="thin" />
            </button>
          </div>
        </div>

        {/* Conversation history preview (last message, if any) */}
        {messages.length > 0 && !isTyping && (
          <p
            className="truncate text-xs opacity-60"
            style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-muted)" }}
          >
            {messages[messages.length - 1].role === "user" ? "Tú: " : "IA: "}
            {messages[messages.length - 1].content}
          </p>
        )}

        {/* Typing indicator preview while waiting in drawer */}
        {isTyping && (
          <p
            className="text-xs opacity-60 italic"
            style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-muted)" }}
          >
            El compañero cultural está escribiendo…
          </p>
        )}
      </div>
    </div>
  );
}
