import { FeatureCard } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const MacroSequenceScene = () => (
  <SceneShell lines={sceneCopy["macro-sequence"].headline} mode="dark">
    <div style={{ display: "grid", gridTemplateColumns: "220px 220px", gap: 20, justifyItems: "stretch" }}>
      <FeatureCard label="复制" mode="dark" />
      <FeatureCard label="切换应用" mode="dark" />
      <FeatureCard label="粘贴" mode="dark" />
      <FeatureCard label="保存" mode="dark" emphasis />
      <div style={{ gridColumn: "1 / -1", justifySelf: "center", marginTop: 10 }}>
        <RingflowWheel mini mode="dark" runningSegment="macro" centerLabel="运行中" />
      </div>
    </div>
  </SceneShell>
);
