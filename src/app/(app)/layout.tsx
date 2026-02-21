import { AppShell } from "@/components/layout/AppShell";
import { GlobalChatbar } from "@/components/chat/GlobalChatbar";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <AppShell>{children}</AppShell>
      <GlobalChatbar />
      {/* ChatSidebar is position:fixed and renders null when chatMode !== "sidebar" */}
      <ChatSidebar />
    </ChatProvider>
  );
}
