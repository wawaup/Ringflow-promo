import { FrictionWorkflow } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "friction")!;

/**
 * FrictionScene
 * Semantic demonstration of "操作绕远" — the user has to leave their current focus
 * multiple times (menu → submenu → app switcher) just to accomplish one thing.
 * Timed sequence like the intro.
 */
export const FrictionScene = () => (
  <SceneShell lines={sceneCopy.friction.headline} layout={scene.layout} choreography={scene.choreography}>
    <FrictionWorkflow choreography={scene.choreography} />
  </SceneShell>
);
