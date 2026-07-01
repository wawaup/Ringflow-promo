import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PromoBackground } from "../components/Background/PromoBackground";
import { Cursor } from "../components/Cursor/Cursor";
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
  const wheelCenterX = cx - 80; // slightly left for balance with text
  const wheelCenterY = cy + 80; // lower part below text

  const cursorStartX = cx + 180;
  const cursorStartY = cy + 150;
  const cursorEndX = wheelCenterX + 60;
  const cursorEndY = wheelCenterY - 40;

  const cursorX = interpolate(cursorT, [0, 1], [cursorStartX, cursorEndX]);
  const cursorY = interpolate(cursorT, [0, 1], [cursorStartY, cursorEndY]);

  const wheelOpacity = interpolate(wheelReveal, [0, 1], [0, 1]);
  const wheelScale = interpolate(wheelReveal, [0, 1], [0.82, 1]);

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

          {/* 第四屏内容放在下方：Ringflow 出现在光标旁 + 轮盘动画 */}
          <div
            style={{
              position: "absolute",
              top: 220,
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
              Ringflow
              <br />
              出现在光标旁边。
            </div>
          </div>

          {/* 居中的轮盘 + 光标执行区域 */}
          <div
            style={{
              position: "absolute",
              left: wheelCenterX - 200,
              top: wheelCenterY - 160,
              width: 520,
              height: 420,
              pointerEvents: "none",
            }}
          >
            {/* Wheel - stays visible after reveal */}
            <div
              style={{
                position: "absolute",
                left: 100,
                top: 80,
                opacity: wheelOpacity * finalHold,
                transform: `scale(${wheelScale})`,
                transformOrigin: "center",
              }}
            >
              <RingflowWheel
                activeSegment="quick-input"
                centerLabel="Ringflow"
                showCursorReveal={false}
                revealProgress={wheelReveal}
              />
            </div>

            {/* Cursor approaching the wheel - centered gesture */}
            <div style={{ opacity: cursorReveal * finalHold }}>
              <Cursor x={cursorX} y={cursorY} scale={1.0} trail={trail.map((point) => ({
                ...point,
                x: point.x - (wheelCenterX - 200),
                y: point.y - (wheelCenterY - 160),
              }))} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
