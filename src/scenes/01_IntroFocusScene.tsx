import { InterruptedWorkflowWorkspace } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "intro-focus")!;
const introChoreography = {
  ...scene.choreography,
  visualStartFrame: scene.choreography.pageStartFrame ?? scene.choreography.visualStartFrame,
};

export const IntroFocusScene = () => (
  <SceneShell
    lines={sceneCopy["intro-focus"].headline}
    layout={scene.layout}
    choreography={introChoreography}
    stageWidth={980}
    stageHeight={680}
    textLineStagger={24}
  >
    <InterruptedWorkflowWorkspace choreography={scene.choreography} />
  </SceneShell>
);
