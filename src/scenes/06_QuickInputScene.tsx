import { MacWindow } from "../components/MacUI/MacWindow";
import { Toast } from "../components/Toast/Toast";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const QuickInputScene = () => (
  <SceneShell lines={sceneCopy["quick-input"].headline}>
    <div style={{ position: "relative", width: 790 }}>
      <MacWindow title="AI Prompt" width={760} height={410}>
        <div style={{ display: "grid", gap: 20 }}>
          <div style={{ fontSize: 30, lineHeight: 1.42, fontWeight: 670, color: "#334155" }}>
            请帮我总结提炼以下内容，并保持语气自然。
          </div>
          <div style={{ height: 132, borderRadius: 18, background: "rgba(241,245,249,0.88)" }} />
          <div style={{ height: 54, borderRadius: 14, background: "rgba(226,232,240,0.80)" }} />
        </div>
      </MacWindow>
      <div style={{ position: "absolute", right: -18, bottom: -58 }}>
        <RingflowWheel mini activeSegment="quick-input" centerLabel="文本" />
      </div>
      <div style={{ position: "absolute", left: 92, bottom: -34 }}>
        <Toast text="Prompt inserted · Clipboard restored" />
      </div>
    </div>
  </SceneShell>
);
