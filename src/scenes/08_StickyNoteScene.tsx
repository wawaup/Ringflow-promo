import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const StickyNoteScene = () => (
  <SceneShell lines={sceneCopy["sticky-note"].headline}>
    <div style={{ display: "grid", gridTemplateColumns: "260px 440px", gap: 38, alignItems: "center" }}>
      <RingflowWheel mini activeSegment="sticky-note" centerLabel="便签" />
      <MacWindow title="会议要点" width={420} height={280}>
        <div style={{ fontSize: 30, lineHeight: 1.48, fontWeight: 700, color: "#334155" }}>
          下次同步前确认三件事
        </div>
      </MacWindow>
    </div>
  </SceneShell>
);
