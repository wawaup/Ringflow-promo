import type { ReactNode } from "react";
import { theme } from "../../config/theme";

type MacWindowProps = {
  title?: string;
  children: ReactNode;
  width?: number;
  height?: number;
  mode?: "light" | "dark";
};

export const MacWindow = ({
  title = "Draft",
  children,
  width = 900,
  height = 560,
  mode = "light",
}: MacWindowProps) => {
  const dark = mode === "dark";
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 24,
        background: dark ? "rgba(28, 38, 55, 0.76)" : theme.colors.glassLight,
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.76)",
        boxShadow: theme.shadow.panel,
        overflow: "hidden",
        backdropFilter: "blur(28px)",
      }}
    >
      <div
        style={{
          height: 54,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 22px",
          borderBottom: dark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(148,163,184,0.18)",
          background: dark ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.30)",
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f57", flex: "0 0 auto" }} />
        <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ffbd2e", flex: "0 0 auto" }} />
        <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28c840", flex: "0 0 auto" }} />
        <span
          style={{
            marginLeft: 16,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 18,
            color: dark ? theme.colors.darkMuted : theme.colors.muted,
            fontWeight: 650,
            letterSpacing: 0,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ height: height - 54, padding: 30, boxSizing: "border-box", overflow: "hidden" }}>{children}</div>
    </div>
  );
};
