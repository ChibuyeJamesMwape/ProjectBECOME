import { useState } from "react";
import { color, font } from "../theme";
import { api, ApiError } from "../api";

const PERSONAS: { key: string; label: string }[] = [
  { key: "first", label: "First session" },
  { key: "day5", label: "Day 5" },
  { key: "day21", label: "Day 21" },
  { key: "day45", label: "Day 45" },
  { key: "rep", label: "Replication" },
];

// Dev-only fast-forward panel: jumps the logged-in test account through the
// formation cycle so gated stages can be reviewed without waiting real days.
// The backend 404s this route unless ENABLE_DEV_TOOLS=true, and Vite strips
// this component from production builds (import.meta.env.DEV).
export function DevRig({ onChanged }: { onChanged: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");

  async function pick(key: string) {
    setBusy(key);
    setErr("");
    try {
      await api.devPersona(key);
      onChanged();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Dev tools unavailable.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ width: 390, maxWidth: "100%" }}>
      <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.faint, marginBottom: 8, textAlign: "center" }}>
        DEV · FAST-FORWARD THIS TEST ACCOUNT
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {PERSONAS.map((p) => (
          <button
            key={p.key}
            onClick={() => pick(p.key)}
            disabled={busy !== null}
            style={{
              minHeight: 40,
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid rgba(15,14,12,0.25)",
              background: "transparent",
              color: "#5c564a",
              fontFamily: font.mono,
              fontSize: 11,
              cursor: busy ? "default" : "pointer",
              opacity: busy && busy !== p.key ? 0.5 : 1,
            }}
          >
            {busy === p.key ? "…" : p.label}
          </button>
        ))}
      </div>
      {err && <p style={{ fontSize: 11, color: color.goldHover, textAlign: "center", marginTop: 10 }}>{err}</p>}
      <p style={{ fontSize: 11, lineHeight: 1.6, color: "#8a8375", textAlign: "center", margin: "12px 20px 0" }}>
        Rewrites this account's exposure audit, journal, and action history to match the chosen moment in the journey.
        Never enable ENABLE_DEV_TOOLS in production.
      </p>
    </div>
  );
}
