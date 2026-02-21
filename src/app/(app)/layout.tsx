import { AppShell } from "@/components/layout/AppShell";
import { GlobalChatbar } from "@/components/chat/GlobalChatbar";
import { ChatProvider } from "@/components/chat/ChatProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <AppShell>{children}</AppShell>
      <GlobalChatbar />
    </ChatProvider>
  );
}
