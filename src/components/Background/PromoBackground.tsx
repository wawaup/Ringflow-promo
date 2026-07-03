import { useId } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../config/theme";

type PromoBackgroundProps = {
  mode?: "light" | "dark";
  /** 0..1 extra brand-blue ambience for hero moments (reveal / outro). */
  ambience?: number;
};

/**
 * Website-aligned stage: near-white `#f8f9fc` with a soft radial blue wash
 * drifting slowly so long holds keep breathing. Dark variant for contrast
 * beats. No ribbons, no noise — the wheel is the visual event.
 */
export const PromoBackground = ({ mode = "light", ambience = 0 }: PromoBackgroundProps) => {
  const rawId = useId();
  const frame = useCurrentFrame();
  const idPrefix = `promo-bg-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const washId = `${idPrefix}-wash-${mode}`;
  const haloId = `${idPrefix}-halo-${mode}`;
  const dark = mode === "dark";

  // Very slow ambient drift (~12s full sway) — imperceptible but alive.
  const driftX = interpolate(Math.sin(frame / 220), [-1, 1], [44, 56]);
  const driftY = interpolate(Math.cos(frame / 260), [-1, 1], [30, 38]);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: dark
          ? `linear-gradient(160deg, ${theme.colors.darkBg} 0%, #10141d 55%, #0d1119 100%)`
          : `linear-gradient(160deg, #ffffff 0%, ${theme.colors.bg} 52%, #f2f5fb 100%)`,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <radialGradient id={washId} cx={`${driftX}%`} cy={`${driftY}%`} r="68%">
            <stop offset="0%" stopColor={dark ? "rgba(64, 112, 214, 0.20)" : "rgba(47, 107, 255, 0.10)"} />
            <stop offset="55%" stopColor={dark ? "rgba(64, 112, 214, 0.06)" : "rgba(47, 107, 255, 0.035)"} />
            <stop offset="100%" stopColor="rgba(47, 107, 255, 0)" />
          </radialGradient>
          <radialGradient id={haloId} cx="50%" cy="46%" r="46%">
            <stop offset="0%" stopColor={dark ? "rgba(93, 140, 255, 0.24)" : "rgba(47, 107, 255, 0.12)"} />
            <stop offset="70%" stopColor={dark ? "rgba(93, 140, 255, 0.05)" : "rgba(47, 107, 255, 0.03)"} />
            <stop offset="100%" stopColor="rgba(47, 107, 255, 0)" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill={`url(#${washId})`} />
        {ambience > 0.01 ? (
          <rect width="1920" height="1080" fill={`url(#${haloId})`} opacity={ambience} />
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
