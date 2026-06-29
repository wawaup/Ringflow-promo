import { Cursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const CoreGestureScene = () => (
  <SceneShell lines={sceneCopy["core-gesture"].headline}>
    <div style={{ position: "relative", width: 620, minHeight: 470, display: "grid", placeItems: "center" }}>
      <RingflowWheel
        activeSegment="quick-input"
        centerLabel="按住"
        showOuterRing
        showCursorReveal
        showDragTrail
        glowProgress={0.82}
      />
      <Cursor
        x={430}
        y={156}
        pressed
        trail={[
          { x: 382, y: 206, opacity: 0.18 },
          { x: 334, y: 250, opacity: 0.1 },
        ]}
      />
    </div>
  </SceneShell>
);
