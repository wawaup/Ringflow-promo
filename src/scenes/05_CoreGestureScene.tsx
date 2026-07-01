import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MiddleClickCursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { LAYOUT } from "../config/layout";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "core-gesture")!;

/**
 * CoreGestureScene
 * Clear three-phase operational gesture:
 * 1. Press middle button (hold state)
 * 2. Swipe right (folder ring reveals + target sector highlights)
 * 3. Release → action completes
 *
 * Designed to be readable like the intro's timed copy/paste sequence.
 */
export const CoreGestureScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = scene.choreography;

  // Cursor entry
  const cursorReveal = interpolate(
    frame,
    [c.mouseStartFrame ?? c.visualStartFrame, (c.mouseStartFrame ?? c.visualStartFrame) + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

  // Press phase (middle button held)
  // Use swipeStartFrame to ensure strictly increasing input range
  const pressStart = c.actionStartFrame;
  const pressMid = c.swipeStartFrame ?? c.actionStartFrame + 8;
  const pressLate = pressMid + 12;
  const pressEnd = c.holdStartFrame ?? pressLate + 40;
  const pressProgress = interpolate(
    frame,
    [pressStart, pressMid, pressLate, pressEnd],
    [0, 1, 1, 0.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Swipe progress
  const swipeT = interpolate(
    frame,
    [c.swipeStartFrame ?? c.actionStartFrame, (c.swipeStartFrame ?? c.actionStartFrame) + 52],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.32, 0.02, 0.2, 1) }
  );

  // Wheel first as protagonist, highlight during swipe (real gesture sector)
  const wheelReveal = spring({
    frame: Math.max(0, frame - (c.wheelStartFrame ?? c.actionStartFrame + 8)),
    fps,
    config: { damping: 18, stiffness: 215, mass: 0.8 },
    durationInFrames: 22,
  });

  const sectorHighlight = interpolate(frame, [
    c.wheelHighlightStartFrame ?? (c.swipeStartFrame ?? 100),
    c.wheelHighlightEndFrame ?? (c.holdStartFrame ?? 180) - 20
  ], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Release / completion
  const releaseStart = c.holdStartFrame ?? 226;
  const releaseProgress = interpolate(frame, [releaseStart, releaseStart + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  // Centered gesture area in middle of the 1180x620 scene container
  const cx = 590; // 1180 / 2
  const cy = 310; // 620 / 2
  const startX = cx - 80;
  const startY = cy + 40;
  const endX = cx + 140;
  const endY = cy - 80;
  const cursorX = interpolate(swipeT, [0, 1], [startX, endX]);
  const cursorY = interpolate(swipeT, [0, 1], [startY, endY]);

  // Folder ring (double layer) only appears during the swipe gesture
  const wheelRevealStart = c.wheelStartFrame ?? c.actionStartFrame + 20;
  const folderMid = wheelRevealStart + 32;
  const folderEnd = Math.max(folderMid + 1, releaseStart - 10);
  const folderProgress = interpolate(
    frame,
    [wheelRevealStart, folderMid, folderEnd],
    [0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

  const folderRotation = interpolate(frame, [wheelRevealStart, releaseStart], [-28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sector highlight + glow on target
  const glowStart = wheelRevealStart + 18;
  const glowMid = wheelRevealStart + 38;
  const glowEnd = Math.max(glowMid + 1, releaseStart + 6);
  const sectorGlow = interpolate(
    frame,
    [glowStart, glowMid, glowEnd],
    [0, 1, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Trail for swipe
  const swipeForTrail = c.swipeStartFrame ?? 90;
  const trailAlpha = interpolate(frame, [swipeForTrail, swipeForTrail + 14, releaseStart - 8], [0, 0.65, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const trailPoints =
    swipeT > 0.05
      ? [
          { x: cursorX - 42, y: cursorY + 18, opacity: trailAlpha * 0.55 },
          { x: cursorX - 78, y: cursorY + 32, opacity: trailAlpha * 0.32 },
          { x: cursorX - 112, y: cursorY + 46, opacity: trailAlpha * 0.15 },
        ]
      : [];

  // Dynamic center label
  const centerLabel = releaseProgress > 0.25 ? "完成" : pressProgress > 0.55 ? "按住" : "Ringflow";

  // Result confirmation
  const resultOpacity = interpolate(frame, [releaseStart - 8, releaseStart + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell
      lines={sceneCopy["core-gesture"].headline}
      layout={scene.layout}
      choreography={scene.choreography}
      stageWidth={1180}
      stageHeight={620}
    >
      <div style={{ position: "relative", width: LAYOUT.stage.center.width * 0.9, height: LAYOUT.stage.center.height * 0.9, display: "grid", placeItems: "center" }}>
        {/* The gesture wheel - fixed hero size, consistent center placement */}
        <div style={{ position: "absolute", left: -80, top: -60 }}>
          <RingflowWheel
            activeSegment="quick-input"
            centerLabel={centerLabel}
            showOuterRing
            folderProgress={folderProgress}
            folderRotation={folderRotation}
            showDragTrail={swipeT > 0.12}
            glowProgress={Math.max(sectorGlow, sectorHighlight)}
            revealProgress={wheelReveal}
            releaseProgress={0} // no dismiss, stay visible
            showCursorReveal={false}
          />
        </div>

        {/* Large teaching cursor with middle-click feedback - stays till end */}
        <MiddleClickCursor
          x={cursorX}
          y={cursorY}
          pressProgress={pressProgress}
          revealProgress={cursorReveal}
          swipeAngle={-22}
          swipeProgress={Math.max(0, swipeT * 1.1)}
          trail={trailPoints}
          scale={3.0 - swipeT * 0.8}
        />

        {/* Clear completion feedback - fixed position */}
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 280,
            width: 340,
            textAlign: "center",
            opacity: resultOpacity,
            color: "#2f7fd3",
            fontSize: 30,
            fontWeight: 720,
            letterSpacing: 0,
          }}
        >
          快捷输入已触发
        </div>
      </div>
    </SceneShell>
  );
};
