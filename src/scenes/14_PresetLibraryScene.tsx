import { FeatureCard } from "../components/MacUI/FeatureCards";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const PresetLibraryScene = () => (
  <SceneShell lines={sceneCopy["preset-library"].headline}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 220px)", gap: 20, justifyItems: "stretch" }}>
      <FeatureCard label="AI 写作" emphasis />
      <FeatureCard label="开发者" />
      <FeatureCard label="会议记录" />
    </div>
  </SceneShell>
);
