"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkle,
  X,
  Download,
  Play,
  Pause,
  SpeakerHigh,
  Headphones,
  ArrowClockwise,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { useChatStore } from "@/components/chat/ChatProvider";
import type { Article } from "@/lib/articles";

// ── Mock summary generator ────────────────────────────────────────────────────
function generateSummary(article: Article): string {
  return `**Resumen inteligente — ${article.title}**\n\n${article.excerpt}\n\nEste artículo explora cómo ${article.subtitle.toLowerCase()} La narrativa se estructura en torno a tres ejes: identidad cultural, tensión entre tradición y modernidad, y el papel de las comunidades locales como agentes de cambio.\n\n**Puntos clave:**\n- El contexto histórico define las decisiones estéticas y políticas del tema.\n- Las voces locales y comunitarias son centrales en la conversación.\n- Existe una tensión productiva entre la preservación del patrimonio y la necesidad de reinvención.\n\n---\n\n*⚠️ Este resumen fue generado con inteligencia artificial y puede contener imprecisiones. Te recomendamos leer el artículo completo para una comprensión profunda del tema.*\n\n*Generado por CULTX · ${new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}*`;
}

// ── Podcast player modal ──────────────────────────────────────────────────────
interface PodcastPlayerProps {
  article: Article;
  onClose: () => void;
}

function PodcastPlayer({ article, onClose }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const MOCK_DURATION = article.readingTime * 60;

  useEffect(() => {
    const t = setTimeout(() => setIsGenerating(false), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isPlaying && !isGenerating) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { setIsPlaying(false); return 100; }
          return p + 100 / MOCK_DURATION;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, isGenerating, MOCK_DURATION]);

  const elapsed = Math.floor((progress / 100) * MOCK_DURATION);
  const remaining = MOCK_DURATION - elapsed;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  function handleDownloadAudio() {
    // Mock: download a tiny placeholder text as .mp3 stand-in
    const blob = new Blob([`CULTX Podcast — ${article.title}\n[audio generado por IA]`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `podcast-${article.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const iconBtn: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer",
    color: "var(--color-text-muted)", padding: "6px",
    display: "flex", borderRadius: "50%",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "88px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        width: "min(480px, calc(100vw - 32px))",
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.16)",
        overflow: "hidden",
        fontFamily: "var(--font-ui)",
        transition: "height 200ms ease",
      }}
      role="dialog"
      aria-label="Reproductor de podcast"
    >
      {/* Header — always visible */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: isCollapsed ? "none" : "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
          <Headphones size={15} style={{ color: "var(--color-accent)", flexShrink: 0 }} weight="fill" />
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-primary)", textTransform: "uppercase", letterSpacing: "0.07em", flexShrink: 0 }}>
            Podcast
          </span>
          {/* Mini playback indicator when collapsed */}
          {isCollapsed && !isGenerating && (
            <span style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginLeft: "4px" }}>
              — {article.title}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
          {/* Collapse / expand */}
          <button
            type="button"
            onClick={() => setIsCollapsed((v) => !v)}
            aria-label={isCollapsed ? "Expandir reproductor" : "Colapsar reproductor"}
            style={{ ...iconBtn, padding: "4px" }}
          >
            {isCollapsed ? <CaretUp size={14} weight="thin" /> : <CaretDown size={14} weight="thin" />}
          </button>

          {/* Download audio */}
          {!isGenerating && (
            <button type="button" onClick={handleDownloadAudio} aria-label="Descargar podcast" title="Descargar audio" style={{ ...iconBtn, padding: "4px" }}>
              <Download size={14} weight="thin" />
            </button>
          )}

          {/* Close */}
          <button type="button" onClick={onClose} aria-label="Cerrar reproductor" style={{ ...iconBtn, padding: "4px" }}>
            <X size={15} weight="thin" />
          </button>
        </div>
      </div>

      {/* Body — hidden when collapsed */}
      {!isCollapsed && (
        <div style={{ padding: "16px 20px 20px" }}>
          <p style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)", margin: "0 0 3px" }}>CULTX · Cultura Mexicana</p>
          <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.3, margin: "0 0 18px" }}>
            {article.title}
          </p>

          {isGenerating ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "12px 0 8px" }}>
              <div style={{ display: "flex", gap: "5px", alignItems: "flex-end", height: "32px" }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ width: "4px", borderRadius: "2px", backgroundColor: "var(--color-accent)", animationName: "pulse-bar", animationDuration: "1s", animationTimingFunction: "ease-in-out", animationDelay: `${i * 0.15}s`, animationIterationCount: "infinite", animationDirection: "alternate", height: `${10 + i * 5}px`, opacity: 0.75 }} />
                ))}
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", margin: 0 }}>Generando audio…</p>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div style={{ marginBottom: "14px" }}>
                <div
                  style={{ height: "4px", borderRadius: "2px", backgroundColor: "var(--color-surface-raised)", cursor: "pointer", overflow: "hidden" }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setProgress(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
                  }}
                >
                  <div style={{ height: "100%", width: `${progress}%`, backgroundColor: "var(--color-accent)", borderRadius: "2px", transition: "width 0.8s linear" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                  <span style={{ fontSize: "0.68rem", color: "var(--color-text-secondary)" }}>{fmt(elapsed)}</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--color-text-secondary)" }}>−{fmt(remaining)}</span>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                <button type="button" onClick={() => { setProgress(0); setIsPlaying(false); }} aria-label="Reiniciar" style={iconBtn}>
                  <ArrowClockwise size={20} weight="thin" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((v) => !v)}
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                  style={{ width: "50px", height: "50px", borderRadius: "50%", border: "none", backgroundColor: "var(--color-accent)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  {isPlaying ? <Pause size={22} weight="fill" /> : <Play size={22} weight="fill" />}
                </button>
                <button type="button" aria-label="Volumen" style={iconBtn}>
                  <SpeakerHigh size={20} weight="thin" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Collapsed mini-controls: show play/pause inline when not generating */}
      {isCollapsed && !isGenerating && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 16px 12px", gap: "12px" }}>
          <div style={{ flex: 1, height: "3px", borderRadius: "2px", backgroundColor: "var(--color-surface-raised)", overflow: "hidden", cursor: "pointer" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
            }}
          >
            <div style={{ height: "100%", width: `${progress}%`, backgroundColor: "var(--color-accent)", borderRadius: "2px", transition: "width 0.8s linear" }} />
          </div>
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
            style={{ width: "28px", height: "28px", borderRadius: "50%", border: "none", backgroundColor: "var(--color-accent)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            {isPlaying ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main toolbar ──────────────────────────────────────────────────────────────
interface ArticleToolbarProps {
  article: Article;
}

export function ArticleToolbar({ article }: ArticleToolbarProps) {
  const { addMessage, setArticleContext, setChatMode } = useChatStore();
  const [showPodcast, setShowPodcast] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  async function handleSummary() {
    if (summaryLoading) return;
    setSummaryLoading(true);
    setArticleContext(article.title);
    setChatMode("sidebar");
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 400));
    addMessage({ role: "assistant", content: generateSummary(article) });
    setSummaryLoading(false);
  }

  function handleDownloadSummary() {
    const text = generateSummary(article).replace(/\*\*/g, "").replace(/\*/g, "").replace(/---/g, "---");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resumen-${article.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const ghostBtn: React.CSSProperties = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-ui)",
    color: "var(--color-text-secondary)",
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-1 py-3 border-y" style={{ borderColor: "var(--color-border)" }}>

          {/* Convertir en podcast */}
          <button
            type="button"
            onClick={() => setShowPodcast((v) => !v)}
            aria-label="Convertir artículo en podcast"
            aria-expanded={showPodcast}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            style={{
              ...ghostBtn,
              backgroundColor: showPodcast ? "var(--color-surface-raised)" : "transparent",
              color: showPodcast ? "var(--color-accent)" : "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => { if (!showPodcast) { e.currentTarget.style.backgroundColor = "var(--color-surface-raised)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}}
            onMouseLeave={(e) => { if (!showPodcast) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}}
          >
            <Headphones size={16} weight={showPodcast ? "fill" : "thin"} />
            Convertir en podcast
          </button>

          <span className="h-4 w-px" aria-hidden="true" style={{ backgroundColor: "var(--color-border)" }} />

          {/* Resumen inteligente */}
          <button
            type="button"
            onClick={handleSummary}
            disabled={summaryLoading}
            aria-label="Generar resumen inteligente con IA"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            style={{ ...ghostBtn, opacity: summaryLoading ? 0.6 : 1, cursor: summaryLoading ? "default" : "pointer" }}
            onMouseEnter={(e) => { if (!summaryLoading) { e.currentTarget.style.backgroundColor = "var(--color-surface-raised)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
          >
            <Sparkle size={16} weight={summaryLoading ? "fill" : "thin"} />
            {summaryLoading ? "Generando…" : "Resumen inteligente"}
          </button>

          {/* Download summary shortcut */}
          <button
            type="button"
            onClick={handleDownloadSummary}
            aria-label="Descargar resumen"
            title="Descargar resumen como texto"
            className="ml-auto flex items-center rounded-md p-1.5 transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            style={ghostBtn}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-surface-raised)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
          >
            <Download size={15} weight="thin" />
          </button>
        </div>
      </div>

      {showPodcast && <PodcastPlayer article={article} onClose={() => setShowPodcast(false)} />}

      <style>{`@keyframes pulse-bar { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
    </>
  );
}
