import { AppConfigurationScreenshot } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "app-profiles")!;

export const AppProfilesScene = () => (
  <SceneShell lines={sceneCopy["app-profiles"].headline} layout={scene.layout} choreography={scene.choreography}>
    <AppConfigurationScreenshot choreography={scene.choreography} />
  </SceneShell>
);
