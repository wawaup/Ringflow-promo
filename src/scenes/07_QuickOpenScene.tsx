import { QuickOpenTargets } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "quick-open")!;

export const QuickOpenScene = () => (
  <SceneShell lines={sceneCopy["quick-open"].headline} layout={scene.layout} choreography={scene.choreography}>
    <QuickOpenTargets choreography={scene.choreography} />
  </SceneShell>
);
