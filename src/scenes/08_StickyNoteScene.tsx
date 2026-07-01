import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
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

  const wheelReveal = interpolate(frame, [c.visualStartFrame ?? 0, (c.visualStartFrame ?? 0) + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const previewReveal = interpolate(frame, [c.actionStartFrame ?? 70, (c.actionStartFrame ?? 70) + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const noteExpand = interpolate(frame, [c.holdStartFrame ?? 130, (c.holdStartFrame ?? 130) + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });

  const noteItems = ["订阅状态刷新点", "设备解绑入口", "预设导入后的默认轮盘"]; // from real defaultGlobalStickyNotes example

  return (
    <SceneShell lines={sceneCopy["sticky-note"].headline} layout={scene.layout} choreography={scene.choreography}>
      <div style={{ display: "grid", gridTemplateColumns: "255px 460px", gap: 42, alignItems: "center" }}>
        <div>
          <RingflowWheel mini activeSegment="sticky-note" centerLabel="便签" revealProgress={wheelReveal} />
        </div>

        <div style={{ position: "relative" }}>
          {/* Preview card that appears on hover/selection */}
          <div
            style={{
              position: "absolute",
              right: 30,
              top: -10,
              opacity: previewReveal * (1 - noteExpand * 0.6),
              transform: `scale(${0.88 + previewReveal * 0.12})`,
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 210,
                borderRadius: 16,
                padding: "12px 16px",
                fontSize: 15,
                background: theme.colors.glassLight,
                border: "1px solid rgba(255,255,255,0.72)",
                boxShadow: "0 16px 40px rgba(30,45,70,0.14)",
              }}
            >
              <div style={{ fontWeight: 680, marginBottom: 6 }}>会议要点</div>
              <div style={{ fontSize: 14, color: "#475569" }}>下次同步前确认三件事</div>
            </div>
          </div>

          {/* The final pinned note */}
          <div
            style={{
              opacity: noteExpand,
              transform: `scale(${0.94 + noteExpand * 0.06}) translateY(${(1 - noteExpand) * 18}px)`,
            }}
          >
            <MacWindow title="会议要点" width={420} height={265}>
              <div style={{ fontSize: 17, fontWeight: 640, color: "#263244", marginBottom: 14 }}>
                下次同步前确认三件事
              </div>
              {noteItems.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 19, color: "#475569", marginBottom: 11 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: "#2f7fd3", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </MacWindow>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const HeadlineReveal = ({
  frame,
  startFrame,
  children,
}: {
  frame: number;
  startFrame: number;
  children: React.ReactNode;
}) => {
  const t = interpolate(frame, [startFrame, startFrame + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        fontSize: 30,
        lineHeight: 1.28,
        fontWeight: 760,
        color: "#263244",
        opacity: t,
        transform: `translateY(${(1 - t) * 12}px)`,
      }}
    >
      {children}
    </div>
  );
};

const ItemReveal = ({
  frame,
  startFrame,
  children,
}: {
  frame: number;
  startFrame: number;
  children: React.ReactNode;
}) => {
  const t = interpolate(frame, [startFrame, startFrame + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div style={{ opacity: t, transform: `translateX(${(1 - t) * -10}px)` }}>
      {children}
    </div>
  );
};
