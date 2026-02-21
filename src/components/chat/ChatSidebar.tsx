"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowsIn,
  ArrowsOut,
  ArrowUp,
  ChatTeardrop,
} from "@phosphor-icons/react";
import { useChatStore } from "@/components/chat/ChatProvider";

// ────────────────────────────────────────────────────────────────────────────────
// ChatSidebar — P08b
//
// Persistent 380px fixed right panel rendered when chatMode === "sidebar".
// Reads from shared chatStore (messages, articleContext, chatMode controls).
// When chatMode !== "sidebar", renders null.
// ────────────────────────────────────────────────────────────────────────────────

export function ChatSidebar() {
  const { messages, articleContext, chatMode, setChatMode, addMessage } =
    useChatStore();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Only render in sidebar mode
  if (chatMode !== "sidebar") {
    return null;
  }

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

  function handleExpandToFullscreen() {
    // Navigate to fullscreen chat — chatMode stays "sidebar" until the page
    // sets it; the back button on /chat sets it back to "sidebar" on return.
    router.push("/chat");
  }

  function handleCollapse() {
    setChatMode("minimal");
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "380px",
        height: "100vh",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-surface)",
        borderLeft: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid var(--color-border)",
          minHeight: "48px",
          flexShrink: 0,
        }}
      >
        {/* Context title */}
        <div style={{ flex: 1, minWidth: 0, marginRight: "12px" }}>
          {articleContext ? (
            <>
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-text-muted)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Discutiendo:
              </p>
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.875rem",
                  color: "var(--color-text-primary)",
                  margin: 0,
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {articleContext}
              </p>
            </>
          ) : (
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.875rem",
                color: "var(--color-text-primary)",
                margin: 0,
                lineHeight: 1.3,
                fontWeight: 500,
              }}
            >
              Compañero Cultural
            </p>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {/* Collapse → minimal */}
          <button
            type="button"
            onClick={handleCollapse}
            aria-label="Colapsar chat"
            style={{
              padding: "6px",
              borderRadius: "6px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <ArrowsIn size={18} weight="thin" />
          </button>

          {/* Expand → fullscreen */}
          <button
            type="button"
            onClick={handleExpandToFullscreen}
            aria-label="Pantalla completa"
            style={{
              padding: "6px",
              borderRadius: "6px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <ArrowsOut size={18} weight="thin" />
          </button>
        </div>
      </div>

      {/* ── Messages list ───────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.length === 0 ? (
          /* Empty state */
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              paddingTop: "40px",
            }}
          >
            <ChatTeardrop
              size={24}
              weight="thin"
              style={{ color: "var(--color-accent)" }}
            />
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.875rem",
                color: "var(--color-text-muted)",
                textAlign: "center",
                margin: 0,
              }}
            >
              Inicia una conversación…
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "8px 12px",
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.875rem",
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
        {/* Dummy div for auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          rows={1}
          aria-label="Escribe tu pregunta al compañero cultural de IA"
          style={{
            flex: 1,
            resize: "none",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            padding: "8px 12px",
            fontFamily: "var(--font-ui)",
            fontSize: "0.875rem",
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
            padding: "8px",
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
          <ArrowUp size={16} weight="thin" />
        </button>
      </div>
    </div>
  );
}
