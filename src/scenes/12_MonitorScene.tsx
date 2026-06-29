import { MonitorDashboard } from "../components/ProductUI/ProductSurfaces";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const MonitorScene = () => (
  <SceneShell lines={sceneCopy.monitor.headline} mode="dark">
    <MonitorDashboard />
  </SceneShell>
);
