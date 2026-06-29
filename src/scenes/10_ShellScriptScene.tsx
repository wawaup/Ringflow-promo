import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const ShellScriptScene = () => (
  <SceneShell lines={sceneCopy["shell-script"].headline} mode="dark">
    <div style={{ display: "grid", gridTemplateColumns: "520px 220px", gap: 34, alignItems: "center" }}>
      <MacWindow title="Terminal" width={520} height={330} mode="dark">
        <div
          style={{
            fontFamily: "Menlo, Monaco, Consolas, monospace",
            fontSize: 26,
            color: "#e8edf7",
            lineHeight: 1.68,
            fontWeight: 640,
          }}
        >
          <div>$ pnpm run build</div>
          <div style={{ color: "#8bd69a" }}>Done in 2.4s</div>
        </div>
      </MacWindow>
      <RingflowWheel mini mode="dark" runningSegment="shell" centerLabel="Shell" />
    </div>
  </SceneShell>
);
