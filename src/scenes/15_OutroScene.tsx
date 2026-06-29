import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const OutroScene = () => (
  <SceneShell lines={sceneCopy.outro.headline} align="center">
    <RingflowWheel mini centerLabel="Ringflow" glowProgress={0.78} showOuterRing />
  </SceneShell>
);
