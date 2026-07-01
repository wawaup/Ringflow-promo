import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PromoBackground } from "../components/Background/PromoBackground";
import { Cursor } from "../components/Cursor/Cursor";
import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";

const scene = scenes.find((item) => item.id === "nearer-concept")!;

const reveal = (frame: number, start: number, duration = 28) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export const NearerConceptScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
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

  const cx = width / 2;
  const cy = height / 2;

  // Center the gesture area (wheel + cursor movement) in the middle of screen
  const wheelCenterX = cx - 80;
  const wheelCenterY = cy + 80;

  // Cursor starts inside the document window area, ends near where wheel is summoned
  const cursorStartX = cx - 60;
  const cursorStartY = cy + 50;
  const cursorEndX = cx + 110;   // near the summoned wheel (inside/edge of document)
  const cursorEndY = cy + 20;

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
      <AbsoluteFill
        style={{
          display: "grid",
          placeItems: "center",
          padding: "60px 120px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 1400,
            height: 800,
          }}
        >
          {/* 第三屏文字：理念 */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 0,
              width: "100%",
              textAlign: "center",
              opacity: ideaText,
              transform: `translateY(${(1 - ideaText) * 20}px)`,
            }}
          >
            <div
              style={{
                fontSize: 92,
                lineHeight: 1.1,
                fontWeight: 850,
                letterSpacing: 0,
                color: "#111827",
              }}
            >
              {sceneCopy["nearer-concept"].headline.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>

          {/* Reveal text - sourced */}
          <div
            style={{
              position: "absolute",
              top: 200,
              left: 0,
              width: "100%",
              textAlign: "center",
              opacity: revealText,
              transform: `translateY(${(1 - revealText) * 16}px)`,
            }}
          >
            <div
              style={{
                fontSize: 42,
                lineHeight: 1.25,
                fontWeight: 720,
                letterSpacing: 0,
                color: "#334155",
              }}
            >
              {sceneCopy["nearer-concept"].caption || "Ringflow 出现在光标旁边。"}
            </div>
          </div>

          {/* 桌面上下文 + 真实使用场景中的召唤：文档窗口内光标，Ringflow 在光标旁弹出 (hero identity moment) */}
          <div
            style={{
              position: "absolute",
              left: wheelCenterX - 280,
              top: wheelCenterY - 210,
              width: 660,
              height: 500,
              pointerEvents: "none",
            }}
          >
            {/* Active document window — shows real usage context */}
            <div style={{ position: "absolute", left: 20, top: 50 }}>
              <MacWindow title="项目计划.md" width={440} height={300}>
                <div style={{ fontSize: 16, lineHeight: 1.65, color: "#334155" }}>
                  订阅状态刷新需要处理 loading、error、过期三种情况。<br />
                  <span style={{ background: "rgba(47,127,211,0.18)", padding: "1px 5px", borderRadius: 3 }}>下次同步前确认三件事</span> 已记录在会议纪要中。
                </div>
              </MacWindow>
            </div>

            {/* Wheel summoned right next to cursor position — the product itself, hero size */}
            <div
              style={{
                position: "absolute",
                left: 300,
                top: 70,
                opacity: wheelOpacity * finalHold,
                transform: `scale(${wheelScale * 1.15})`,
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

            {/* Cursor inside the document, approaching summon position */}
            <div style={{ opacity: cursorReveal * finalHold }}>
              <Cursor x={cursorX} y={cursorY} scale={0.95} trail={trail.map((point) => ({
                ...point,
                x: point.x - (wheelCenterX - 280),
                y: point.y - (wheelCenterY - 210),
              }))} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
