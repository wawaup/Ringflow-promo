import { MacroTimeline } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "macro-sequence")!;

export const MacroSequenceScene = () => (
  <SceneShell lines={sceneCopy["macro-sequence"].headline} mode="dark" layout={scene.layout} choreography={scene.choreography}>
    <MacroTimeline />
  </SceneShell>
);
