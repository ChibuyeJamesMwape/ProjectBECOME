import { useState, type ReactNode } from "react";
import { color, font } from "../theme";
import { BottomNav, type Tab } from "../components/BottomNav";
import { Path } from "./main/Path";
import { Journal } from "./main/Journal";
import { Actions } from "./main/Actions";
import { Data } from "./main/Data";
import { Circle } from "./main/Circle";
import type { Gates } from "../types";

export function MainScreen({
  firstName,
  gates,
  onOpenExposure,
  onOpenNotifs,
  onOpenProfile,
  onRefreshGates,
}: {
  firstName: string;
  gates: Gates;
  onOpenExposure: () => void;
  onOpenNotifs: () => void;
  onOpenProfile: () => void;
  onRefreshGates: () => void;
}) {
  const [tab, setTab] = useState<Tab>("path");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ height: 64, flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", borderBottom: "1px solid rgba(245,241,232,0.06)" }}>
        <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 20 }}>
          become<span style={{ color: color.gold }}>.</span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          <IconButton label="Notifications" onClick={onOpenNotifs}>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </IconButton>
          <IconButton label="Profile" onClick={onOpenProfile}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </IconButton>
        </div>
      </div>

      <div className="hidebar" style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {tab === "path" && (
          <Path firstName={firstName} gates={gates} onOpenExposure={onOpenExposure} onOpenTab={setTab} />
        )}
        {tab === "journal" && <Journal gates={gates} onChanged={onRefreshGates} />}
        {tab === "actions" && <Actions gates={gates} onChanged={onRefreshGates} />}
        {tab === "data" && <Data gates={gates} />}
        {tab === "circle" && <Circle gates={gates} />}
      </div>

      <BottomNav tab={tab} onChange={setTab} gates={gates} />
    </div>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{ width: 44, height: 44, border: "none", background: "none", color: color.dim, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}
