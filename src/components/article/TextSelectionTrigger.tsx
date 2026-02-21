"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowBendUpRight, Sparkle } from "@phosphor-icons/react";

interface TextSelectionTriggerProps {
  children: React.ReactNode;
  onExplore: (text: string) => void;
  onSendToChat: (text: string) => void;
}

interface ButtonPosition {
  top: number;
  left: number;
}

const MIN_SELECTION_LENGTH = 10;

export function TextSelectionTrigger({ children, onExplore, onSendToChat }: TextSelectionTriggerProps) {
  const [selectedText, setSelectedText] = useState<string>("");
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearSelection = useCallback(() => {
    setSelectedText("");
    setButtonPosition(null);
  }, []);

  const handleSelectionEnd = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) { clearSelection(); return; }

    const text = selection.toString().trim();
    if (text.length < MIN_SELECTION_LENGTH) { clearSelection(); return; }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect || rect.width === 0) { clearSelection(); return; }

    const TOOLBAR_HEIGHT = 40;
    const OFFSET = 8;

    setSelectedText(text);
    setButtonPosition({
      top: rect.top + window.scrollY - TOOLBAR_HEIGHT - OFFSET,
      left: rect.left + rect.width / 2,
    });
  }, [clearSelection]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.toString().trim().length < MIN_SELECTION_LENGTH) {
        setTimeout(() => {
          const fresh = window.getSelection();
          if (!fresh || fresh.toString().trim().length < MIN_SELECTION_LENGTH) {
            setSelectedText((prev) => {
              if (prev && (!fresh || fresh.toString().trim() === "")) {
                setButtonPosition(null);
                return "";
              }
              return prev;
            });
          }
        }, 150);
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const handleExploreClick = () => {
    if (!selectedText) return;
    onExplore(selectedText);
    window.getSelection()?.removeAllRanges();
    clearSelection();
  };

  const handleSendToChatClick = () => {
    if (!selectedText) return;
    onSendToChat(selectedText);
    window.getSelection()?.removeAllRanges();
    clearSelection();
  };

  const btnBase: React.CSSProperties = {
    fontFamily: "var(--font-ui)",
    fontSize: "0.72rem",
    fontWeight: 500,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 11px",
    whiteSpace: "nowrap",
    transition: "opacity 150ms ease",
  };

  return (
    <div ref={containerRef} onMouseUp={handleSelectionEnd} onTouchEnd={handleSelectionEnd}>
      {children}

      {/* Floating action pill — appears above selection */}
      {selectedText && buttonPosition && (
        <div
          style={{
            position: "fixed",
            top: `${buttonPosition.top - window.scrollY}px`,
            left: `${buttonPosition.left}px`,
            transform: "translateX(-50%)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: "1px",
            borderRadius: "999px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            border: "1px solid var(--color-accent-hover)",
          }}
        >
          {/* Profundizar tema */}
          <button
            type="button"
            onClick={handleExploreClick}
            aria-label="Profundizar tema"
            style={{
              ...btnBase,
              backgroundColor: "var(--color-accent)",
              color: "#ffffff",
              borderRadius: "999px 0 0 999px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Sparkle size={13} weight="fill" />
            Profundizar tema
          </button>

          {/* Divider */}
          <span style={{ width: "1px", height: "28px", backgroundColor: "var(--color-accent-hover)" }} aria-hidden="true" />

          {/* Llevar al chat */}
          <button
            type="button"
            onClick={handleSendToChatClick}
            aria-label="Llevar al chat"
            style={{
              ...btnBase,
              backgroundColor: "var(--color-accent)",
              color: "#ffffff",
              borderRadius: "0 999px 999px 0",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <ArrowBendUpRight size={13} weight="thin" />
            Llevar al chat
          </button>
        </div>
      )}
    </div>
  );
}
