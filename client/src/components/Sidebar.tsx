import type { ReactNode } from "react";
import { color, font } from "../theme";
import { TABS, type Tab } from "./tabs";
import type { Gates } from "../types";

export function Sidebar({
  tab,
  onTabChange,
  gates,
  onOpenProfile,
  onOpenNotifs,
  onLogout,
  devPanel,
}: {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  gates: Gates;
  onOpenProfile: () => void;
  onOpenNotifs: () => void;
  onLogout: () => void;
  devPanel?: ReactNode;
}) {
  return (
    <div
      style={{
        width: 252,
        flex: "none",
        display: "flex",
        flexDirection: "column",
        background: color.bg,
        borderRight: "1px solid rgba(245,241,232,0.08)",
        padding: "28px 16px",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        color: color.cream,
      }}
    >
      <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 21, marginBottom: 34, paddingLeft: 8 }}>
        become<span style={{ color: color.gold }}>.</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {TABS.map((t) => {
          const active = tab === t.key;
          const locked = t.lockIdx !== null && gates.locked[t.lockIdx];
          return (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                height: 44,
                padding: "0 12px",
                border: "none",
                borderRadius: 12,
                background: active ? "rgba(195,134,43,0.14)" : "transparent",
                color: active ? color.gold : color.dim,
                cursor: "pointer",
                textAlign: "left",
                position: "relative",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                {t.icon}
              </svg>
              <span style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: 1.5 }}>{t.label}</span>
              {locked && (
                <span style={{ position: "absolute", right: 12, width: 6, height: 6, borderRadius: 99, background: color.faint }} />
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid rgba(245,241,232,0.07)", display: "flex", flexDirection: "column", gap: 3 }}>
        <SidebarLink label="Notifications" onClick={onOpenNotifs}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </SidebarLink>
        <SidebarLink label="Profile" onClick={onOpenProfile}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </SidebarLink>
        <SidebarLink label="Log out" onClick={onLogout}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </SidebarLink>
      </div>

      {devPanel && <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(245,241,232,0.07)" }}>{devPanel}</div>}
    </div>
  );
}

function SidebarLink({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        height: 40,
        padding: "0 12px",
        border: "none",
        borderRadius: 12,
        background: "transparent",
        color: color.dim,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: font.sans,
        fontSize: 13,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
      {label}
    </button>
  );
}
