import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";

export function ArticleNav() {
  return (
    <nav className="mb-10">
      <Link
        href="/feed"
        className="inline-flex items-center gap-1.5 transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
        style={{ color: "var(--color-text-muted)" }}
        aria-label="Volver al inicio"
      >
        <CaretLeft size={14} weight="thin" />
        <span
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          Inicio
        </span>
      </Link>
    </nav>
  );
}
