import { QuickInputWorkspace } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "quick-input")!;

export const QuickInputScene = () => (
  <SceneShell lines={sceneCopy["quick-input"].headline} layout={scene.layout} choreography={scene.choreography}>
    <QuickInputWorkspace />
  </SceneShell>
);
