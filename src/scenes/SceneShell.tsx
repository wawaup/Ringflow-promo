import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PromoBackground } from "../components/Background/PromoBackground";
import { PromoText } from "../components/Text/PromoText";
import { theme } from "../config/theme";
import { LAYOUT } from "../config/layout";
import type { SceneChoreography, SceneLayout } from "../config/timeline";

type SceneShellProps = {
  lines: string[];
  caption?: string;
  mode?: "light" | "dark";
  align?: "left" | "center";
  layout?: SceneLayout;
  choreography?: SceneChoreography;
  children?: ReactNode;
  /** Delay in frames before children when choreography is not provided. */
  childrenDelay?: number;
  stageWidth?: number;
  stageHeight?: number;
  textLineStagger?: number;
};

export const SceneShell = ({
  lines,
  caption,
  mode = "light",
  align = "left",
  layout,
  choreography,
  children,
  childrenDelay = 8,
  stageWidth,
  stageHeight,
  textLineStagger = 6,
}: SceneShellProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolvedLayout: SceneLayout = layout ?? (align === "center" ? "center-stage" : "left-stage");
  const textAlign = resolvedLayout === "center-stage" || resolvedLayout === "top-stage" ? "center" : align;
  const textStartFrame = choreography?.textStartFrame ?? 0;
  const visualStartFrame = choreography?.visualStartFrame ?? childrenDelay;

  // Background subtle fade
  const bgOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Right-side children: spring in slightly after text
  const childrenReveal = spring({
    frame: Math.max(0, frame - visualStartFrame),
    fps,
    config: { damping: 24, stiffness: 170, mass: 0.95 },
    durationInFrames: 30,
  });

  const childrenLift = interpolate(childrenReveal, [0, 1], [36, 0]);

  // Use fixed layout constants for consistency (no arbitrary sizes)
  const visualStageWidth = stageWidth ?? (resolvedLayout === "left-stage" 
    ? LAYOUT.stage.left.width 
    : LAYOUT.stage.top.width);
  const visualStageHeight = stageHeight ?? (resolvedLayout === "left-stage" 
    ? LAYOUT.stage.left.height 
    : LAYOUT.stage.top.height);

  return (
    <AbsoluteFill>
      <PromoBackground mode={mode} />
      <div style={{ opacity: bgOpacity, position: "absolute", inset: 0 }}>
        <AbsoluteFill
          style={{
            padding: `${theme.safeArea.y}px ${theme.safeArea.x}px`,
            boxSizing: "border-box",
            display: "flex",
            flexDirection:
              resolvedLayout === "left-stage" ? "row" : "column",
            gap:
              resolvedLayout === "center-stage" ? 68 : resolvedLayout === "top-stage" ? 58 : 80,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width:
                resolvedLayout === "left-stage"
                  ? 700
                  : resolvedLayout === "top-stage"
                    ? "100%"
                    : "100%",
              maxWidth:
                resolvedLayout === "left-stage"
                  ? 700
                  : resolvedLayout === "top-stage"
                    ? 1320
                    : 1320,
              display: "flex",
              alignItems: "center",
              justifyContent: resolvedLayout === "left-stage" ? "flex-start" : "center",
              minHeight: resolvedLayout === "left-stage" ? visualStageHeight : "auto",
            }}
          >
            <PromoText
              lines={lines}
              caption={caption}
              mode={mode}
              align={textAlign}
              // Enforce fixed text sizes and max widths from layout constants
              size={resolvedLayout === "top-stage" ? LAYOUT.text.headlineTop : LAYOUT.text.headline}
              captionSize={resolvedLayout === "top-stage" ? LAYOUT.text.captionTop : LAYOUT.text.caption}
              maxWidth={resolvedLayout === "left-stage" ? LAYOUT.textMaxWidth.left : LAYOUT.textMaxWidth.topCenter}
              startFrame={textStartFrame}
              lineStagger={textLineStagger}
              scale={1} // Scale controlled centrally now
            />
          </div>

          {children ? (
            <div
              style={{
                width: visualStageWidth,
                height: visualStageHeight,
                maxWidth: "calc(100vw - 240px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: childrenReveal,
                transform:
                  resolvedLayout === "left-stage"
                    ? `translateX(${childrenLift}px)`
                    : `translateY(${childrenLift}px)`,
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
