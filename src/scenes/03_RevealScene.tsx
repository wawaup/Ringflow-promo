import { interpolate, useCurrentFrame } from "remotion";
import { MiddleClickCursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { getHeroGestureLayout, getWheelWrapperStyle } from "../config/layout";
import { EASE_TRAVEL, ease01 } from "../config/motion";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "reveal")!;

const STAGE_WIDTH = 1240;
const STAGE_HEIGHT = 560;
/** Layout box of the (scaled) wheel wrapper — see getWheelWrapperStyle. */
const WHEEL_BOX = 292;

/**
 * Shot 3 — 亮相（hero moment）。
 * Hold the middle button, drag — the wheel blooms beside the cursor,
 * sector by sector. Only after the bloom settles does the brand land:
 * 「Ringflow — 围绕光标的快捷操作轮盘」(gradient headline via SceneShell).
 */
export const RevealScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const press = c.pressStartFrame ?? c.actionStartFrame;
  const swipe = c.swipeStartFrame ?? press + 24;
  const wheelStart = c.wheelStartFrame ?? swipe + 14;

  const layout = getHeroGestureLayout(STAGE_WIDTH, STAGE_HEIGHT);

  const cursorIn = ease01(frame, c.visualStartFrame, 22);
  const pressProgress = interpolate(frame, [press, press + 12, wheelStart + 60, wheelStart + 80], [0, 1, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const travel = interpolate(frame, [swipe, swipe + 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_TRAVEL,
  });
  const cursorX = interpolate(travel, [0, 1], [layout.cursorStart.x, layout.cursorEnd.x]);
  const cursorY = interpolate(travel, [0, 1], [layout.cursorStart.y, layout.cursorEnd.y]);

  const trailAlpha = interpolate(frame, [swipe + 6, swipe + 20, wheelStart + 50], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const trail =
    travel > 0.08
      ? [
          { x: cursorX - 46, y: cursorY + 16, opacity: trailAlpha * 0.55 },
          { x: cursorX - 86, y: cursorY + 30, opacity: trailAlpha * 0.3 },
          { x: cursorX - 122, y: cursorY + 42, opacity: trailAlpha * 0.14 },
        ]
      : [];

  return (
    <SceneShell
      scene={scene}
      gradient
      ambience={ease01(frame, wheelStart + 40, 60)}
      headlineSize={128}
      stageWidth={STAGE_WIDTH}
      stageHeight={STAGE_HEIGHT}
      pushIn={0.024}
    >
      <div style={{ position: "relative", width: STAGE_WIDTH, height: STAGE_HEIGHT }}>
        <div
          style={{
            position: "absolute",
            left: layout.wheelCenter.x - WHEEL_BOX / 2,
            top: layout.wheelCenter.y - WHEEL_BOX / 2,
            ...getWheelWrapperStyle("hero"),
          }}
        >
          <RingflowWheel
            revealFrame={wheelStart}
            pulseFrame={wheelStart + 26}
            centerLabel="Ringflow"
            showSegmentStagger
          />
        </div>

        <MiddleClickCursor
          x={cursorX}
          y={cursorY}
          pressProgress={pressProgress}
          revealProgress={cursorIn}
          swipeAngle={-16}
          swipeProgress={interpolate(travel, [0, 0.2, 0.9, 1], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          trail={trail}
          scale={2.6 - travel * 0.6}
        />
      </div>
    </SceneShell>
  );
};
