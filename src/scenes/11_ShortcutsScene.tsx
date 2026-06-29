import { FeatureCard } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const ShortcutsScene = () => (
  <SceneShell lines={sceneCopy.shortcuts.headline}>
    <div style={{ display: "grid", gap: 20, justifyItems: "center" }}>
      <RingflowWheel mini activeSegment="shortcuts" centerLabel="快捷指令" />
      <FeatureCard label="发送到手机" />
      <FeatureCard label="快捷指令完成" emphasis />
    </div>
  </SceneShell>
);
