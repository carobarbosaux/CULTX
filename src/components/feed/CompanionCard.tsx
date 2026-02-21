"use client";
import { useState, useEffect } from "react";
import { X, Sparkle, Headphones, BookOpen } from "@phosphor-icons/react";

const SUGGESTIONS = [
  {
    icon: BookOpen,
    label: "Explore a cultural thread",
    description: "Dive deeper into Architecture and its connections across Mexico.",
    cta: "Start exploring",
  },
  {
    icon: Sparkle,
    label: "Try contextual explore",
    description: "Select any text in an article to get cultural context instantly.",
    cta: "See how it works",
  },
  {
    icon: Headphones,
    label: "Turn this into a 5-min listen",
    description: "Generate an audio summary of any article to read on the go.",
    cta: "Try audio mode",
  },
];

export function CompanionCard() {
  const [dismissed, setDismissed] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("cultx:companion-dismissed") === "true";
    setDismissed(wasDismissed);
    setSuggestionIndex(Math.floor(Math.random() * SUGGESTIONS.length));
    setMounted(true);
  }, []);

  if (!mounted || dismissed) return null;

  const suggestion = SUGGESTIONS[suggestionIndex];
  const Icon = suggestion.icon;

  return (
    <div
      className="relative rounded-lg border p-4 mb-8"
      style={{
        borderColor: "var(--color-sage-300)",
        backgroundColor: "var(--color-washi-100)",
      }}
    >
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem("cultx:companion-dismissed", "true");
          setDismissed(true);
        }}
        aria-label="Dismiss companion suggestion"
        className="absolute top-3 right-3 p-1 rounded transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
        style={{ color: "var(--color-text-muted)" }}
      >
        <X size={14} weight="thin" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
          style={{ backgroundColor: "var(--color-sage-400)", color: "#ffffff" }}
        >
          <Icon size={16} weight="thin" />
        </div>
        <div>
          <p
            className="text-xs font-medium uppercase tracking-widest mb-1"
            style={{ color: "var(--color-accent)", fontFamily: "var(--font-ui)" }}
          >
            Cultural Companion
          </p>
          <p
            className="text-base font-medium"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            {suggestion.label}
          </p>
          <p
            className="text-sm mt-1"
            style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
          >
            {suggestion.description}
          </p>
          <button
            type="button"
            className="text-sm font-medium mt-2 transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            style={{ color: "var(--color-accent)", fontFamily: "var(--font-ui)" }}
          >
            {suggestion.cta} →
          </button>
        </div>
      </div>
    </div>
  );
}
