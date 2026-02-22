"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowsIn,
  ArrowsOut,
  ArrowUp,
  ChatTeardrop,
  ClockCounterClockwise,
  Microphone,
  NotePencil,
  X,
} from "@phosphor-icons/react/dist/ssr";

// Waveform SVG — matches GlobalChatbar's voice icon
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

// Render assistant message content — parses [text](/url) into real links
function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\[([^\]]+)\]\(([^)]+)\))/g);
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < parts.length) {
    const part = parts[i];
    if (part.startsWith("[") && parts[i + 1] !== undefined) {
      // This is a match group — skip the capture groups next
      i++;
      const text = parts[i]; i++;
      const href = parts[i]; i++;
      nodes.push(
        <Link
          key={i}
          href={href}
          style={{ color: "var(--color-accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          {text}
        </Link>
      );
    } else {
      if (part) nodes.push(part);
      i++;
    }
  }
  return <>{nodes}</>;
}
import { useChatStore } from "@/components/chat/ChatProvider";
import { getChatResponse } from "@/ai/chatResponder";
import { getProfile } from "@/lib/profile";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

// ────────────────────────────────────────────────────────────────────────────────
// ChatSidebar — P08b
//
// Persistent 380px fixed right panel rendered when chatMode === "sidebar".
// Reads from shared chatStore (messages, articleContext, chatMode controls).
// When chatMode !== "sidebar", renders null.
// ────────────────────────────────────────────────────────────────────────────────

export function ChatSidebar() {
  const { messages, articleContext, chatMode, quotedText, setChatMode, addMessage, clearMessages, setQuotedText } =
    useChatStore();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [profileType] = useState<string | null>(() =>
    typeof window !== "undefined" ? (getProfile()?.profileType ?? null) : null
  );
  const [showHistory, setShowHistory] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isFullscreen = chatMode === "fullscreen";

  // Auto-scroll to bottom when new messages arrive or typing indicator toggles
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Only render in sidebar or fullscreen mode
  if (chatMode !== "sidebar" && chatMode !== "fullscreen") {
    return null;
  }

  const placeholderText = articleContext
    ? `Ask about «${articleContext}»…`
    : "Type your question…";

  async function handleSend() {
    const trimmed = inputValue.trim();
    if ((!trimmed && !quotedText) || isTyping) return;
    const fullContent = quotedText
      ? `> ${quotedText}\n\n${trimmed}`.trim()
      : trimmed;
    addMessage({ role: "user", content: fullContent });
    setInputValue("");
    setQuotedText(null);
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

  function handleToggleFullscreen() {
    setChatMode(isFullscreen ? "sidebar" : "fullscreen");
  }

  function handleCollapse() {
    setChatMode("minimal");
  }

  const iconBtnStyle: React.CSSProperties = {
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
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "56px",
        right: 0,
        width: isFullscreen ? "min(720px, 100vw)" : "380px",
        height: "calc(100vh - 56px)",
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
                  color: "var(--color-text-secondary)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Discussing:
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
              Cultural Companion
            </p>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {/* New conversation */}
          <button
            type="button"
            onClick={() => { clearMessages(); setShowHistory(false); }}
            aria-label="New conversation"
            title="New conversation"
            style={iconBtnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <NotePencil size={17} weight="thin" />
          </button>

          {/* History */}
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            aria-label="View history"
            title="Conversation history"
            style={{ ...iconBtnStyle, opacity: showHistory ? 1 : undefined, color: showHistory ? "var(--color-accent)" : "var(--color-text-muted)" }}
            onMouseEnter={(e) => { if (!showHistory) e.currentTarget.style.opacity = "0.6"; }}
            onMouseLeave={(e) => { if (!showHistory) e.currentTarget.style.opacity = "1"; }}
          >
            <ClockCounterClockwise size={17} weight="thin" />
          </button>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? "Reduce panel" : "Full screen"}
            title={isFullscreen ? "Reduce panel" : "Full screen"}
            style={iconBtnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {isFullscreen
              ? <ArrowsIn size={17} weight="thin" />
              : <ArrowsOut size={17} weight="thin" />}
          </button>

          {/* Close sidebar */}
          <button
            type="button"
            onClick={handleCollapse}
            aria-label="Close panel"
            title="Close panel"
            style={iconBtnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <X size={17} weight="thin" />
          </button>
        </div>
      </div>

      {/* ── History panel (overlay when showHistory is true) ── */}
      {showHistory && (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
            History
          </p>
          {messages.length === 0 ? (
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
              No messages yet.
            </p>
          ) : (
            messages
              .filter((m) => m.role === "user")
              .map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-surface-raised)",
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.8rem",
                    color: "var(--color-text-secondary)",
                    cursor: "pointer",
                    border: "1px solid var(--color-border)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => setShowHistory(false)}
                >
                  {m.content}
                </div>
              ))
          )}
        </div>
      )}

      {/* ── Messages list ───────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: showHistory ? "none" : "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.length === 0 && !isTyping ? (
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
                color: "var(--color-text-secondary)",
                textAlign: "center",
                margin: 0,
              }}
            >
              Start a conversation…
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
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
                  {msg.role === "assistant"
                    ? <MessageContent content={msg.content} />
                    : msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator — shown while AI is generating a response */}
            {isTyping && <TypingIndicator />}
          </>
        )}
        {/* Dummy div for auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 16px 16px",
          borderTop: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            borderRadius: "16px",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          {/* Quoted text block */}
          {quotedText && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "10px 14px 0" }}>
              <div style={{ flex: 1, minWidth: 0, borderLeft: "2px solid var(--color-accent)", paddingLeft: "10px" }}>
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.75rem",
                    fontStyle: "italic",
                    color: "var(--color-text-secondary)",
                    margin: 0,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {quotedText}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuotedText(null)}
                aria-label="Remove quote"
                style={{
                  flexShrink: 0,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  padding: "2px",
                  borderRadius: "4px",
                  display: "flex",
                }}
              >
                <X size={11} weight="thin" />
              </button>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", padding: "10px 14px" }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholderText}
              rows={2}
              disabled={isTyping}
              aria-label="Type your question to the AI cultural companion"
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
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, paddingBottom: "2px" }}>
              {/* Voice mode */}
              <button
                type="button"
                aria-label="Voice mode"
                title="Voice mode"
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:opacity-80"
                style={{
                  backgroundColor: "var(--color-surface-raised)",
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <WaveformIcon size={14} />
              </button>

              {/* Dictate / Send */}
              {inputValue.trim() ? (
                <button
                  type="button"
                  onClick={handleSend}
                  aria-label="Send message"
                  disabled={isTyping}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "#ffffff",
                    border: "none",
                    opacity: isTyping ? 0.5 : 1,
                    cursor: isTyping ? "default" : "pointer",
                  }}
                >
                  <ArrowUp size={15} weight="thin" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsVoiceActive((v) => !v)}
                  aria-label={isVoiceActive ? "Stop dictation" : "Dictate message"}
                  title={isVoiceActive ? "Stop dictation" : "Dictate message"}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: isVoiceActive ? "var(--color-accent)" : "var(--color-surface-raised)",
                    color: isVoiceActive ? "#fff" : "var(--color-text-secondary)",
                    border: isVoiceActive ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                    cursor: "pointer",
                  }}
                >
                  <Microphone size={14} weight={isVoiceActive ? "fill" : "thin"} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
