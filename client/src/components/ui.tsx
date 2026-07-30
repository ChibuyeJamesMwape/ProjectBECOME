import type { CSSProperties, ReactNode } from "react";
import { color, font } from "../theme";

export function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
export function CheckIcon({ size = 18, stroke = "#0F0E0C" }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
export function LockIcon({ size = 15, stroke = "#6E675A" }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function ScreenHeader({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div
      style={{
        height: 64,
        flex: "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 16px",
        borderBottom: "1px solid rgba(245,241,232,0.06)",
      }}
    >
      <button
        onClick={onBack}
        aria-label="Back"
        style={{
          width: 44,
          height: 44,
          border: "none",
          background: "none",
          color: color.dim,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BackIcon />
      </button>
      <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: 3, color: color.gold }}>{label}</div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: 54,
        border: "none",
        borderRadius: 999,
        background: color.gold,
        color: color.bg,
        fontFamily: font.sans,
        fontWeight: 600,
        fontSize: 15,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Chip({
  label,
  active,
  onClick,
  dashed,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dashed?: boolean;
}) {
  const activeStyle = active
    ? { bg: "rgba(195,134,43,0.18)", bd: "rgba(195,134,43,0.75)", fg: color.goldBright }
    : { bg: color.bgPanel, bd: "rgba(245,241,232,0.12)", fg: color.dim };
  return (
    <button
      onClick={onClick}
      style={{
        minHeight: 44,
        padding: "10px 16px",
        borderRadius: 999,
        border: `1px ${dashed ? "dashed" : "solid"} ${activeStyle.bd}`,
        background: activeStyle.bg,
        color: activeStyle.fg,
        fontFamily: font.sans,
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export function ProgressBar({ pct, height = 5 }: { pct: number; height?: number }) {
  return (
    <div style={{ height, borderRadius: height / 2, background: color.track, overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: height / 2, background: color.gold, width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

export function LockedCard({ title, body, pct, label }: { title: string; body: string; pct: number; label: string }) {
  return (
    <div
      style={{
        background: color.bgPanel,
        border: "1px solid rgba(245,241,232,0.08)",
        borderRadius: 18,
        padding: "26px 22px",
        textAlign: "center",
        marginTop: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LockIcon size={26} />
      </div>
      <h3 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 22, margin: "12px 0 8px" }}>{title}</h3>
      <p style={{ fontSize: 13, lineHeight: 1.65, color: color.dim, margin: "0 0 18px" }}>{body}</p>
      <ProgressBar pct={pct} />
      <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 1, color: color.dimmer, marginTop: 8 }}>{label}</div>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: "12px 16px",
        borderRadius: 14,
        background: "rgba(195,134,43,0.12)",
        border: "1px solid rgba(195,134,43,0.4)",
        color: color.goldHover,
        fontSize: 12.5,
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}

export const inputStyle: CSSProperties = {
  width: "100%",
  height: 50,
  padding: "0 16px",
  background: color.bgPanel,
  border: `1px solid ${color.border}`,
  borderRadius: 14,
  color: color.cream,
  fontFamily: font.sans,
  fontSize: 14,
};

export const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: 96,
  padding: "14px 16px",
  background: color.bgPanel,
  border: `1px solid ${color.border}`,
  borderRadius: 14,
  color: color.cream,
  fontFamily: font.sans,
  fontSize: 13.5,
  lineHeight: 1.6,
  resize: "none",
};
