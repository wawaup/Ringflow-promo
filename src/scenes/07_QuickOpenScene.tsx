import { FeatureCard } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const QuickOpenScene = () => (
  <SceneShell lines={sceneCopy["quick-open"].headline}>
    <div style={{ display: "grid", gap: 20, justifyItems: "end" }}>
      <RingflowWheel mini activeSegment="quick-open" centerLabel="打开" />
      <FeatureCard label="Terminal" />
      <FeatureCard label="README.md" />
      <FeatureCard label="Project Folder" emphasis />
    </div>
  </SceneShell>
);
