import { Cursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const ProductRevealScene = () => (
  <SceneShell lines={sceneCopy["product-reveal"].headline}>
    <div style={{ position: "relative", width: 620, minHeight: 470, display: "grid", placeItems: "center" }}>
      <RingflowWheel activeSegment="quick-input" centerLabel="Ringflow" showOuterRing showCursorReveal />
      <Cursor x={404} y={158} />
    </div>
  </SceneShell>
);
