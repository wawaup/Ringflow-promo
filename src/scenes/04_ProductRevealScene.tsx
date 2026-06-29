import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const ProductRevealScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wheel springs in at frame 4
  const wheelReveal = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.85 },
    durationInFrames: 26,
  });

  // Cursor starts off-screen right, slides left toward wheel
  const cursorT = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Container is ~680px wide centered; cursor approaches top-right of wheel
  // wheel center at ~340,250; quick-input sector at ~45° = upper-right
  const cursorX = interpolate(cursorT, [0, 1], [620, 446]);
  const cursorY = interpolate(cursorT, [0, 1], [60, 140]);

  const cursorReveal = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <SceneShell lines={sceneCopy["product-reveal"].headline} childrenDelay={2}>
      <div style={{ position: "relative", width: 680, minHeight: 500, display: "grid", placeItems: "center" }}>
        <div style={{ scale: 1.18, opacity: wheelReveal, transform: `scale(${0.88 + wheelReveal * 0.12})` }}>
          <RingflowWheel
            activeSegment="quick-input"
            centerLabel="Ringflow"
            showCursorReveal={false}
            revealProgress={wheelReveal}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: cursorReveal,
          }}
        >
          <Cursor x={cursorX} y={cursorY} scale={0.96} />
        </div>
      </div>
    </SceneShell>
  );
};
