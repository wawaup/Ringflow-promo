import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const StickyNoteScene = () => (
  <SceneShell lines={sceneCopy["sticky-note"].headline}>
    <div style={{ display: "grid", gridTemplateColumns: "260px 440px", gap: 38, alignItems: "center" }}>
      <RingflowWheel mini activeSegment="sticky-note" centerLabel="便签" />
      <MacWindow title="会议要点" width={420} height={280}>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ fontSize: 30, lineHeight: 1.28, fontWeight: 760, color: "#263244" }}>
            下次同步前确认三件事
          </div>
          {["订阅状态刷新点", "设备解绑入口", "预设导入后的默认轮盘"].map((item) => (
            <div key={item} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 22, color: "#475569" }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: "#2f7fd3" }} />
              {item}
            </div>
          ))}
        </div>
      </MacWindow>
    </div>
  </SceneShell>
);
