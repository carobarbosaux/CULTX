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
import { getChatResponse } from "@/ai/chatResponder";
import { getProfile } from "@/lib/profile";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

export default function ChatPage() {
  const { messages, articleContext, setChatMode, addMessage, clearMessages } =
    useChatStore();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [profileType] = useState<string | null>(() =>
    typeof window !== "undefined" ? (getProfile()?.profileType ?? null) : null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-scroll to bottom when new messages arrive or typing indicator toggles
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const placeholderText = articleContext
    ? `Ask about «${articleContext}»…`
    : "Type your question…";

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
          aria-label="Go back"
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
          Go back
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
              color: "var(--color-text-secondary)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {articleContext
              ? `Discussing: ${articleContext}`
              : "Cultural conversation"}
          </p>
        </div>

        {/* Clear conversation */}
        <button
          type="button"
          onClick={handleClearMessages}
          aria-label="Clear conversation"
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
          {messages.length === 0 && !isTyping ? (
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
                  Start exploring Mexican culture
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.9375rem",
                    color: "var(--color-text-secondary)",
                    margin: 0,
                    maxWidth: "400px",
                    lineHeight: "1.6",
                  }}
                >
                  Ask about what you just read, a cultural movement,
                  an artist…
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
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
                      whiteSpace: "pre-wrap",
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
              ))}

              {/* Typing indicator — shown while AI is generating a response */}
              {isTyping && <TypingIndicator />}
            </>
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
            disabled={isTyping}
            aria-label="Type your question to the AI cultural companion"
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
          <button
            type="button"
            onClick={handleSend}
            aria-label="Send message"
            disabled={!inputValue.trim() || isTyping}
            style={{
              padding: "10px",
              borderRadius: "50%",
              border: "none",
              cursor: inputValue.trim() && !isTyping ? "pointer" : "default",
              backgroundColor:
                inputValue.trim() && !isTyping
                  ? "var(--color-accent)"
                  : "var(--color-surface-raised)",
              color:
                inputValue.trim() && !isTyping ? "#ffffff" : "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s, opacity 0.2s",
              opacity: inputValue.trim() && !isTyping ? 1 : 0.4,
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
