import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { SHOWCASE_SLOTS } from "../components/Wheel/siteWheelModel";
import { getWheelWrapperStyle } from "../config/layout";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "umbrella")!;

/**
 * Shot 5 — 伞句。
 * 「把常用操作，放进轮盘。」 The showcase wheel (one sector per action type)
 * assembles below the line, priming the feature run that follows.
 */
export const UmbrellaScene = () => {
  const c = scene.choreography;

  return (
    <SceneShell scene={scene} stageHeight={440}>
      <div style={getWheelWrapperStyle("standard")}>
        <RingflowWheel
          revealFrame={c.visualStartFrame}
          pulseFrame={c.actionStartFrame}
          mainSlots={SHOWCASE_SLOTS}
          centerLabel="Ringflow"
          showSegmentStagger
        />
      </div>
    </SceneShell>
  );
};
