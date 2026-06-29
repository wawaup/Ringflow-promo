import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Cursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const CoreGestureScene = () => {
  const frame = useCurrentFrame();
  const releaseProgress = interpolate(frame, [74, 98], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cursorX = interpolate(frame, [8, 52, 84], [342, 430, 430], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cursorY = interpolate(frame, [8, 52, 84], [250, 156, 156], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <SceneShell lines={sceneCopy["core-gesture"].headline}>
      <div style={{ position: "relative", width: 620, minHeight: 470, display: "grid", placeItems: "center" }}>
        <RingflowWheel
          activeSegment="quick-input"
          centerLabel={releaseProgress > 0.72 ? "完成" : "按住"}
          showOuterRing
          showDragTrail
          glowProgress={0.82}
          releaseProgress={releaseProgress}
        />
        {releaseProgress < 0.95 ? (
          <Cursor
            x={cursorX}
            y={cursorY}
            pressed={releaseProgress < 0.6}
            trail={[
              { x: 382, y: 206, opacity: 0.18 },
              { x: 334, y: 250, opacity: 0.1 },
            ]}
          />
        ) : null}
      </div>
    </SceneShell>
  );
};
