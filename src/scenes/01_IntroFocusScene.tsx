import { MacWindow } from "../components/MacUI/MacWindow";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const IntroFocusScene = () => (
  <SceneShell lines={sceneCopy["intro-focus"].headline}>
    <MacWindow title="Writing" width={820} height={500}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 28, height: "100%" }}>
        <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
          <div style={{ fontSize: 30, lineHeight: 1.45, fontWeight: 680, color: "#334155" }}>
            今天的重点，是把想法保持在同一个上下文里。
          </div>
          <div style={{ height: 172, borderRadius: 18, background: "rgba(241,245,249,0.86)" }} />
          <div style={{ height: 58, borderRadius: 14, background: "rgba(226,232,240,0.82)" }} />
        </div>
        <div
          style={{
            borderRadius: 18,
            background: "rgba(234,245,255,0.92)",
            padding: 22,
            fontSize: 26,
            lineHeight: 1.18,
            fontWeight: 760,
            color: "#1f5f9f",
          }}
        >
          Prompt 模板
        </div>
      </div>
    </MacWindow>
  </SceneShell>
);
