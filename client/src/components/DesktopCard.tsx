import type { ReactNode } from "react";
import { color } from "../theme";

export function DesktopCard({ children, width = 460 }: { children: ReactNode; width?: number }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div
        style={{
          width,
          maxWidth: "100%",
          minHeight: 560,
          maxHeight: "calc(100vh - 80px)",
          background: color.bg,
          borderRadius: 28,
          border: "1px solid rgba(195,134,43,0.28)",
          boxShadow: "0 30px 70px rgba(15,14,12,0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          color: color.cream,
        }}
      >
        {children}
      </div>
    </div>
  );
}
