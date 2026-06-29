import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PromoBackground } from "../components/Background/PromoBackground";
import { PromoText } from "../components/Text/PromoText";
import { theme } from "../config/theme";

type SceneShellProps = {
  lines: string[];
  caption?: string;
  mode?: "light" | "dark";
  align?: "left" | "center";
  children?: ReactNode;
  /** Delay in frames before children (right side) spring in (default: 8) */
  childrenDelay?: number;
};

export const SceneShell = ({
  lines,
  caption,
  mode = "light",
  align = "left",
  children,
  childrenDelay = 8,
}: SceneShellProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background subtle fade
  const bgOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Right-side children: spring in slightly after text
  const childrenReveal = spring({
    frame: Math.max(0, frame - childrenDelay),
    fps,
    config: { damping: 22, stiffness: 180, mass: 0.9 },
    durationInFrames: 28,
  });

  const childrenLift = interpolate(childrenReveal, [0, 1], [32, 0]);

  return (
    <AbsoluteFill>
      <PromoBackground mode={mode} />
      <div style={{ opacity: bgOpacity, position: "absolute", inset: 0 }}>
        <AbsoluteFill
          style={{
            padding: `${theme.safeArea.y}px ${theme.safeArea.x}px`,
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns:
              align === "center" ? "1fr" : "minmax(0, 0.9fr) minmax(620px, 1.1fr)",
            gap: align === "center" ? 54 : 72,
            alignItems: "center",
            justifyItems: align === "center" ? "center" : "stretch",
          }}
        >
          <div
            style={{
              justifySelf: align === "center" ? "center" : "start",
              width: align === "center" ? "100%" : "auto",
            }}
          >
            <PromoText
              lines={lines}
              caption={caption}
              mode={mode}
              align={align}
              maxWidth={align === "center" ? 1320 : 760}
              startFrame={0}
              lineStagger={6}
            />
          </div>

          {children ? (
            <div
              style={{
                justifySelf: "center",
                maxWidth: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: childrenReveal,
                transform: `translateY(${childrenLift}px)`,
              }}
            >
              {children}
            </div>
          ) : null}
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
