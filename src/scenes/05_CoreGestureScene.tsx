import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MiddleClickCursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

/**
 * CoreGestureScene — Complete gesture choreography:
 *
 * Frame  0–12:  Cursor appears, scroll wheel fades in (idle state)
 * Frame 12–24:  Middle mouse button press animation (scroll wheel glows)
 * Frame 24–52:  Wheel spring-reveals around cursor
 * Frame 52–80:  Cursor slides right-upward toward "quick-input" sector
 * Frame 72–88:  Active sector highlights (glow pulse)
 * Frame 88–96:  Cursor releases, wheel dismisses with opacity fade
 */
export const CoreGestureScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Cursor reveal ───────────────────────────────────────────────────────────
  const cursorReveal = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // ─── Middle-click press progress ────────────────────────────────────────────
  // Hold phase: 0→1 in frames 12–24
  // Release phase: 1→0 in frames 88–96
  const pressProgress = interpolate(frame, [12, 22, 86, 96], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // ─── Wheel reveal ────────────────────────────────────────────────────────────
  const wheelReveal = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 20, stiffness: 220, mass: 0.78 },
    durationInFrames: 24,
  });

  // Wheel dismissal (release → shrink + fade)
  const releaseProgress = interpolate(frame, [88, 98], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  // ─── Cursor swipe trajectory ─────────────────────────────────────────────────
  // Swipe: center → upper-right (toward quick-input sector)
  // Uses a cubic-eased rightward slide
  const swipeT = interpolate(frame, [52, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Cursor position: starts at wheel center, moves to sector
  // Wheel center is approximately at (310, 235) within the 620×470 container
  // quick-input sector is at ~45° (upper-right)
  const cursorX = interpolate(swipeT, [0, 1], [310, 420]);
  const cursorY = interpolate(swipeT, [0, 1], [235, 148]);

  // ─── Swipe direction arrow on cursor ─────────────────────────────────────────
  const swipeArrowProgress = interpolate(frame, [48, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Glow pulse on sector ────────────────────────────────────────────────────
  const sectorGlow = interpolate(frame, [72, 82, 92], [0, 1, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Trail dots: animated along swipe path
  const trailAlpha = interpolate(frame, [52, 62, 86, 90], [0, 0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate trail dots behind cursor
  const trailPoints = swipeT > 0
    ? [
        { x: cursorX - 22, y: cursorY + 18, opacity: trailAlpha * 0.52 },
        { x: cursorX - 44, y: cursorY + 36, opacity: trailAlpha * 0.28 },
        { x: cursorX - 66, y: cursorY + 54, opacity: trailAlpha * 0.14 },
      ]
    : [];

  // ─── Center label transitions ─────────────────────────────────────────────────
  const centerLabel = releaseProgress > 0.3 ? "完成" : pressProgress > 0.5 ? "按住" : "Ringflow";

  return (
    <SceneShell lines={sceneCopy["core-gesture"].headline} childrenDelay={4}>
      <div
        style={{
          position: "relative",
          width: 620,
          minHeight: 470,
          display: "grid",
          placeItems: "center",
        }}
      >
        {/* Main wheel */}
        <RingflowWheel
          activeSegment="quick-input"
          centerLabel={centerLabel}
          showOuterRing={false}
          showDragTrail={swipeT > 0.1 && releaseProgress < 0.5}
          glowProgress={sectorGlow}
          revealProgress={wheelReveal * (1 - releaseProgress * 0.85)}
          releaseProgress={releaseProgress}
          showCursorReveal={false}
        />

        {/* Middle-click cursor — only show while wheel visible */}
        {releaseProgress < 0.95 ? (
          <MiddleClickCursor
            x={cursorX}
            y={cursorY}
            pressProgress={pressProgress}
            revealProgress={cursorReveal}
            swipeAngle={-42}
            swipeProgress={swipeArrowProgress * (1 - releaseProgress * 2)}
            trail={trailPoints}
          />
        ) : null}
      </div>
    </SceneShell>
  );
};
