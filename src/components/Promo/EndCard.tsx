import { interpolate, useCurrentFrame } from "remotion";
import { ease01 } from "../../config/motion";
import { OUTRO_CTA } from "../../config/productSemantics";
import { theme } from "../../config/theme";
import { FONT_STACK } from "../Text/PromoText";

type EndCardProps = {
  /** Frame at which the CTA row starts appearing (scene-local). */
  startFrame: number;
  mode?: "light" | "dark";
};

/** Outro CTA: primary "免费下载" pill + secondary "浏览轮盘预设". */
export const EndCard = ({ startFrame, mode = "light" }: EndCardProps) => {
  const frame = useCurrentFrame();
  const dark = mode === "dark";
  const primaryIn = ease01(frame, startFrame, 24);
  const secondaryIn = ease01(frame, startFrame + 8, 24);

  const pillBase = {
    fontFamily: FONT_STACK,
    fontSize: 32,
    fontWeight: 640,
    letterSpacing: "-0.005em",
    padding: "18px 44px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <div
        style={{
          ...pillBase,
          color: "#ffffff",
          background: theme.gradients.accent,
          boxShadow: "0 18px 44px rgba(47,107,255,0.36)",
          opacity: primaryIn,
          transform: `translateY(${(1 - primaryIn) * 24}px)`,
        }}
      >
        {OUTRO_CTA.primary}
      </div>
      <div
        style={{
          ...pillBase,
          color: dark ? theme.colors.darkInk : theme.colors.ink,
          background: dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.85)",
          border: dark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(10,11,13,0.10)",
          boxShadow: theme.shadow.card,
          opacity: secondaryIn,
          transform: `translateY(${(1 - secondaryIn) * 24}px)`,
        }}
      >
        {OUTRO_CTA.secondary}
      </div>
    </div>
  );
};
