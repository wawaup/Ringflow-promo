import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MacWindow } from "../components/MacUI/MacWindow";
import { Cursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { LAYOUT } from "../config/layout";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";
import { theme } from "../config/theme";

const scene = scenes.find((item) => item.id === "sticky-note")!;

/**
 * StickyNoteScene — hover preview then pin
 * Clear gesture → preview → result (pinned note).
 */
export const StickyNoteScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;

  // Wheel first (real "新便签" sector)
  const wheelReveal = interpolate(frame, [c.wheelStartFrame ?? 60, (c.wheelStartFrame ?? 60) + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight leads the sticky result (conductor)
  const highlight = interpolate(frame, [c.wheelHighlightStartFrame ?? 75, c.wheelHighlightEndFrame ?? 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const previewReveal = interpolate(frame, [c.actionStartFrame ?? 70, (c.actionStartFrame ?? 70) + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const noteExpand = interpolate(frame, [Math.max(c.wheelHighlightEndFrame ?? 100, c.holdStartFrame ?? 130), (c.holdStartFrame ?? 130) + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });

  const noteItems = ["订阅状态刷新点", "设备解绑入口", "预设导入后的默认轮盘"]; // from real defaultGlobalStickyNotes example

  return (
    <SceneShell lines={sceneCopy["sticky-note"].headline} layout={scene.layout} choreography={scene.choreography}>
      <div style={{ position: "relative", width: LAYOUT.stage.top.width * 0.6, height: LAYOUT.stage.top.height * 0.7 }}>
        {/* Main working context — fixed stage size */}
        <div style={{ position: "absolute", left: 0, top: 20 }}>
          <MacWindow title="会议记录.md" width={380} height={260}>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: "#334155" }}>
              讨论要点：<br />
              • 订阅状态刷新逻辑<br />
              • 设备解绑流程<br />
              <span style={{ color: "#64748b" }}>（灵感出现时，不想打断当前工作）</span>
            </div>
          </MacWindow>
        </div>

        {/* Wheel — standard size, consistent right placement */}
        <div style={{ position: "absolute", left: 420, top: 40, transform: "scale(1.0)", opacity: wheelReveal }}>
          <RingflowWheel
            activeSegment="sticky-note"
            centerLabel="便签"
            revealProgress={wheelReveal}
            glowProgress={highlight}
          />
        </div>

        {/* Cursor near wheel */}
        <div style={{ position: "absolute", left: 390, top: 120, opacity: previewReveal * 0.85 }}>
          <Cursor x={20} y={10} scale={0.85} />
        </div>

        {/* Result sticky — fixed offset, no overlap */}
        <div
          style={{
            position: "absolute",
            left: 620,
            top: 0,
            opacity: noteExpand,
            transform: `scale(${0.92 + noteExpand * 0.08})`,
          }}
        >
          <MacWindow title="会议要点" width={260} height={200}>
            <div style={{ fontSize: 15, fontWeight: 680, color: "#263244", marginBottom: 10 }}>
              下次同步前确认三件事
            </div>
            {noteItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#475569", marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#2f7fd3", flexShrink: 0 }} />
                {item}
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: 11, color: "#2f7fd3", fontWeight: 600 }}>
              Ringflow · 已创建
            </div>
          </MacWindow>
        </div>
      </div>
    </SceneShell>
  );
};


