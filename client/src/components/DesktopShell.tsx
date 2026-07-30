import type { ReactNode } from "react";
import { color } from "../theme";

export function DesktopShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: color.bg }}>
      {sidebar}
      <div className="hidebar" style={{ flex: 1, overflowY: "auto", height: "100vh", color: color.cream }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>{children}</div>
      </div>
    </div>
  );
}
