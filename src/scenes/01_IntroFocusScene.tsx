import { WritingWorkspace } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const IntroFocusScene = () => (
  <SceneShell lines={sceneCopy["intro-focus"].headline}>
    <WritingWorkspace />
  </SceneShell>
);
