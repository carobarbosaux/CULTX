"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "@phosphor-icons/react";
import { getContextualResponse } from "@/ai/contextualRAG";

interface ContextualExplorePanelProps {
  selectedText: string | null;
  profileType: string | null;
  articleId: string;
  onClose: () => void;
}

export function ContextualExplorePanel({
  selectedText,
  profileType,
  articleId: _articleId,
  onClose,
}: ContextualExplorePanelProps) {
  // Close panel on Escape key while open.
  useEffect(() => {
    if (!selectedText) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedText, onClose]);

  // Render nothing when no text is selected.
  if (!selectedText) return null;

  // Synchronous deterministic AI response — no async needed.
  const response = getContextualResponse(selectedText, profileType);

  return (
    /* Overlay backdrop — clicking it closes the panel */
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Panel de exploración contextual"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      {/* Slide-in side panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(400px, 90vw)",
          height: "100vh",
          zIndex: 40,
          overflowY: "auto",
          backgroundColor: "var(--color-surface)",
          borderLeft: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
          transition: "transform 200ms ease-in-out",
          pointerEvents: "all",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "24px",
        }}
      >
        {/* Header row: depth label pill + close button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Depth label badge */}
          <span
            style={{
              backgroundColor: "var(--color-surface-raised)",
              color: "var(--color-text-muted)",
              fontSize: "0.7rem",
              borderRadius: "var(--radius-sm)",
              padding: "2px 8px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontFamily: "var(--font-ui)",
              fontWeight: 500,
            }}
          >
            {response.depthLabel}
          </span>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              padding: "4px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <X size={18} weight="thin" />
          </button>
        </div>

        {/* Selected text quote block with left accent border */}
        <blockquote
          style={{
            borderLeft: "2px solid var(--color-accent)",
            paddingLeft: "12px",
            margin: 0,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "var(--color-text-secondary)",
            fontSize: "1rem",
            lineHeight: "1.5",
            // Clamp to 2 lines
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          &ldquo;{selectedText}&rdquo;
        </blockquote>

        {/* AI explanation — preserve newlines for academic reference block */}
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.9rem",
            lineHeight: "1.7",
            color: "var(--color-text-primary)",
            margin: 0,
            whiteSpace: "pre-line",
          }}
        >
          {response.explanation}
        </p>

        {/* Related articles section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--color-text-muted)",
              fontWeight: 500,
            }}
          >
            Artículos relacionados
          </span>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {response.relatedLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={`/article/${link.id}`}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.875rem",
                    color: "var(--color-accent)",
                    textDecoration: "none",
                    transition: "opacity 200ms ease",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.75";
                    (e.currentTarget as HTMLElement).style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                    (e.currentTarget as HTMLElement).style.textDecoration = "none";
                  }}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
