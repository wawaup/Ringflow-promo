import { Cursor } from "../components/Cursor/Cursor";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const NearerConceptScene = () => (
  <SceneShell lines={sceneCopy["nearer-concept"].headline} align="center">
    <Cursor
      x={960}
      y={600}
      trail={[
        { x: 960, y: 600, opacity: 0.18 },
        { x: 935, y: 620, opacity: 0.1 },
      ]}
    />
  </SceneShell>
);
