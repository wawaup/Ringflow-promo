import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "nearer-concept")!;

/**
 * ProductRevealScene
 * Semantic reveal: Ringflow appears next to the cursor as a clean, ready-to-use wheel.
 * Follows the same operational clarity as the intro scene (timed appearance + cursor intent).
 */
export const ProductRevealScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = scene.choreography;

  const wheelReveal = spring({
    frame: Math.max(0, frame - (c.wheelStartFrame ?? c.visualStartFrame)),
    fps,
    config: { damping: 18, stiffness: 210, mass: 0.82 },
    durationInFrames: 24,
  });

  // Cursor glides in from the right, settles near the wheel (upper-right quadrant)
  const cursorT = interpolate(
    frame,
    [c.actionStartFrame ?? c.visualStartFrame, (c.actionStartFrame ?? c.visualStartFrame) + 38],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

  const baseX = 680;
  const baseY = 180;
  const cursorX = interpolate(cursorT, [0, 1], [baseX + 180, baseX - 40]);
  const cursorY = interpolate(cursorT, [0, 1], [baseY + 40, baseY + 10]);

  const cursorOpacity = interpolate(frame, [c.visualStartFrame ?? 0, (c.visualStartFrame ?? 0) + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle label hint near cursor once wheel is visible
  const labelOpacity = interpolate(frame, [c.wheelStartFrame ?? 40, (c.wheelStartFrame ?? 40) + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell lines={["Ringflow", "出现在光标旁边。"]} layout={scene.layout} choreography={scene.choreography}>
      <div style={{ position: "relative", width: 820, height: 520, display: "grid", placeItems: "center" }}>
        {/* The Ringflow wheel — the hero element */}
        <div
          style={{
            transform: `scale(${0.92 + wheelReveal * 0.08})`,
            opacity: wheelReveal,
          }}
        >
          <RingflowWheel
            activeSegment="quick-input"
            centerLabel="Ringflow"
            showCursorReveal={false}
            revealProgress={wheelReveal}
          />
        </div>

        {/* Intent cursor approaching the wheel */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: cursorOpacity }}>
          <Cursor x={cursorX} y={cursorY} scale={1.05} />
        </div>

        {/* Tiny contextual label to reinforce "appears next to cursor" */}
        <div
          style={{
            position: "absolute",
            left: baseX - 80,
            top: baseY - 70,
            opacity: labelOpacity,
            padding: "6px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 10px 30px rgba(30,45,70,0.12)",
            fontSize: 18,
            fontWeight: 650,
            color: "#2563a9",
            whiteSpace: "nowrap",
          }}
        >
          出现在光标旁边
        </div>
      </div>
    </SceneShell>
  );
};
