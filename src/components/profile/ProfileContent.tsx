"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  BookOpen,
  Bell,
  Brain,
  SignOut,
  PencilSimple,
  Check,
  X,
} from "@phosphor-icons/react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { InterestChip } from "@/components/onboarding/InterestChip";
import { Button } from "@/components/ui/Button";
import {
  CULTURAL_INTERESTS,
  PROFILE_TYPES,
  REGIONS,
  EXPLORATION_MODES,
} from "@/lib/constants";
import type { UserProfile } from "@/lib/types";

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  icon,
  title,
  children,
  onEdit,
  editing,
  onSave,
  onCancel,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
  editing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--color-accent)" }}>{icon}</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            {title}
          </h2>
        </div>
        {onEdit && !editing && (
          <button
            onClick={onEdit}
            aria-label={`Edit ${title}`}
            className="flex items-center gap-1 text-sm transition-colors duration-200"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "var(--color-accent)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "var(--color-text-muted)")
            }
          >
            <PencilSimple size={14} weight="thin" />
            Edit
          </button>
        )}
        {editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              aria-label="Cancel"
              className="flex items-center gap-1 text-sm transition-colors duration-200"
              style={{ color: "var(--color-text-muted)" }}
            >
              <X size={14} weight="thin" />
              Cancel
            </button>
            <Button size="sm" onClick={onSave} className="gap-1">
              <Check size={14} weight="thin" />
              Save
            </Button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Pill display ─────────────────────────────────────────────────────────────
function Pill({ label }: { label: string }) {
  return (
    <span
      className="text-sm px-3 py-1 rounded-full"
      style={{
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-secondary)",
        fontFamily: "var(--font-ui)",
      }}
    >
      {label}
    </span>
  );
}

// ── Option picker (single-select) ─────────────────────────────────────────────
function OptionPicker<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
          className="text-sm px-4 py-2 rounded-full border transition-all duration-200"
          style={
            value === opt
              ? {
                  background: "var(--color-accent)",
                  borderColor: "var(--color-accent)",
                  color: "#fff",
                  fontFamily: "var(--font-ui)",
                }
              : {
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-ui)",
                }
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
      style={{ background: checked ? "var(--color-accent)" : "var(--color-border)" }}
    >
      <span
        className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200"
        style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ProfileContent() {
  const { profile, isLoading, update } = useProfile();
  const { signOut } = useAuth();
  const router = useRouter();

  // Which section is being edited
  const [editing, setEditing] = useState<string | null>(null);

  // Draft state per section
  const [draftInterests, setDraftInterests] = useState<string[]>([]);
  const [draftProfileType, setDraftProfileType] = useState<UserProfile["profileType"]>(null);
  const [draftRegion, setDraftRegion] = useState<UserProfile["region"]>(null);
  const [draftExploration, setDraftExploration] = useState<UserProfile["explorationMode"]>(null);
  const [draftAiDepth, setDraftAiDepth] = useState<"standard" | "academic">("standard");
  const [draftNewsletter, setDraftNewsletter] = useState<UserProfile["newsletter"]>({
    enabled: false,
    frequency: "weekly",
  });

  const startEdit = (section: string) => {
    if (!profile) return;
    if (section === "interests") setDraftInterests([...profile.interests]);
    if (section === "identity") {
      setDraftProfileType(profile.profileType);
      setDraftRegion(profile.region);
      setDraftExploration(profile.explorationMode);
    }
    if (section === "ai") setDraftAiDepth(profile.aiDepth);
    if (section === "newsletter") setDraftNewsletter({ ...profile.newsletter });
    setEditing(section);
  };

  const cancelEdit = () => setEditing(null);

  const saveInterests = () => {
    update({ interests: draftInterests });
    setEditing(null);
  };

  const saveIdentity = () => {
    update({
      profileType: draftProfileType,
      region: draftRegion,
      explorationMode: draftExploration,
    });
    setEditing(null);
  };

  const saveAi = () => {
    update({ aiDepth: draftAiDepth });
    setEditing(null);
  };

  const saveNewsletter = () => {
    update({ newsletter: draftNewsletter });
    setEditing(null);
  };

  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  const toggleInterest = (label: string) => {
    setDraftInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <span style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-ui)" }}>
          Loading…
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <p style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-ui)" }}>
          You need to be logged in to view your profile.
        </p>
        <Button onClick={() => router.push("/login")}>Sign in</Button>
      </div>
    );
  }

  const initials = profile.displayName
    ? profile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : profile.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      className="mx-auto max-w-2xl px-4 py-10 pb-32"
      style={{ fontFamily: "var(--font-ui)" }}
    >
      {/* ── Avatar + name ── */}
      <div className="flex items-center gap-5 mb-8">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full text-xl font-semibold text-white flex-shrink-0"
          style={{ background: "var(--color-accent)" }}
        >
          {initials}
        </div>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              lineHeight: 1.2,
            }}
          >
            {profile.displayName ?? profile.email}
          </h1>
          {profile.displayName && (
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
              {profile.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* ── Interests ── */}
        <Section
          icon={<BookOpen size={18} weight="thin" />}
          title="Interests"
          onEdit={() => startEdit("interests")}
          editing={editing === "interests"}
          onSave={saveInterests}
          onCancel={cancelEdit}
        >
          {editing === "interests" ? (
            <div className="flex flex-wrap gap-2">
              {CULTURAL_INTERESTS.map((interest) => (
                <InterestChip
                  key={interest}
                  label={interest}
                  selected={draftInterests.includes(interest)}
                  onToggle={toggleInterest}
                />
              ))}
            </div>
          ) : profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <Pill key={i} label={i} />
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
              No interests selected yet.
            </p>
          )}
        </Section>

        {/* ── Identity ── */}
        <Section
          icon={<User size={18} weight="thin" />}
          title="Profile &amp; Region"
          onEdit={() => startEdit("identity")}
          editing={editing === "identity"}
          onSave={saveIdentity}
          onCancel={cancelEdit}
        >
          {editing === "identity" ? (
            <div className="flex flex-col gap-5">
              <div>
                <p
                  className="mb-2 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Profile type
                </p>
                <OptionPicker
                  options={PROFILE_TYPES}
                  value={draftProfileType}
                  onChange={setDraftProfileType}
                />
              </div>
              <div>
                <p
                  className="mb-2 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Region
                </p>
                <OptionPicker
                  options={REGIONS}
                  value={draftRegion}
                  onChange={setDraftRegion}
                />
              </div>
              <div>
                <p
                  className="mb-2 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Exploration mode
                </p>
                <OptionPicker
                  options={EXPLORATION_MODES}
                  value={draftExploration}
                  onChange={setDraftExploration}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", width: "110px" }}>
                  Profile type
                </span>
                <Pill label={profile.profileType ?? "—"} />
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", width: "110px" }}>
                  Region
                </span>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} weight="thin" style={{ color: "var(--color-text-muted)" }} />
                  <Pill label={profile.region ?? "—"} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", width: "110px" }}>
                  Exploration
                </span>
                <Pill label={profile.explorationMode ?? "—"} />
              </div>
            </div>
          )}
        </Section>

        {/* ── AI Depth ── */}
        <Section
          icon={<Brain size={18} weight="thin" />}
          title="AI Depth"
          onEdit={() => startEdit("ai")}
          editing={editing === "ai"}
          onSave={saveAi}
          onCancel={cancelEdit}
        >
          {editing === "ai" ? (
            <div className="flex flex-col gap-3">
              <OptionPicker
                options={["standard", "academic"] as const}
                value={draftAiDepth}
                onChange={setDraftAiDepth}
              />
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                Academic mode adds citations and deeper cultural context to AI responses.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: "var(--color-text-primary)", fontSize: "0.9rem" }}>
                  {profile.aiDepth === "academic" ? "Academic mode" : "Standard mode"}
                </p>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>
                  {profile.aiDepth === "academic"
                    ? "Detailed responses with references and citations"
                    : "Concise, clear responses for general reading"}
                </p>
              </div>
              <Pill label={profile.aiDepth} />
            </div>
          )}
        </Section>

        {/* ── Newsletter ── */}
        <Section
          icon={<Bell size={18} weight="thin" />}
          title="Newsletter"
          onEdit={() => startEdit("newsletter")}
          editing={editing === "newsletter"}
          onSave={saveNewsletter}
          onCancel={cancelEdit}
        >
          {editing === "newsletter" ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--color-text-primary)", fontSize: "0.9rem" }}>
                  Weekly cultural brief
                </span>
                <Toggle
                  checked={draftNewsletter.enabled}
                  onChange={(v) =>
                    setDraftNewsletter((prev) => ({ ...prev, enabled: v }))
                  }
                  label="Toggle newsletter"
                />
              </div>
              {draftNewsletter.enabled && (
                <div>
                  <p
                    className="mb-2 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Frequency
                  </p>
                  <OptionPicker
                    options={["weekly", "biweekly"] as const}
                    value={draftNewsletter.frequency}
                    onChange={(v) =>
                      setDraftNewsletter((prev) => ({ ...prev, frequency: v }))
                    }
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: "var(--color-text-primary)", fontSize: "0.9rem" }}>
                  {profile.newsletter.enabled ? "Subscribed" : "Not subscribed"}
                </p>
                {profile.newsletter.enabled && (
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>
                    {profile.newsletter.frequency === "weekly" ? "Every week" : "Every two weeks"}
                  </p>
                )}
              </div>
              <Toggle
                checked={profile.newsletter.enabled}
                onChange={(v) => update({ newsletter: { ...profile.newsletter, enabled: v } })}
                label="Toggle newsletter subscription"
              />
            </div>
          )}
        </Section>

        {/* ── Sign out ── */}
        <div className="pt-2">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="gap-2 w-full justify-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            <SignOut size={16} weight="thin" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
