import { MonitorDashboard } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "monitor")!;

/**
 * MonitorScene — status at a glance via Ringflow.
 */
export const MonitorScene = () => (
  <SceneShell lines={sceneCopy.monitor.headline} mode="dark" layout={scene.layout} choreography={scene.choreography}>
    <MonitorDashboard choreography={scene.choreography} />
  </SceneShell>
);
