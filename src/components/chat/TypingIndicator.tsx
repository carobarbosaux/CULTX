"use client";

// TypingIndicator — Animated three-dot typing bubble shown while AI is generating a response.
//
// Each dot pulses with a staggered opacity animation (0→1→0) using Tailwind's animate-pulse
// class and animationDelay inline style to create a wave effect.
// Container matches the assistant message bubble style for visual consistency.

export function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "10px 14px",
          backgroundColor: "var(--color-surface-raised)",
          borderRadius:
            "var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="animate-pulse"
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--color-text-muted)",
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
