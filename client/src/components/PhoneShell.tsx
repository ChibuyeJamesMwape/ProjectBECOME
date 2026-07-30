import type { ReactNode } from "react";
import { color } from "../theme";

export function PhoneShell({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "28px 16px",
      }}
    >
      <div
        style={{
          width: 390,
          maxWidth: "100%",
          height: 800,
          background: color.bg,
          borderRadius: 44,
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
      {footer}
    </div>
  );
}
