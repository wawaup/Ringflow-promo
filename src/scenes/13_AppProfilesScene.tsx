import { AppConfigurationScreenshot } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const AppProfilesScene = () => (
  <SceneShell lines={sceneCopy["app-profiles"].headline}>
    <AppConfigurationScreenshot />
  </SceneShell>
);
