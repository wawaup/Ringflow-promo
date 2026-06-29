import { PresetLibraryShowcase } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const PresetLibraryScene = () => (
  <SceneShell lines={sceneCopy["preset-library"].headline}>
    <PresetLibraryShowcase />
  </SceneShell>
);
