"use client";
import { useState, useEffect } from "react";
import { Headphones, InstagramLogo, X } from "@phosphor-icons/react";

type NoticeKey = "listen" | "instagram" | null;

const NOTICES: Record<NonNullable<NoticeKey>, string> = {
  listen: "El modo audio estará disponible en la versión completa.",
  instagram: "El resumen para Instagram estará disponible en la versión completa.",
};

export function ArticleToolbar() {
  const [activeNotice, setActiveNotice] = useState<NoticeKey>(null);

  useEffect(() => {
    if (!activeNotice) return;
    const timer = setTimeout(() => setActiveNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [activeNotice]);

  return (
    <div className="mb-8">
      <div
        className="flex items-center gap-3 py-3 border-y"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          type="button"
          onClick={() => setActiveNotice("listen")}
          aria-label="Escuchar artículo en audio"
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
          style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-surface-raised)";
            e.currentTarget.style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--color-text-secondary)";
          }}
        >
          <Headphones size={16} weight="thin" />
          Escuchar
        </button>

        <span
          className="h-4 w-px"
          aria-hidden="true"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        <button
          type="button"
          onClick={() => setActiveNotice("instagram")}
          aria-label="Generar resumen para Instagram"
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
          style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-surface-raised)";
            e.currentTarget.style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--color-text-secondary)";
          }}
        >
          <InstagramLogo size={16} weight="thin" />
          Resumen
        </button>
      </div>

      {activeNotice && (
        <div
          className="flex items-center justify-between gap-3 mt-2 px-3 py-2 rounded-md text-sm"
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            fontFamily: "var(--font-ui)",
            color: "var(--color-text-secondary)",
          }}
        >
          <span>{NOTICES[activeNotice]}</span>
          <button
            type="button"
            onClick={() => setActiveNotice(null)}
            aria-label="Cerrar aviso"
            className="flex-shrink-0 p-0.5 rounded transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X size={14} weight="thin" />
          </button>
        </div>
      )}
    </div>
  );
}
