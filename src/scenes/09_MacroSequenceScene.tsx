import { MacroTimeline } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const MacroSequenceScene = () => (
  <SceneShell lines={sceneCopy["macro-sequence"].headline} mode="dark">
    <MacroTimeline />
  </SceneShell>
);
