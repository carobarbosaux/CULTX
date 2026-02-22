"use client";
import { useState } from "react";
import { Envelope } from "@phosphor-icons/react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section
      className="mt-16 rounded-2xl px-8 py-10 text-center"
      style={{ backgroundColor: "var(--color-surface-raised)" }}
      aria-label="Newsletter subscription"
    >
      <Envelope
        size={28}
        weight="thin"
        className="mx-auto mb-4"
        style={{ color: "var(--color-accent)" }}
      />

      {submitted ? (
        <>
          <h2
            className="text-2xl mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-primary)",
            }}
          >
            Thanks for subscribing!
          </h2>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-muted)",
            }}
          >
            You'll receive the next cultural brief every week.
          </p>
        </>
      ) : (
        <>
          <h2
            className="text-2xl mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-primary)",
            }}
          >
            The weekly cultural brief
          </h2>
          <p
            className="text-sm mb-6 max-w-xs mx-auto"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-secondary)",
            }}
          >
            Editorial picks, cultural threads, and a question to reflect on. Every week.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="flex-1 rounded-lg border px-4 py-2.5 text-sm focus:outline-none transition-[border-color] duration-[200ms]"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-ui)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            />
            <button
              type="submit"
              className="rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-[200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#ffffff",
                fontFamily: "var(--font-ui)",
              }}
            >
              Subscribe
            </button>
          </form>
          <p
            className="mt-3 text-xs"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-muted)",
            }}
          >
            No spam. Cancel anytime.
          </p>
        </>
      )}
    </section>
  );
}
