"use client";
import { useState } from "react";
import { ChatTeardrop } from "@phosphor-icons/react";
import { useChatStore } from "@/components/chat/ChatProvider";

interface SendToChatButtonProps {
  articleTitle: string;
}

export function SendToChatButton({ articleTitle }: SendToChatButtonProps) {
  const { setArticleContext, setChatMode } = useChatStore();
  const [showConfirmation, setShowConfirmation] = useState(false);

  function handleClick() {
    // Wire article title into the shared chat store
    setArticleContext(articleTitle);
    // Open the drawer so the user sees the context was applied
    setChatMode("drawer");
    // Show a brief inline confirmation
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  }

  return (
    <div className="mt-12 mb-4 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors duration-[200ms] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-ui)",
        }}
      >
        <ChatTeardrop size={16} weight="thin" />
        Send to chat
      </button>

      {showConfirmation && (
        <p
          role="status"
          aria-live="polite"
          className="text-xs"
          style={{
            fontFamily: "var(--font-ui)",
            color: "var(--color-text-muted)",
          }}
        >
          Article sent to chat
        </p>
      )}
    </div>
  );
}
