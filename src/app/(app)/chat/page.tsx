"use client";

// P08 — Fullscreen AI Conversation Page
// Accessible from ChatSidebar's expand button (ArrowsOut).
// Reads from shared chatStore — message history is the same as sidebar.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CaretLeft,
  ChatTeardrop,
  Trash,
  ArrowUp,
} from "@phosphor-icons/react";
import { useChatStore } from "@/components/chat/ChatProvider";

export default function ChatPage() {
  const { messages, articleContext, setChatMode, addMessage, clearMessages } =
    useChatStore();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const placeholderText = articleContext
    ? `Pregunta sobre «${articleContext}»…`
    : "Escribe tu pregunta…";

  function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    addMessage({ role: "user", content: trimmed });
    setInputValue("");
    // AI response wiring arrives in plan 04-04
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Send on Enter without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleBack() {
    // Return to article page with sidebar mode active
    setChatMode("sidebar");
    router.back();
  }

  function handleClearMessages() {
    clearMessages();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* ── Top bar ────────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
          padding: "0 24px",
          borderBottom: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
          flexShrink: 0,
        }}
      >
        {/* Back button */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="Volver al artículo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 10px",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-ui)",
            fontSize: "0.875rem",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <CaretLeft size={16} weight="thin" />
          Volver al artículo
        </button>

        {/* Center — article context label */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "0 16px",
            overflow: "hidden",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {articleContext
              ? `Discutiendo: ${articleContext}`
              : "Conversación cultural"}
          </p>
        </div>

        {/* Clear conversation */}
        <button
          type="button"
          onClick={handleClearMessages}
          aria-label="Limpiar conversación"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-text-muted)",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Trash size={18} weight="thin" />
        </button>
      </div>

      {/* ── Messages list ───────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {messages.length === 0 ? (
            /* Empty state */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                paddingTop: "80px",
                textAlign: "center",
              }}
            >
              <ChatTeardrop
                size={32}
                weight="thin"
                style={{ color: "var(--color-accent)" }}
              />
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    color: "var(--color-text-primary)",
                    margin: "0 0 8px 0",
                    fontWeight: 600,
                  }}
                >
                  Empieza a explorar la cultura mexicana
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.9375rem",
                    color: "var(--color-text-muted)",
                    margin: 0,
                    maxWidth: "400px",
                    lineHeight: "1.6",
                  }}
                >
                  Pregunta sobre lo que acabas de leer, un movimiento cultural,
                  un artista…
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "8px 12px",
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.9375rem",
                    lineHeight: "1.6",
                    ...(msg.role === "user"
                      ? {
                          backgroundColor: "var(--color-accent)",
                          color: "#ffffff",
                          borderRadius:
                            "var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)",
                        }
                      : {
                          backgroundColor: "var(--color-surface-raised)",
                          color: "var(--color-text-primary)",
                          borderRadius:
                            "var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)",
                        }),
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input area (sticky bottom) ──────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          padding: "16px 24px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
          }}
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            rows={2}
            aria-label="Escribe tu pregunta al compañero cultural de IA"
            style={{
              flex: 1,
              resize: "none",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              padding: "10px 14px",
              fontFamily: "var(--font-ui)",
              fontSize: "0.9375rem",
              color: "var(--color-text-primary)",
              backgroundColor: "var(--color-bg)",
              outline: "none",
              lineHeight: "1.5",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            aria-label="Enviar mensaje"
            disabled={!inputValue.trim()}
            style={{
              padding: "10px",
              borderRadius: "50%",
              border: "none",
              cursor: inputValue.trim() ? "pointer" : "default",
              backgroundColor: inputValue.trim()
                ? "var(--color-accent)"
                : "var(--color-surface-raised)",
              color: inputValue.trim() ? "#ffffff" : "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s, opacity 0.2s",
              opacity: inputValue.trim() ? 1 : 0.4,
              flexShrink: 0,
            }}
          >
            <ArrowUp size={18} weight="thin" />
          </button>
        </div>
      </div>
    </div>
  );
}
