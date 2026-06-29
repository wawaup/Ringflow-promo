import { FrictionStack } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const FrictionScene = () => (
  <SceneShell lines={sceneCopy.friction.headline}>
    <FrictionStack />
  </SceneShell>
);
