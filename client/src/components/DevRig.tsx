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
export function DevRig({ onChanged, onDark }: { onChanged: () => void; onDark?: boolean }) {
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

  const labelColor = color.faint;
  const buttonColor = onDark ? color.dim : "#5c564a";
  const buttonBorder = onDark ? "rgba(245,241,232,0.16)" : "rgba(15,14,12,0.25)";
  const noteColor = onDark ? color.faint : "#8a8375";

  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: labelColor, marginBottom: 8, textAlign: onDark ? "left" : "center" }}>
        DEV · FAST-FORWARD
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: onDark ? "flex-start" : "center" }}>
        {PERSONAS.map((p) => (
          <button
            key={p.key}
            onClick={() => pick(p.key)}
            disabled={busy !== null}
            style={{
              minHeight: 34,
              padding: "6px 12px",
              borderRadius: 999,
              border: `1px solid ${buttonBorder}`,
              background: "transparent",
              color: buttonColor,
              fontFamily: font.mono,
              fontSize: 10.5,
              cursor: busy ? "default" : "pointer",
              opacity: busy && busy !== p.key ? 0.5 : 1,
            }}
          >
            {busy === p.key ? "…" : p.label}
          </button>
        ))}
      </div>
      {err && <p style={{ fontSize: 11, color: color.goldHover, textAlign: onDark ? "left" : "center", marginTop: 10 }}>{err}</p>}
      <p style={{ fontSize: 10.5, lineHeight: 1.6, color: noteColor, textAlign: onDark ? "left" : "center", margin: onDark ? "10px 0 0" : "12px 20px 0" }}>
        Rewrites this account's history. Never enable in production.
      </p>
    </div>
  );
}
