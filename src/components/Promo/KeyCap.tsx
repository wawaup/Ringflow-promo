import { theme } from "../../config/theme";
import { FONT_STACK } from "../Text/PromoText";

type KeyCapProps = {
  label: string;
  mode?: "light" | "dark";
  /** 0..1 — pressed depth for micro feedback. */
  press?: number;
  size?: number;
  active?: boolean;
};

/** macOS-style key cap for shortcut demonstrations. */
export const KeyCap = ({ label, mode = "light", press = 0, size = 64, active = false }: KeyCapProps) => {
  const dark = mode === "dark";
  return (
    <div
      style={{
        minWidth: size,
        height: size,
        padding: "0 18px",
        borderRadius: Math.round(size * 0.22),
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_STACK,
        fontSize: Math.round(size * 0.42),
        fontWeight: 600,
        letterSpacing: "0.01em",
        color: active ? "#ffffff" : dark ? theme.colors.darkInk : theme.colors.ink,
        background: active
          ? theme.gradients.accent
          : dark
            ? "linear-gradient(180deg, rgba(52,60,76,0.95), rgba(34,41,54,0.95))"
            : "linear-gradient(180deg, #ffffff, #eef1f7)",
        border: active
          ? "1px solid rgba(47,107,255,0.55)"
          : dark
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(10,11,13,0.08)",
        boxShadow: active
          ? `0 ${10 - press * 6}px 26px rgba(47,107,255,0.36), inset 0 1px 0 rgba(255,255,255,0.35)`
          : `0 ${8 - press * 5}px 18px rgba(10,24,61,0.14), inset 0 1px 0 rgba(255,255,255,0.75)`,
        transform: `translateY(${press * 4}px) scale(${1 - press * 0.03})`,
        boxSizing: "border-box",
      }}
    >
      {label}
    </div>
  );
};
