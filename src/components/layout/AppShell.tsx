"use client";

// AppShell is a client component so it can read chatMode from chatStore
// and shift the main content area right when the sidebar is open.
import { Navbar } from "./Navbar";
import { useChatStore } from "@/components/chat/ChatProvider";

interface AppShellProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function AppShell({ children, showNav = true }: AppShellProps) {
  const { chatMode } = useChatStore();

  // Push content left to avoid being hidden behind the sidebar/fullscreen panel
  const mainPaddingRight =
    chatMode === "fullscreen" ? "min(720px, 100vw)" :
    chatMode === "sidebar" ? "380px" : undefined;

  return (
    <div
      className="min-h-screen bg-[var(--color-bg)]"
      style={{ paddingRight: mainPaddingRight, transition: "padding-right 0.2s" }}
    >
      {showNav && <Navbar />}
      <main className="pb-24">{children}</main>
    </div>
  );
}
