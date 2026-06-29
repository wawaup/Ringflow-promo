import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

const noteItems = ["订阅状态刷新点", "设备解绑入口", "预设导入后的默认轮盘"];

export const StickyNoteScene = () => {
  const frame = useCurrentFrame();

  const windowReveal = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <SceneShell lines={sceneCopy["sticky-note"].headline}>
      <div style={{ display: "grid", gridTemplateColumns: "260px 440px", gap: 38, alignItems: "center" }}>
        <RingflowWheel mini activeSegment="sticky-note" centerLabel="便签" revealFrame={4} />
        <div
          style={{
            opacity: windowReveal,
            transform: `translateY(${(1 - windowReveal) * 20}px)`,
          }}
        >
          <MacWindow title="会议要点" width={420} height={280}>
            <div style={{ display: "grid", gap: 16 }}>
              <HeadlineReveal frame={frame} startFrame={8}>
                下次同步前确认三件事
              </HeadlineReveal>
              {noteItems.map((item, i) => (
                <ItemReveal key={item} frame={frame} startFrame={18 + i * 10}>
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 22, color: "#475569" }}
                  >
                    <span
                      style={{ width: 7, height: 7, borderRadius: 999, background: "#2f7fd3", flexShrink: 0 }}
                    />
                    {item}
                  </div>
                </ItemReveal>
              ))}
            </div>
          </MacWindow>
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
