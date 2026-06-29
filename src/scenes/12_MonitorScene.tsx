import { MetricPill } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const MonitorScene = () => (
  <SceneShell lines={sceneCopy.monitor.headline} mode="dark">
    <div style={{ display: "grid", gridTemplateColumns: "166px 166px", gap: 20, justifyItems: "center" }}>
      <MetricPill label="CPU" value="18%" mode="dark" />
      <MetricPill label="内存" value="62%" mode="dark" />
      <MetricPill label="网络" value="42M" mode="dark" />
      <MetricPill label="电池" value="86%" mode="dark" />
      <div style={{ gridColumn: "1 / -1", justifySelf: "center", marginTop: 10 }}>
        <RingflowWheel mini mode="dark" activeSegment="monitor" centerLabel="状态" />
      </div>
    </div>
  </SceneShell>
);
