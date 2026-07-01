import { MacroExecution } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "macro-sequence")!;

/**
 * MacroSequenceScene — one swipe triggers a real multi-step flow.
 * Steps light up sequentially as if executed by Ringflow.
 */
export const MacroSequenceScene = () => (
  <SceneShell lines={sceneCopy["macro-sequence"].headline} mode="dark" layout={scene.layout} choreography={scene.choreography}>
    <MacroExecution choreography={scene.choreography} />
  </SceneShell>
);
