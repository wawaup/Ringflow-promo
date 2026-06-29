import { QuickOpenTargets } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const QuickOpenScene = () => (
  <SceneShell lines={sceneCopy["quick-open"].headline}>
    <QuickOpenTargets />
  </SceneShell>
);
