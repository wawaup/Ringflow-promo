import { FrictionStack } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "friction")!;

export const FrictionScene = () => (
  <SceneShell lines={sceneCopy.friction.headline} layout={scene.layout} choreography={scene.choreography}>
    <FrictionStack />
  </SceneShell>
);
