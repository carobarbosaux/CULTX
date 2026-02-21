"use client";
// Thin re-export so the server-component layout.tsx can import ChatProvider
// without being converted to a client component.
export { ChatProvider, useChatStore } from "@/lib/chatStore";
