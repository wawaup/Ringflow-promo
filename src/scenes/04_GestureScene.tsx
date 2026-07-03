import { interpolate, useCurrentFrame } from "remotion";
import { MiddleClickCursor } from "../components/Cursor/Cursor";
import { TrackpadHint } from "../components/Promo/TrackpadHint";
import { FONT_STACK } from "../components/Text/PromoText";
import { Toast } from "../components/Toast/Toast";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sectorMidAngle } from "../components/Wheel/wheelGeometry";
import { sceneCopy } from "../config/copy";
import { LAYOUT, getWheelWrapperStyle } from "../config/layout";
import { EASE_TRAVEL, ease01, textExit } from "../config/motion";
import { theme } from "../config/theme";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "gesture")!;

const STAGE_WIDTH = 1360;
const WHEEL_STAGE_HEIGHT = 430;
const WHEEL_BOX = 292;
/** 粘贴 sector (index 1) — where the cursor lands. */
const TARGET_SECTOR = 1;

/**
 * Shot 4 — 核心手势教学。
 * Three beats light up word by word — 按住拖动 · 移向目标 · 松手执行 —
 * while one full wheel cycle plays underneath: summon, aim at 粘贴,
 * release, done. Ends with the trackpad variant hint (⇧⌃).
 */
export const GestureScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const words = sceneCopy.gesture.headline;
  const wordFrames = c.wordFrames ?? [24, 140, 258];

  const press = c.pressStartFrame ?? c.actionStartFrame;
  const swipe = c.swipeStartFrame ?? press + 36;
  const wheelStart = c.wheelStartFrame ?? swipe + 12;
  const release = c.releaseFrame ?? 252;

  // Wheel sits right of stage center; cursor approaches from the left.
  const wheelCenter = { x: STAGE_WIDTH / 2 + 130, y: WHEEL_STAGE_HEIGHT / 2 };
  const wheelVisualRadius = LAYOUT.wheel.hero / 2;

  // Cursor: idle → press (beat 1) → travel into the 粘贴 sector (beat 2) → release (beat 3)
  const cursorIn = ease01(frame, c.visualStartFrame, 22);
  const approach = interpolate(frame, [swipe, swipe + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_TRAVEL,
  });
  const aim = interpolate(frame, [c.wheelHighlightStartFrame ?? 150, (c.wheelHighlightStartFrame ?? 150) + 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_TRAVEL,
  });

  const targetAngle = sectorMidAngle(TARGET_SECTOR, 8);
  const summonPoint = { x: wheelCenter.x - wheelVisualRadius - 56, y: wheelCenter.y + 18 };
  const startPoint = { x: summonPoint.x - 300, y: summonPoint.y + 26 };
  // 无界触发: the cursor ends OUTSIDE the ring, still selecting by direction —
  // shows off the real app's unbounded trigger and keeps sector labels clear.
  const aimPoint = {
    x: wheelCenter.x + Math.cos(targetAngle) * wheelVisualRadius * 1.22,
    y: wheelCenter.y + Math.sin(targetAngle) * wheelVisualRadius * 1.22,
  };
  const cursorX = interpolate(approach, [0, 1], [startPoint.x, summonPoint.x]) + (aimPoint.x - summonPoint.x) * aim;
  const cursorY = interpolate(approach, [0, 1], [startPoint.y, summonPoint.y]) + (aimPoint.y - summonPoint.y) * aim;

  const pressProgress = interpolate(frame, [press, press + 12, release, release + 14], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const releaseProgress = interpolate(frame, [release, release + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const highlightOn =
    frame >= (c.wheelHighlightStartFrame ?? 150) + 14 ? TARGET_SECTOR : null;
  const sectorGlow = interpolate(
    frame,
    [c.wheelHighlightStartFrame ?? 150, (c.wheelHighlightEndFrame ?? 216) - 20, release, release + 18],
    [0, 1, 1, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Words must clear the frame before the crossfade into umbrella's headline —
  // two headlines mid-dissolve in the same slot read as garbled glyphs.
  const wordsOpacity = textExit(frame, scene.durationInFrames, scene.overlapWithNextFrames);

  const trackpadStart = c.trackpadHintFrame ?? 330;
  // Toast lands after release, then clears the stage before the trackpad hint.
  const toastIn = ease01(frame, release + 8, 22);
  const toastOut = interpolate(frame, [trackpadStart - 14, trackpadStart], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell scene={scene} hideText stageWidth={STAGE_WIDTH} stageHeight={720} pushIn={0.024}>
      <div
        style={{
          width: STAGE_WIDTH,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          fontFamily: FONT_STACK,
        }}
      >
        {/* Three teaching beats, lit word by word */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 34 }}>
          {words.map((word, index) => {
            const baseIn = ease01(frame, c.textStartFrame + index * 6, 24);
            const lit = ease01(frame, wordFrames[index], 18);
            return (
              <div key={word} style={{ display: "flex", alignItems: "baseline", gap: 34 }}>
                {index > 0 ? (
                  <span
                    style={{
                      fontSize: 56,
                      fontWeight: 500,
                      color: theme.colors.muted,
                      opacity: baseIn * 0.4 * wordsOpacity,
                    }}
                  >
                    ·
                  </span>
                ) : null}
                <span
                  style={{
                    fontSize: 84,
                    fontWeight: 760,
                    letterSpacing: "-0.01em",
                    color: lit > 0.5 ? theme.colors.ink : theme.colors.muted,
                    opacity: baseIn * (0.34 + lit * 0.66) * wordsOpacity,
                    display: "inline-block",
                    transform: `translateY(${(1 - baseIn) * 24}px) scale(${0.985 + lit * 0.015})`,
                  }}
                >
                  {word}
                </span>
              </div>
            );
          })}
        </div>

        {/* One full gesture cycle */}
        <div style={{ position: "relative", width: STAGE_WIDTH, height: WHEEL_STAGE_HEIGHT }}>
          <div
            style={{
              position: "absolute",
              left: wheelCenter.x - WHEEL_BOX / 2,
              top: wheelCenter.y - WHEEL_BOX / 2,
              ...getWheelWrapperStyle("hero"),
            }}
          >
            <RingflowWheel
              revealFrame={wheelStart}
              pulseFrame={wheelStart + 22}
              highlightIndex={highlightOn}
              glowProgress={sectorGlow}
              releaseProgress={releaseProgress * 0.8}
              centerLabel={releaseProgress > 0.4 ? "完成" : pressProgress > 0.5 ? "按住" : "Ringflow"}
            />
          </div>

          <MiddleClickCursor
            x={cursorX}
            y={cursorY}
            pressProgress={pressProgress}
            revealProgress={cursorIn}
            swipeAngle={(targetAngle * 180) / Math.PI}
            swipeProgress={interpolate(aim, [0, 0.25, 0.9, 1], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            scale={2.3 - aim * 0.5}
          />

          {/* Result toast under the wheel after release */}
          <div
            style={{
              position: "absolute",
              left: wheelCenter.x - 150,
              top: wheelCenter.y + wheelVisualRadius + 6,
              opacity: toastIn * toastOut,
              transform: `translateY(${(1 - toastIn) * 16}px)`,
            }}
          >
            <Toast text="已粘贴" mode="light" />
          </div>
        </div>

        {/* Trackpad variant */}
        <div style={{ height: 132, display: "flex", alignItems: "center" }}>
          <TrackpadHint startFrame={trackpadStart} />
        </div>
      </div>
    </SceneShell>
  );
};
