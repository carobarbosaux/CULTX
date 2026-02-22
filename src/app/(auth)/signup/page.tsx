"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe } from "@phosphor-icons/react";
import { signUp } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      signUp(email, password, username.trim());
      router.push("/interests");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleMockOAuth(provider: "google" | "apple") {
    // Mock OAuth: create a session with a fake email and redirect to onboarding
    const mockEmail = `${provider}_user_${Date.now()}@mock.cultx`;
    const mockName = provider === "google" ? "Google User" : "Apple User";
    signUp(mockEmail, "mock", mockName);
    router.push("/interests");
  }

  return (
    <div className="w-full max-w-sm">
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
          Join CULTX
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
          Create your account and start exploring
        </p>

        {/* Social sign-in (mock) */}
        <div className="flex flex-col gap-2 mb-5">
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

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t" style={{ borderColor: "var(--color-border)" }} />
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>or</span>
          <div className="flex-1 border-t" style={{ borderColor: "var(--color-border)" }} />
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
              autoComplete="new-password"
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
            {isLoading ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-secondary)" }}>
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
