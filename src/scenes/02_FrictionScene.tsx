import { FeatureCard } from "../components/MacUI/FeatureCards";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const FrictionScene = () => (
  <SceneShell lines={sceneCopy.friction.headline}>
    <div style={{ display: "grid", gap: 20, justifyItems: "start" }}>
      <FeatureCard label="菜单" />
      <FeatureCard label="二级菜单" />
      <FeatureCard label="窗口切换" emphasis />
    </div>
  </SceneShell>
);
