import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PromoBackground } from "../components/Background/PromoBackground";
import { Cursor } from "../components/Cursor/Cursor";
import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { LAYOUT, getWheelWrapperStyle } from "../config/layout";
import { theme } from "../config/theme";
import { scenes } from "../config/timeline";

const scene = scenes.find((item) => item.id === "nearer-concept")!;

const reveal = (frame: number, start: number, duration = 28) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const GROUP_WIDTH = LAYOUT.stage.center.width * 0.58;
const GROUP_HEIGHT = LAYOUT.stage.center.height * 0.68;

export const NearerConceptScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = scene.choreography;

  const ideaText = reveal(frame, c.textStartFrame, 30);
  const revealText = reveal(frame, c.visualStartFrame, 28);
  const wheelReveal = spring({
    frame: Math.max(0, frame - (c.wheelStartFrame ?? c.actionStartFrame)),
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.85 },
    durationInFrames: 26,
  });

  // Highlight on relevant real sector (e.g. quick-input / 润色改写) leads any follow-on
  const highlight = interpolate(frame, [
    c.wheelHighlightStartFrame ?? (c.wheelStartFrame ?? 80) + 20,
    c.wheelHighlightEndFrame ?? (c.wheelStartFrame ?? 80) + 60
  ], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorReveal = reveal(frame, c.mouseStartFrame ?? c.actionStartFrame, 18);

  const cursorT = interpolate(frame, [
    c.mouseStartFrame ?? c.actionStartFrame,
    (c.mouseStartFrame ?? c.actionStartFrame) + 34,
  ], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Cursor moves in the SAME local coordinate space as the document window
  // (0,0) and the wheel wrapper (360,35) below — not full-canvas coordinates,
  // so it stays visible and lands next to the wheel it summons (Block 6 fix).
  const cursorStartX = 170;
  const cursorStartY = 150;
  const cursorEndX = 345; // just left of the wheel's edge
  const cursorEndY = 165;

  const cursorX = interpolate(cursorT, [0, 1], [cursorStartX, cursorEndX]);
  const cursorY = interpolate(cursorT, [0, 1], [cursorStartY, cursorEndY]);

  const wheelOpacity = interpolate(wheelReveal, [0, 1], [0, 1]);
  // Summon feel: starts smaller, pops a bit larger, settles (product UI reveal moment)
  const wheelScale = interpolate(wheelReveal, [0, 0.6, 1], [0.55, 1.08, 1]);

  const trailAlpha = interpolate(frame, [
    c.mouseStartFrame ?? c.actionStartFrame,
    (c.mouseStartFrame ?? c.actionStartFrame) + 16,
    c.holdStartFrame,
  ], [0, 0.45, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const trail = cursorT > 0.1 ? [
    { x: cursorX - 20, y: cursorY + 20, opacity: trailAlpha * 0.5 },
    { x: cursorX - 50, y: cursorY + 35, opacity: trailAlpha * 0.25 },
  ] : [];

  // Keep wheel and cursor visible after animation (hold till end of scene)
  const finalHold = 1; // always visible

  return (
    <AbsoluteFill>
      <PromoBackground mode="light" />
      {/* Same flex-column, centered-on-both-axes pattern as SceneShell's center-stage
          layout (text block, then visual stage, both centered) — no more hand-measured
          absolute offsets that silently drift off the true frame center (Block 6). */}
      <AbsoluteFill
        style={{
          padding: `${theme.safeArea.y}px ${theme.safeArea.x}px`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 68,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 第三屏文字：理念 + reveal caption */}
        <div style={{ width: "100%", maxWidth: LAYOUT.textMaxWidth.topCenter, textAlign: "center" }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.1,
              fontWeight: 850,
              letterSpacing: 0,
              color: "#111827",
              opacity: ideaText,
              transform: `translateY(${(1 - ideaText) * 20}px)`,
            }}
          >
            {sceneCopy["nearer-concept"].headline.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 42,
              lineHeight: 1.25,
              fontWeight: 720,
              letterSpacing: 0,
              color: "#334155",
              opacity: revealText,
              transform: `translateY(${(1 - revealText) * 16}px)`,
            }}
          >
            {sceneCopy["nearer-concept"].caption || "Ringflow 出现在光标旁边。"}
          </div>
        </div>

        {/* 桌面上下文 + 真实使用场景中的召唤：文档在左，轮盘在右，整组居中 */}
        <div
          style={{
            position: "relative",
            width: GROUP_WIDTH,
            height: GROUP_HEIGHT,
            pointerEvents: "none",
          }}
        >
          {/* Active document window — fixed size, consistent with layout rules */}
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <MacWindow title="项目计划.md" width={420} height={280}>
              <div style={{ fontSize: 16, lineHeight: 1.65, color: "#334155" }}>
                订阅状态刷新需要处理 loading、error、过期三种情况。<br />
                <span style={{ background: "rgba(47,127,211,0.18)", padding: "1px 5px", borderRadius: 3 }}>下次同步前确认三件事</span> 已记录在会议纪要中。
              </div>
            </MacWindow>
          </div>

          {/* Wheel — hero size via helper, placed right of document using more predictable offset */}
          <div
            style={{
              position: "absolute",
              left: 360,
              top: 35,
              opacity: wheelOpacity * finalHold,
              ...getWheelWrapperStyle('hero'),
              transform: `scale(${wheelScale})`,
              transformOrigin: "center",
            }}
          >
            <RingflowWheel
              activeSegment="quick-input"
              centerLabel="Ringflow"
              showCursorReveal={false}
              revealProgress={wheelReveal}
              glowProgress={highlight}
            />
          </div>

          {/* Cursor inside the document, in the SAME local coordinate space as the
              document (0,0) and wheel (360,35) above — was previously computed from
              full-canvas center coordinates, which pushed it off to the frame edge
              and made it effectively invisible (Block 6 fix). */}
          <div style={{ position: "absolute", left: 0, top: 0, opacity: cursorReveal * finalHold }}>
            <Cursor x={cursorX} y={cursorY} scale={0.95} trail={trail} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
