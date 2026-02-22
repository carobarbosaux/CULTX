"use client";

/**
 * CulturalCompanionOnboardingModal
 * ---------------------------------------------------------------------------
 * Short editorial onboarding modal explaining the AI Companion features.
 *
 * HOW TO EDIT STEPS:
 *   Edit the STEPS array below. Each step has: id, icon, title, body, and
 *   an optional action ({ label, handler }) that renders a "Try it" button.
 *
 * HOW TO BUMP THE VERSION KEY:
 *   Change STORAGE_KEY_SEEN and STORAGE_KEY_DONT_SHOW to a new version suffix
 *   (e.g., "v2") to reset the "seen" state for all users on next deploy.
 *
 * CONTEXT AWARENESS:
 *   Pass `articleId` when rendering from an article page. When set, "Try"
 *   actions call article-level handlers directly. When absent (feed page),
 *   they route the user to an example article first.
 */

import { useEffect, useRef, useCallback, useState } from "react";
import {
  X,
  ChatTeardrop,
  Sparkle,
  Headphones,
  TextAa,
  ArrowRight,
  ArrowLeft,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

// ── localStorage keys — bump suffix to reset seen state for all users ─────────
const STORAGE_KEY_SEEN = "cultx_companion_onboarding_v1_seen";
const STORAGE_KEY_DONT_SHOW = "cultx_companion_onboarding_v1_dont_show";

// ── Step definitions ──────────────────────────────────────────────────────────
interface Step {
  id: string;
  Icon: Icon;
  title: string;
  body: string;
}

// Edit these steps freely. Keep to 3–5 for best readability.
const STEPS: Step[] = [
  {
    id: "chat",
    Icon: ChatTeardrop,
    title: "Ask anything",
    body: "Use the chat bar at the bottom to explore CULTX topics as you read. Ask follow-up questions, request context, or dive into any cultural thread.",
  },
  {
    id: "summary",
    Icon: Sparkle,
    title: "Get the gist",
    body: "Generate an AI summary of any article in seconds. Great for scanning before committing to a full read.",
  },
  {
    id: "podcast",
    Icon: Headphones,
    title: "Listen in minutes",
    body: "Turn any article into a short podcast. Perfect for when you want culture on the go without staring at a screen.",
  },
  {
    id: "highlight",
    Icon: TextAa,
    title: "Highlight to explore",
    body: "Select any passage in an article and ask about that exact fragment. The companion zooms in and starts a focused conversation.",
  },
  {
    id: "account",
    Icon: UserCircle,
    title: "More with an account",
    body: "Signed-in readers get deeper AI responses, saved conversations, personalised feeds, and the full podcast experience. Free to join.",
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
export interface CulturalCompanionOnboardingModalProps {
  /** Called when the modal should close. */
  onClose: () => void;
}

export function CulturalCompanionOnboardingModal({
  onClose,
}: CulturalCompanionOnboardingModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [dontShow, setDontShow] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);


  // Mark as seen on mount
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SEEN, "true");
  }, []);

  // Focus the close button on open (focus trap entry point)
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // ESC to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
      // Tab focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dontShow]);

  const handleClose = useCallback(() => {
    if (dontShow) {
      localStorage.setItem(STORAGE_KEY_DONT_SHOW, "true");
    }
    onClose();
  }, [dontShow, onClose]);

  // Click outside overlay
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) handleClose();
  }

  const step = STEPS[activeStep];
  const StepIcon = step.Icon;
  const isLast = activeStep === STEPS.length - 1;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(46, 42, 38, 0.45)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="companion-modal-title"
        aria-describedby="companion-modal-body"
        data-companion-dialog
        style={{
          position: "relative",
          width: "min(520px, 100%)",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          fontFamily: "var(--font-ui)",
          overflow: "hidden",
        }}
      >
        {/* ── Close button ───────────────────────────────────────────────────── */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          aria-label="Close Cultural Companion guide"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-muted)",
            padding: "6px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-surface-raised)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <X size={16} weight="thin" />
        </button>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: "28px 28px 20px",
            borderBottom: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface-raised)",
          }}
        >
          <p
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-accent)",
              margin: "0 0 6px",
            }}
          >
            Cultural Companion
          </p>
          <h2
            id="companion-modal-title"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              lineHeight: 1.25,
              margin: "0 0 4px",
            }}
          >
            Go deeper.
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--color-text-secondary)",
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            Ask questions, get a quick summary, or listen on the go.
          </p>
        </div>

        {/* ── Step nav tabs ──────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--color-border)",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
          role="tablist"
          aria-label="Companion features"
        >
          {STEPS.map((s, i) => {
            const TabIcon = s.Icon;
            const isActive = i === activeStep;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`companion-step-panel-${s.id}`}
                onClick={() => setActiveStep(i)}
                style={{
                  flex: "1 1 0",
                  minWidth: "80px",
                  padding: "12px 8px",
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid var(--color-accent)" : "2px solid transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "5px",
                  color: isActive ? "var(--color-accent)" : "var(--color-text-muted)",
                  transition: "color 150ms ease, border-color 150ms ease",
                  fontFamily: "var(--font-ui)",
                  marginBottom: "-1px",
                }}
              >
                <TabIcon size={18} weight={isActive ? "fill" : "thin"} />
                <span style={{ fontSize: "0.65rem", fontWeight: 500, lineHeight: 1.2, textAlign: "center" }}>
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Active step body ───────────────────────────────────────────────── */}
        <div
          id={`companion-step-panel-${step.id}`}
          role="tabpanel"
          aria-labelledby={`companion-tab-${step.id}`}
          style={{ padding: "24px 28px 8px" }}
        >
          {/* Step icon + title */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "14px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                flexShrink: 0,
                borderRadius: "10px",
                backgroundColor: "color-mix(in srgb, var(--color-accent) 12%, var(--color-surface))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StepIcon size={20} weight="thin" style={{ color: "var(--color-accent)" }} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  margin: "0 0 6px",
                  lineHeight: 1.3,
                }}
              >
                {step.title}
              </h3>
              <p
                id="companion-modal-body"
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {step.body}
              </p>
            </div>
          </div>

          {/* Context hint shown on the highlight step */}
          {step.id === "highlight" && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--color-text-muted)",
                fontStyle: "italic",
                padding: "8px 12px",
                borderLeft: "2px solid var(--color-border)",
                margin: "0 0 4px",
                lineHeight: 1.5,
              }}
            >
              Open any article and highlight a sentence to try this.
            </p>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div style={{ padding: "16px 28px 24px" }}>
          {/* Step dots */}
          <div
            style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "20px" }}
            aria-label={`Step ${activeStep + 1} of ${STEPS.length}`}
          >
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveStep(i)}
                aria-label={`Go to step ${i + 1}`}
                style={{
                  width: i === activeStep ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: i === activeStep ? "var(--color-accent)" : "var(--color-border)",
                  padding: 0,
                  transition: "width 200ms ease, background-color 200ms ease",
                }}
              />
            ))}
          </div>

          {/* Navigation: Back + Next/Get started */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Back — ghost, hidden on first step */}
            {activeStep > 0 && (
              <button
                type="button"
                onClick={() => setActiveStep((s) => s - 1)}
                aria-label="Previous step"
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "background-color 150ms ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-surface-raised)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <ArrowLeft size={14} weight="bold" />
                Back
              </button>
            )}

            {/* Next (primary) / Get started (account step) / Close (last non-account) */}
            <button
              type="button"
              onClick={() => {
                if (isLast && step.id === "account") {
                  handleClose();
                  window.location.href = "/signup";
                } else if (isLast) {
                  handleClose();
                } else {
                  setActiveStep((s) => s + 1);
                }
              }}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "var(--color-accent)",
                color: "#ffffff",
                fontFamily: "var(--font-ui)",
                fontSize: "0.88rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "background-color 150ms ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-accent-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--color-accent)"; }}
            >
              {isLast && step.id === "account" ? "Create a free account" : isLast ? "Done" : "Next"}
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>

          {/* "Don't show again" + "Not now" row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "14px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                cursor: "pointer",
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
                style={{ accentColor: "var(--color-accent)", width: "13px", height: "13px" }}
              />
              Don't show again
            </label>

            <button
              type="button"
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-ui)",
                padding: 0,
                textDecoration: "underline",
                textDecorationColor: "transparent",
                transition: "text-decoration-color 150ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecorationColor = "var(--color-text-muted)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecorationColor = "transparent"; }}
            >
              Not now
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile bottom-sheet override ───────────────────────────────────────── */}
      <style>{`
        @media (max-width: 600px) {
          [data-companion-dialog=""] {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            border-radius: 16px 16px 0 0 !important;
            max-height: 92dvh !important;
            overflow-y: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Utility: check if modal should auto-show (not used by default) ─────────────
export function shouldShowCompanionOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY_DONT_SHOW) !== "true";
}
