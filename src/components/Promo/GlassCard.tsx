import type { CSSProperties, ReactNode } from "react";
import { theme } from "../../config/theme";

type GlassCardProps = {
  mode?: "light" | "dark";
  padding?: string | number;
  radius?: number;
  style?: CSSProperties;
  children?: ReactNode;
};

/** The film's one card surface: white glass, soft brand shadow, website radii. */
export const GlassCard = ({ mode = "light", padding = "22px 26px", radius = 20, style, children }: GlassCardProps) => {
  const dark = mode === "dark";
  return (
    <div
      style={{
        padding,
        borderRadius: radius,
        background: dark ? "rgba(26, 32, 45, 0.78)" : "rgba(255, 255, 255, 0.84)",
        border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(255,255,255,0.9)",
        boxShadow: theme.shadow.card,
        backdropFilter: "blur(22px)",
        boxSizing: "border-box",
        color: dark ? theme.colors.darkInk : theme.colors.ink,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
