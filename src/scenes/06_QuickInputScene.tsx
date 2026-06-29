import { QuickInputWorkspace } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const QuickInputScene = () => (
  <SceneShell lines={sceneCopy["quick-input"].headline}>
    <QuickInputWorkspace />
  </SceneShell>
);
