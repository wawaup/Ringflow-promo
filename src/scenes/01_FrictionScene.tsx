import { FrictionWorkflow } from "../components/ProductUI/ProductSurfaces";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "friction")!;

/**
 * Shot 1 — 摩擦。
 * Real macOS friction montage: menu → cascading submenu → window switch.
 * Sets up the problem in one glance before Ringflow appears.
 */
export const FrictionScene = () => (
  <SceneShell scene={scene}>
    <FrictionWorkflow choreography={scene.choreography} />
  </SceneShell>
);
