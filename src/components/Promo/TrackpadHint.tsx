import { interpolate, useCurrentFrame } from "remotion";
import { ease01 } from "../../config/motion";
import { theme } from "../../config/theme";
import { FONT_STACK } from "../Text/PromoText";
import { KeyCap } from "./KeyCap";

type TrackpadHintProps = {
  /** Frame at which the hint starts appearing (scene-local). */
  startFrame: number;
  mode?: "light" | "dark";
};

/**
 * "触控板同样可以" hint: ⇧ ⌃ key caps + a trackpad with a finger dot
 * drifting to show "hold modifiers and move the cursor".
 */
export const TrackpadHint = ({ startFrame, mode = "light" }: TrackpadHintProps) => {
  const frame = useCurrentFrame();
  const dark = mode === "dark";
  const reveal = ease01(frame, startFrame, 24);
  const keyPress = interpolate(frame, [startFrame + 16, startFrame + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Finger dot drifts across the trackpad after the modifiers are held.
  const drift = ease01(frame, startFrame + 26, 42);
  const dotX = interpolate(drift, [0, 1], [56, 148]);
  const dotY = interpolate(drift, [0, 1], [78, 46]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 22}px)`,
        fontFamily: FONT_STACK,
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <KeyCap label="⇧" mode={mode} size={56} press={keyPress * 0.8} active={keyPress > 0.6} />
        <KeyCap label="⌃" mode={mode} size={56} press={keyPress * 0.8} active={keyPress > 0.6} />
      </div>
      <svg width={204} height={128} viewBox="0 0 204 128" aria-hidden="true" style={{ display: "block" }}>
        <rect
          x={2}
          y={2}
          width={200}
          height={124}
          rx={16}
          fill={dark ? "rgba(38,45,60,0.85)" : "rgba(255,255,255,0.92)"}
          stroke={dark ? "rgba(255,255,255,0.14)" : "rgba(10,11,13,0.10)"}
          strokeWidth={2}
        />
        {/* Drift path ghost */}
        <path
          d={`M 56 78 Q 100 56 148 46`}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="1 10"
          opacity={0.4 * drift}
        />
        <circle
          cx={dotX}
          cy={dotY}
          r={13}
          fill={theme.colors.accent}
          opacity={0.28 + keyPress * 0.5}
        />
        <circle cx={dotX} cy={dotY} r={5.5} fill={theme.colors.accent} opacity={0.9 * Math.max(keyPress, 0.4)} />
      </svg>
    </div>
  );
};
