import { ActionListDrag, STAGE_HEIGHT, STAGE_WIDTH } from "../components/ProductUI/ActionListDrag";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "umbrella")!;

/**
 * Shot 4 — 伞句。
 * 「把常用操作，放进轮盘。」 A short action list drags a chip into the
 * showcase wheel's target sector — the idea made literal, priming the
 * feature run that follows.
 */
export const UmbrellaScene = () => {
  const c = scene.choreography;

  return (
    <SceneShell scene={scene} stageWidth={STAGE_WIDTH} stageHeight={STAGE_HEIGHT}>
      <ActionListDrag
        visualStartFrame={c.visualStartFrame}
        actionStartFrame={c.actionStartFrame}
        dragStartFrame={c.dragStartFrame ?? c.actionStartFrame + 40}
        dropFrame={c.dropFrame ?? c.actionStartFrame + 100}
      />
    </SceneShell>
  );
};
