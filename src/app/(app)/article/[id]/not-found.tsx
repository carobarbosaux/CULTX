import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ArticleNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p
        className="text-xs uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-muted)" }}
      >
        Article not found
      </p>
      <h1
        className="text-3xl font-semibold mb-3"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
      >
        This article doesn't exist
      </h1>
      <p
        className="text-base mb-8 max-w-sm"
        style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
      >
        It may have been moved or the link may be incorrect.
      </p>
      <Link href="/feed">
        <Button variant="secondary" size="md">Back to home</Button>
      </Link>
    </div>
  );
}
