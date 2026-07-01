import { QuickInputWorkspace } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "quick-input")!;

/**
 * QuickInputScene — semantic "常用文字，一划输入"
 * Wheel action directly drives visible text insertion into the current context.
 * Mirrors the clear cause-effect of the intro workspace.
 */
export const QuickInputScene = () => (
  <SceneShell lines={sceneCopy["quick-input"].headline} layout={scene.layout} choreography={scene.choreography}>
    <QuickInputWorkspace choreography={scene.choreography} />
  </SceneShell>
);
