import { AppLogoMark } from "../components/Brand/AppLogoMark";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const OutroScene = () => (
  <SceneShell lines={sceneCopy.outro.headline} align="center">
    <AppLogoMark size={178} />
  </SceneShell>
);
