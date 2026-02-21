import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ArticleNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p
        className="text-xs uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-muted)" }}
      >
        Artículo no encontrado
      </p>
      <h1
        className="text-3xl font-semibold mb-3"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
      >
        Este artículo no existe
      </h1>
      <p
        className="text-base mb-8 max-w-sm"
        style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-secondary)" }}
      >
        Puede que haya sido movido o que el enlace sea incorrecto.
      </p>
      <Link href="/feed">
        <Button variant="secondary" size="md">Volver al inicio</Button>
      </Link>
    </div>
  );
}
