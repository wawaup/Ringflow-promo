import { Cursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const ProductRevealScene = () => (
  <SceneShell lines={sceneCopy["product-reveal"].headline}>
    <div style={{ position: "relative", width: 680, minHeight: 500, display: "grid", placeItems: "center" }}>
      <div style={{ scale: 1.18 }}>
        <RingflowWheel activeSegment="quick-input" centerLabel="Ringflow" showCursorReveal />
      </div>
      <Cursor x={446} y={140} />
    </div>
  </SceneShell>
);
