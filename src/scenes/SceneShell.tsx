import type { ReactNode } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PromoBackground } from "../components/Background/PromoBackground";
import { PromoText } from "../components/Text/PromoText";
import { LAYOUT } from "../config/layout";
import { scenePushIn, sceneTransition, textExit } from "../config/motion";
import { theme } from "../config/theme";
import { sceneCopy } from "../config/copy";
import type { SceneTiming } from "../config/timeline";

type SceneShellProps = {
  /** Timing entry from config/timeline — drives transition, layout and choreography. */
  scene: SceneTiming;
  /** Override headline lines (defaults to sceneCopy[scene.id]). */
  lines?: string[];
  caption?: string;
  mode?: "light" | "dark";
  /** Brand gradient headline (reveal / outro). */
  gradient?: boolean;
  /** Extra blue ambience 0..1 for hero moments. */
  ambience?: number;
  /** Render no headline block at all (scene draws its own text). */
  hideText?: boolean;
  headlineSize?: number;
  captionSize?: number;
  stageWidth?: number;
  stageHeight?: number;
  /** Camera push-in amount across the scene (0 disables). */
  pushIn?: number;
  children?: ReactNode;
};

/**
 * SceneShell v2 — one visual grammar for the whole film:
 * cross-dissolve in/out (SCENE_OVERLAP), slow camera push-in, flex-flow text
 * (headline and caption can never overlap), and a centered visual stage.
 */
export const SceneShell = ({
  scene,
  lines,
  caption,
  mode = "light",
  gradient = false,
  ambience = 0,
  hideText = false,
  headlineSize,
  captionSize,
  stageWidth,
  stageHeight,
  pushIn = 0.03,
  children,
}: SceneShellProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layout = scene.layout;
  const c = scene.choreography;
  const copy = sceneCopy[scene.id];
  const resolvedLines = lines ?? copy.headline;
  const resolvedCaption = caption ?? copy.caption;

  const totalFrames = scene.durationInFrames + scene.overlapWithNextFrames;
  const transition = sceneTransition(frame, totalFrames);
  const camera = pushIn > 0 ? scenePushIn(frame, totalFrames, pushIn) : 1;
  const headlineOpacity = textExit(frame, scene.durationInFrames, scene.overlapWithNextFrames);

  const childrenReveal = spring({
    frame: Math.max(0, frame - c.visualStartFrame),
    fps,
    config: { damping: 26, stiffness: 160, mass: 0.9 },
    durationInFrames: 32,
  });
  const childrenLift = interpolate(childrenReveal, [0, 1], [40, 0]);

  const isRow = layout === "left-stage";
  const resolvedStageWidth = stageWidth ?? (isRow ? LAYOUT.stage.left.width : LAYOUT.stage.top.width);
  const resolvedStageHeight = stageHeight ?? (isRow ? LAYOUT.stage.left.height : LAYOUT.stage.top.height);
  const textAlign = isRow ? "left" : "center";

  return (
    <AbsoluteFill style={{ opacity: transition.opacity }}>
      <PromoBackground mode={mode} ambience={ambience} />
      <AbsoluteFill
        style={{
          padding: `${theme.safeArea.y}px ${theme.safeArea.x}px`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: isRow ? "row" : "column",
          gap: isRow ? 72 : 56,
          alignItems: "center",
          justifyContent: "center",
          scale: String(transition.scale * camera),
          transformOrigin: "center 46%",
        }}
      >
        {!hideText ? (
          <div
            style={{
              width: isRow ? LAYOUT.textMaxWidth.left : "100%",
              maxWidth: isRow ? LAYOUT.textMaxWidth.left : LAYOUT.textMaxWidth.topCenter,
              display: "flex",
              justifyContent: isRow ? "flex-start" : "center",
              flex: "none",
              opacity: headlineOpacity,
            }}
          >
            <PromoText
              lines={resolvedLines}
              caption={resolvedCaption}
              mode={mode}
              align={textAlign}
              gradient={gradient}
              size={headlineSize ?? (layout === "top-stage" ? LAYOUT.text.headlineBeat : LAYOUT.text.headline)}
              captionSize={captionSize ?? (layout === "top-stage" ? LAYOUT.text.captionBeat : LAYOUT.text.caption)}
              maxWidth={isRow ? LAYOUT.textMaxWidth.left : LAYOUT.textMaxWidth.topCenter}
              startFrame={c.textStartFrame}
            />
          </div>
        ) : null}

        {children ? (
          <div
            style={{
              width: resolvedStageWidth,
              height: resolvedStageHeight,
              display: "grid",
              placeItems: "center",
              opacity: childrenReveal,
              transform: isRow ? `translateX(${childrenLift}px)` : `translateY(${childrenLift}px)`,
              flex: "none",
            }}
          >
            {children}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
