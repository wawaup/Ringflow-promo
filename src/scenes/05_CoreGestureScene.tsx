import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MiddleClickCursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "core-gesture")!;

/**
 * CoreGestureScene — Complete gesture choreography:
 *
 * Text appears first.
 * Enlarged cursor appears centered.
 * Cursor presses and starts sliding right.
 * The double-layer wheel appears on the right after the swipe begins.
 * Selection result holds long enough to read.
 */
export const CoreGestureScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = scene.choreography;

  // ─── Cursor reveal ───────────────────────────────────────────────────────────
  const cursorReveal = interpolate(frame, [c.mouseStartFrame ?? c.visualStartFrame, (c.mouseStartFrame ?? c.visualStartFrame) + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // ─── Middle-click press progress ────────────────────────────────────────────
  const pressProgress = interpolate(frame, [c.actionStartFrame, c.actionStartFrame + 16, c.holdStartFrame + 8, c.holdStartFrame + 28], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // ─── Wheel reveal ────────────────────────────────────────────────────────────
  const wheelReveal = spring({
    frame: Math.max(0, frame - (c.wheelStartFrame ?? c.visualStartFrame)),
    fps,
    config: { damping: 20, stiffness: 220, mass: 0.78 },
    durationInFrames: 24,
  });

  // Wheel dismissal (release → shrink + fade)
  const releaseProgress = interpolate(frame, [c.holdStartFrame + 26, c.holdStartFrame + 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  // ─── Cursor swipe trajectory ─────────────────────────────────────────────────
  // Swipe: center → upper-right (toward quick-input sector)
  // Uses a cubic-eased rightward slide
  const swipeT = interpolate(frame, [c.swipeStartFrame ?? c.actionStartFrame, (c.swipeStartFrame ?? c.actionStartFrame) + 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const mouseStartX = 440;
  const mouseStartY = 300;
  const cursorX = interpolate(swipeT, [0, 1], [mouseStartX, 660]);
  const cursorY = interpolate(swipeT, [0, 1], [mouseStartY, 226]);

  // ─── Swipe direction arrow on cursor ─────────────────────────────────────────
  const swipeArrowProgress = interpolate(frame, [(c.swipeStartFrame ?? c.actionStartFrame) - 8, (c.swipeStartFrame ?? c.actionStartFrame) + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Glow pulse on sector ────────────────────────────────────────────────────
  const sectorGlow = interpolate(frame, [(c.wheelStartFrame ?? c.visualStartFrame) + 34, (c.wheelStartFrame ?? c.visualStartFrame) + 56, c.holdStartFrame], [0, 1, 0.86], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Trail dots: animated along swipe path
  const trailAlpha = interpolate(frame, [c.swipeStartFrame ?? c.actionStartFrame, (c.swipeStartFrame ?? c.actionStartFrame) + 16, c.holdStartFrame - 12, c.holdStartFrame + 6], [0, 0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate trail dots behind cursor
  const trailPoints = swipeT > 0
    ? [
        { x: cursorX - 34, y: cursorY + 14, opacity: trailAlpha * 0.52 },
        { x: cursorX - 68, y: cursorY + 28, opacity: trailAlpha * 0.28 },
        { x: cursorX - 102, y: cursorY + 42, opacity: trailAlpha * 0.14 },
      ]
    : [];

  // ─── Center label transitions ─────────────────────────────────────────────────
  const centerLabel = releaseProgress > 0.3 ? "完成" : pressProgress > 0.5 ? "按住" : "Ringflow";
  const folderProgress = interpolate(frame, [c.wheelStartFrame ?? c.visualStartFrame, (c.wheelStartFrame ?? c.visualStartFrame) + 34, c.holdStartFrame], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const folderRotation = interpolate(frame, [c.wheelStartFrame ?? c.visualStartFrame, c.holdStartFrame], [-34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const resultOpacity = interpolate(frame, [c.holdStartFrame - 16, c.holdStartFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <SceneShell
      lines={sceneCopy["core-gesture"].headline}
      layout={scene.layout}
      choreography={scene.choreography}
      stageWidth={1180}
      stageHeight={610}
    >
      <div
        style={{
          position: "relative",
          width: 1180,
          height: 610,
          display: "grid",
          placeItems: "center",
        }}
      >
        {/* Main wheel */}
        <div
          style={{
            position: "absolute",
            left: 705,
            top: 86,
            width: 430,
            height: 430,
            display: "grid",
            placeItems: "center",
          }}
        >
          <RingflowWheel
            activeSegment="quick-input"
            centerLabel={centerLabel}
            showOuterRing
            folderProgress={folderProgress}
            folderRotation={folderRotation}
            showDragTrail={swipeT > 0.1 && releaseProgress < 0.5}
            glowProgress={sectorGlow}
            revealProgress={wheelReveal * (1 - releaseProgress * 0.85)}
            releaseProgress={releaseProgress}
            showCursorReveal={false}
          />
        </div>

        {/* Middle-click cursor — only show while wheel visible */}
        {releaseProgress < 0.95 ? (
          <MiddleClickCursor
            x={cursorX}
            y={cursorY}
            pressProgress={pressProgress}
            revealProgress={cursorReveal}
            swipeAngle={-18}
            swipeProgress={swipeArrowProgress * (1 - releaseProgress * 2)}
            trail={trailPoints}
            scale={3.15 - swipeT * 1.35}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 738,
            top: 514,
            width: 350,
            textAlign: "center",
            opacity: resultOpacity,
            color: "#2f7fd3",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif',
            fontSize: 32,
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
