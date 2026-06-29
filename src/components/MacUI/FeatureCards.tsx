import type { ReactNode } from "react";
import { theme } from "../../config/theme";

type FeatureCardProps = {
  label: string;
  emphasis?: boolean;
  icon?: ReactNode;
  mode?: "light" | "dark";
};

type MetricPillProps = {
  label: string;
  value: string;
  mode?: "light" | "dark";
};

export const FeatureCard = ({ label, emphasis = false, icon, mode = "light" }: FeatureCardProps) => {
  const dark = mode === "dark";
  return (
    <div
      style={{
        minWidth: 190,
        maxWidth: 320,
        minHeight: 86,
        padding: "18px 22px",
        borderRadius: 18,
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: emphasis
          ? dark
            ? "rgba(47,127,211,0.26)"
            : "rgba(232,244,255,0.90)"
          : dark
            ? "rgba(30,41,59,0.72)"
            : "rgba(255,255,255,0.74)",
        border: dark ? "1px solid rgba(255,255,255,0.11)" : "1px solid rgba(255,255,255,0.76)",
        boxShadow: theme.shadow.panel,
        color: dark ? theme.colors.darkInk : theme.colors.ink,
        backdropFilter: "blur(22px)",
        boxSizing: "border-box",
      }}
    >
      {icon ? <div style={{ display: "flex", flex: "0 0 auto", color: theme.colors.accentBlue }}>{icon}</div> : null}
      <div
        style={{
          minWidth: 0,
          overflowWrap: "anywhere",
          fontSize: 32,
          lineHeight: 1.12,
          fontWeight: 760,
          letterSpacing: 0,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const MetricPill = ({ label, value, mode = "light" }: MetricPillProps) => {
  const dark = mode === "dark";
  return (
    <div
      style={{
        width: 166,
        minHeight: 112,
        padding: 18,
        borderRadius: 18,
        background: dark ? "rgba(30,41,59,0.72)" : "rgba(255,255,255,0.70)",
        border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(255,255,255,0.72)",
        boxShadow: theme.shadow.panel,
        backdropFilter: "blur(20px)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 32, lineHeight: 1.12, color: dark ? theme.colors.darkMuted : theme.colors.muted, letterSpacing: 0 }}>
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 36,
          lineHeight: 1,
          fontWeight: 820,
          color: dark ? theme.colors.darkInk : theme.colors.ink,
          letterSpacing: 0,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
};
