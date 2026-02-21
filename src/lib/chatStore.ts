"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────

export type ChatMode = "minimal" | "drawer" | "sidebar" | "fullscreen";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatStore {
  messages: ChatMessage[];
  chatMode: ChatMode;
  /** The article title currently being discussed (null if no article context). */
  articleContext: string | null;
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setChatMode: (mode: ChatMode) => void;
  setArticleContext: (title: string | null) => void;
  clearMessages: () => void;
}

// ────────────────────────────────────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatStore | null>(null);

// ────────────────────────────────────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "cultx:chat";

function loadPersistedMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // parse failed — start fresh
  }
  return [];
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(loadPersistedMessages);
  const [chatMode, setChatModeState] = useState<ChatMode>("minimal");
  const [articleContext, setArticleContextState] = useState<string | null>(null);

  // Persist messages to localStorage whenever they change (SSR-safe)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage quota exceeded or unavailable — silently ignore
    }
  }, [messages]);

  const addMessage = useCallback((msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...msg,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const setChatMode = useCallback((mode: ChatMode) => {
    setChatModeState(mode);
  }, []);

  const setArticleContext = useCallback((title: string | null) => {
    setArticleContextState(title);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
    }
  }, []);

  const value: ChatStore = {
    messages,
    chatMode,
    articleContext,
    addMessage,
    setChatMode,
    setArticleContext,
    clearMessages,
  };

  return React.createElement(ChatContext.Provider, { value }, children);
}

// ────────────────────────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────────────────────────

export function useChatStore(): ChatStore {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatStore must be used within a <ChatProvider>.");
  }
  return ctx;
}
