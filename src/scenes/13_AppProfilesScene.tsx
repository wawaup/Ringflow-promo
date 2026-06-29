import { FeatureCard } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const AppProfilesScene = () => (
  <SceneShell lines={sceneCopy["app-profiles"].headline}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 200px)", gap: 20, alignItems: "center" }}>
      <FeatureCard label="Writing" emphasis />
      <FeatureCard label="Coding" />
      <FeatureCard label="Meeting" />
      <div style={{ gridColumn: "1 / -1", justifySelf: "center", marginTop: 16 }}>
        <RingflowWheel mini centerLabel="App" activeSegment="profiles" />
      </div>
    </div>
  </SceneShell>
);
