import { interpolate, useCurrentFrame } from "remotion";
import { MacPointer, MiddleClickCursor } from "../components/Cursor/Cursor";
import { TrackpadHint } from "../components/Promo/TrackpadHint";
import { FONT_STACK } from "../components/Text/PromoText";
import { Toast } from "../components/Toast/Toast";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sectorMidAngle } from "../components/Wheel/wheelGeometry";
import { sceneCopy } from "../config/copy";
import { getWheelWrapperStyle } from "../config/layout";
import { EASE_TRAVEL, ease01, textExit } from "../config/motion";
import { theme } from "../config/theme";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "gesture")!;

const STAGE_WIDTH = 1360;
const DEMO_STAGE_HEIGHT = 470;
const WHEEL_BOX = 292;
/** ENE sector (index 1, mid-angle −22.5°) — matches the up-right slide. */
const TARGET_SECTOR = 1;
/** Diagonal (up-right) slide that summons the wheel (px) — long enough to
 * read as clearly as the trackpad demo, still far from the wheel itself. */
const SUMMON_SLIDE = 118;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Shot 4 — 核心手势教学。
 * Header asks "如何唤醒？". The mouse demo runs the full beat cycle in sync
 * with the three lit words: the cursor holds still, the middle button sinks
 * in and lights up (按住拖动), a tiny up-right nudge spins the wheel in and,
 * joystick-style, lights the matching sector (移向目标); on 松手执行 the
 * middle button un-highlights, the mouse pops back up, the wheel collapses
 * with the app's fan-dismiss, and a small "动作已执行" toast lands. A small
 * mac pointer rides just above the mouse the whole time, showing the on-screen
 * cursor following the physical mouse. Then the enlarged trackpad demo takes
 * the same slot.
 */
export const GestureScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const copy = sceneCopy.gesture;
  const words = copy.headline;
  const wordFrames = c.wordFrames ?? [64, 104, 190];

  const press = c.pressStartFrame ?? 64;
  const swipe = c.swipeStartFrame ?? press + 28;
  const wheelStart = c.wheelStartFrame ?? swipe + 6;
  const release = c.releaseFrame ?? 190;
  const trackpadStart = c.trackpadHintFrame ?? 320;
  /** Mouse demo clears the stage before the trackpad takes the slot. */
  const mouseExitStart = trackpadStart - 34;

  // Wheel sits far up-right of the mouse — clearly separate positions, so
  // even with the longer slide the mouse never crowds or covers the wheel.
  const wheelCenter = { x: STAGE_WIDTH / 2 + 330, y: DEMO_STAGE_HEIGHT / 2 - 15 };
  const pressPoint = { x: STAGE_WIDTH / 2 - 210, y: DEMO_STAGE_HEIGHT / 2 + 125 };

  const cursorIn = ease01(frame, c.visualStartFrame, 22);

  // Joystick logic: the slide direction IS the selection — cursor nudges along
  // the target sector's mid-angle, and that sector lights up as it moves.
  const slideAngle = sectorMidAngle(TARGET_SECTOR, 8);
  const slide = interpolate(frame, [swipe, swipe + 30], [0, 1], { ...CLAMP, easing: EASE_TRAVEL });
  // On release the mouse pops back up: a quick upward bounce that settles.
  const releaseBounce = interpolate(frame, [release, release + 8, release + 22], [0, -8, 0], CLAMP);
  const cursorX = pressPoint.x + Math.cos(slideAngle) * SUMMON_SLIDE * slide;
  const cursorY = pressPoint.y + Math.sin(slideAngle) * SUMMON_SLIDE * slide + releaseBounce;

  // Middle button: sink in (dip + squish + highlight), stay held, then
  // un-highlight and pop back out on 松手执行.
  const pressProgress = interpolate(frame, [press, press + 12, release, release + 10], [0, 1, 1, 0], CLAMP);

  // Wheel rotates in while the slide happens.
  const wheelSpin = ease01(frame, wheelStart, 44);
  const wheelSpinDeg = interpolate(wheelSpin, [0, 1], [-16, 0]);

  // App-style fan dismiss: reversing the reveal collapses the sectors back
  // into the center, exactly like the real overlay going away.
  const wheelIn = ease01(frame, wheelStart, 24);
  const wheelDismiss = ease01(frame, release + 6, 20);
  const wheelReveal = wheelIn * (1 - wheelDismiss);

  const highlightOn = slide > 0.4 && wheelDismiss < 0.35 ? TARGET_SECTOR : null;
  const sectorGlow = interpolate(slide, [0.4, 1], [0, 1], CLAMP) * (1 - wheelDismiss);

  // Confirmation toast lands where the wheel just vanished.
  const toastIn = ease01(frame, release + 26, 20);

  // Words/title must clear the frame before the crossfade into umbrella's headline.
  const textOpacity = textExit(frame, scene.durationInFrames, scene.overlapWithNextFrames);
  const titleReveal = ease01(frame, c.textStartFrame, 24);

  // Sequential demos: mouse block fades out, trackpad block fades in at the same slot.
  const mouseDemoOpacity = interpolate(frame, [mouseExitStart, mouseExitStart + 22], [1, 0], CLAMP);
  const trackpadIn = ease01(frame, trackpadStart, 24);

  // One-line callouts, each visible only while its demo plays.
  const mouseCalloutOpacity =
    interpolate(frame, [c.visualStartFrame, c.visualStartFrame + 20], [0, 1], CLAMP) *
    mouseDemoOpacity *
    textOpacity;
  const trackpadCalloutOpacity = trackpadIn * textOpacity;

  const calloutStyle = {
    position: "absolute" as const,
    left: 0,
    top: DEMO_STAGE_HEIGHT / 2 - 21,
    fontSize: 30,
    fontWeight: 650,
    color: theme.colors.muted,
    whiteSpace: "nowrap" as const,
  };

  return (
    <SceneShell scene={scene} hideText stageWidth={STAGE_WIDTH} stageHeight={780} pushIn={0.024}>
      <div
        style={{
          width: STAGE_WIDTH,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          fontFamily: FONT_STACK,
        }}
      >
        {/* The question — same size as the beat words, brand gradient instead of ink */}
        <div
          style={{
            fontSize: 84,
            fontWeight: 780,
            letterSpacing: "-0.01em",
            backgroundImage: theme.gradients.headlineLight,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            opacity: titleReveal * textOpacity,
            transform: `translateY(${(1 - titleReveal) * 18}px)`,
          }}
        >
          {copy.title}
        </div>

        {/* Three teaching beats, lit word by word — the "how" */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 34 }}>
          {words.map((word, index) => {
            // Title reads first (a full beat), then each phrase enters in order —
            // 34f apart so every step registers before the next appears.
            const baseIn = ease01(frame, c.textStartFrame + 34 + index * 34, 24);
            const lit = ease01(frame, wordFrames[index], 18);
            return (
              <div key={word} style={{ display: "flex", alignItems: "baseline", gap: 34 }}>
                {index > 0 ? (
                  <span
                    style={{
                      fontSize: 56,
                      fontWeight: 500,
                      color: theme.colors.muted,
                      opacity: baseIn * 0.4 * textOpacity,
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
                    opacity: baseIn * (0.34 + lit * 0.66) * textOpacity,
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

        {/* One shared, text-free demo slot: mouse summon first, trackpad takes over after */}
        <div style={{ position: "relative", width: STAGE_WIDTH, height: DEMO_STAGE_HEIGHT }}>
          {/* One-line callouts on the far left, swapped per demo — generous gap to the animation */}
          <div style={{ ...calloutStyle, opacity: mouseCalloutOpacity }}>{copy.mouseCallout}</div>
          <div style={{ ...calloutStyle, opacity: trackpadCalloutOpacity }}>{copy.trackpadCallout}</div>

          {/* ——— Mouse demo: stay put → middle click sinks in → tiny up-right nudge →
                wheel spins in → release pops back → wheel fan-dismisses → toast ——— */}
          <div style={{ position: "absolute", inset: 0, opacity: mouseDemoOpacity }}>
            <div
              style={{
                position: "absolute",
                left: wheelCenter.x - WHEEL_BOX / 2,
                top: wheelCenter.y - WHEEL_BOX / 2,
                ...getWheelWrapperStyle("standard"),
                rotate: `${wheelSpinDeg}deg`,
              }}
            >
              <RingflowWheel
                revealFrame={wheelStart}
                revealProgress={wheelReveal}
                pulseFrame={wheelStart + 22}
                highlightIndex={highlightOn}
                glowProgress={sectorGlow}
                centerLabel="Ringflow"
              />
            </div>

            <MiddleClickCursor
              x={cursorX}
              y={cursorY}
              pressProgress={pressProgress}
              revealProgress={cursorIn}
              swipeAngle={(slideAngle * 180) / Math.PI}
              swipeProgress={interpolate(frame, [swipe - 6, swipe + 6, swipe + 30, swipe + 44], [0, 1, 1, 0], CLAMP)}
              scale={2.2}
            />
            {/* The on-screen cursor rides just above the mouse, moving in lockstep with it */}
            <MacPointer x={cursorX} y={cursorY - 100} scale={1.3} opacity={cursorIn} />

            {/* Confirmation where the wheel just vanished */}
            <div
              style={{
                position: "absolute",
                left: wheelCenter.x - 110,
                top: wheelCenter.y - 26,
                opacity: toastIn,
                transform: `translateY(${(1 - toastIn) * 12}px)`,
              }}
            >
              <Toast text="动作已执行" mode="light" />
            </div>
          </div>

          {/* ——— Trackpad demo: same slot, enlarged ——— */}
          <div
            style={{
              position: "absolute",
              left: STAGE_WIDTH / 2 + 120,
              top: DEMO_STAGE_HEIGHT / 2,
              transform: `translate(-50%, -50%) scale(1.55) translateY(${(1 - trackpadIn) * 16}px)`,
              opacity: trackpadIn * textOpacity,
            }}
          >
            <TrackpadHint startFrame={trackpadStart + 6} />
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
