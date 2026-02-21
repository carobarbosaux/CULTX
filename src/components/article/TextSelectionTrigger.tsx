"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface TextSelectionTriggerProps {
  children: React.ReactNode;
  onExplore: (text: string) => void;
}

interface ButtonPosition {
  top: number;
  left: number;
}

// Minimum character length for a valid selection to trigger the Explore button.
const MIN_SELECTION_LENGTH = 10;

export function TextSelectionTrigger({ children, onExplore }: TextSelectionTriggerProps) {
  const [selectedText, setSelectedText] = useState<string>("");
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clear selection state and hide the button.
  const clearSelection = useCallback(() => {
    setSelectedText("");
    setButtonPosition(null);
  }, []);

  // Handle text selection on mouse-up and touch-end.
  const handleSelectionEnd = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      clearSelection();
      return;
    }

    const text = selection.toString().trim();
    if (text.length < MIN_SELECTION_LENGTH) {
      clearSelection();
      return;
    }

    // Get position from the selection range to place the button above it.
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect || rect.width === 0) {
      clearSelection();
      return;
    }

    const BUTTON_HEIGHT_ESTIMATE = 34; // px, approximate button height including padding
    const BUTTON_OFFSET = 8; // gap between selection top and button bottom

    setSelectedText(text);
    setButtonPosition({
      top: rect.top + window.scrollY - BUTTON_HEIGHT_ESTIMATE - BUTTON_OFFSET,
      left: rect.left + rect.width / 2,
    });
  }, [clearSelection]);

  // Listen for selectionchange events to hide button when user deselects.
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.toString().trim().length < MIN_SELECTION_LENGTH) {
        // Delay slightly so click on the Explore button is processed first.
        setTimeout(() => {
          const fresh = window.getSelection();
          if (!fresh || fresh.toString().trim().length < MIN_SELECTION_LENGTH) {
            // Only clear if there truly is no selection anymore.
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

  return (
    <div
      ref={containerRef}
      onMouseUp={handleSelectionEnd}
      onTouchEnd={handleSelectionEnd}
    >
      {children}

      {/* Floating "Explorar" button — positioned fixed relative to viewport scroll */}
      {selectedText && buttonPosition && (
        <button
          type="button"
          onClick={handleExploreClick}
          aria-label="Explorar el texto seleccionado"
          style={{
            position: "fixed",
            top: `${buttonPosition.top - window.scrollY}px`,
            left: `${buttonPosition.left}px`,
            transform: "translateX(-50%)",
            backgroundColor: "var(--color-accent)",
            color: "#ffffff",
            fontFamily: "var(--font-ui)",
            fontSize: "0.75rem",
            fontWeight: 500,
            borderRadius: "var(--radius-full)",
            padding: "6px 12px",
            zIndex: 50,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "var(--shadow-md)",
            transition: "opacity 200ms ease, transform 200ms ease",
            whiteSpace: "nowrap",
          }}
        >
          <MagnifyingGlass size={14} weight="thin" />
          Explorar
        </button>
      )}
    </div>
  );
}
