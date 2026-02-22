"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe } from "@phosphor-icons/react";
import { signIn, signUp } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleMockOAuth(provider: "google" | "apple") {
    const mockEmail = `${provider}_user_${Date.now()}@mock.cultx`;
    const mockName = provider === "google" ? "Google User" : "Apple User";
    signUp(mockEmail, "mock", mockName);
    router.push("/feed");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = signIn(email, password);
      if (user) {
        router.push("/feed");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Wordmark */}
      <Link
        href="/feed"
        className="block text-center text-2xl font-semibold tracking-wide mb-8 hover:opacity-80 transition-opacity"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
      >
        CULTX
      </Link>

      <Card className="p-8">
        <h1
          className="text-3xl font-medium mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          Welcome back
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
          Sign in to continue exploring Mexican culture
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-1"
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t" style={{ borderColor: "var(--color-border)" }} />
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>or</span>
          <div className="flex-1 border-t" style={{ borderColor: "var(--color-border)" }} />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full gap-2"
            onClick={() => handleMockOAuth("google")}
          >
            <Globe size={16} weight="thin" />
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full gap-2"
            onClick={() => handleMockOAuth("apple")}
          >
            <span className="text-base leading-none"></span>
            Continue with Apple
          </Button>
        </div>
      </Card>

      <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-secondary)" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium underline underline-offset-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
