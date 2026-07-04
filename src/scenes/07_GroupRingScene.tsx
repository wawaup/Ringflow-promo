import { interpolate, useCurrentFrame } from "remotion";
import { MacPointer, MiddleClickCursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { SHOWCASE_SLOTS } from "../components/Wheel/siteWheelModel";
import { sectorMidAngle } from "../components/Wheel/wheelGeometry";
import { getWheelWrapperStyle } from "../config/layout";
import { EASE, EASE_TRAVEL, ease01 } from "../config/motion";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "group-ring")!;

const STAGE_WIDTH = 1240;
const STAGE_HEIGHT = 600;
const WHEEL_BOX = 292;
/** 提示词 group folder sector on the showcase wheel (mid-angle ≈ up-left). */
const FOLDER_SECTOR = 7;
/** Small up-left drift that selects the group sector (px). */
const DRIFT = 56;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Shot 7 — 分组外环（官网核心卖点，视觉最华丽的时刻）。
 * Same staging language as the gesture shot: the physical mouse (middle
 * button held) sits on the LEFT with the small mac pointer riding above it;
 * the wheel sits slightly right of center. The mouse drifts a little toward
 * the upper-left — joystick-style, the 提示词 group sector lights up — and
 * the outer ring blooms open, filling in the group's five prompt actions.
 */
export const GroupRingScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const expand = c.folderExpandFrame ?? 100;

  // Wheel right of center; mouse + pointer on the left, vertically settled
  // into the lower blank area of the stage.
  const wheelCenter = { x: STAGE_WIDTH / 2 + 150, y: STAGE_HEIGHT / 2 + 16 };
  const mouseBase = { x: STAGE_WIDTH / 2 - 330, y: STAGE_HEIGHT / 2 + 120 };

  // Small up-left drift along the folder sector's mid-angle — direction IS the selection.
  const folderAngle = sectorMidAngle(FOLDER_SECTOR, 8);
  const drift = interpolate(frame, [c.actionStartFrame, c.actionStartFrame + 28], [0, 1], {
    ...CLAMP,
    easing: EASE_TRAVEL,
  });
  const mouseX = mouseBase.x + Math.cos(folderAngle) * DRIFT * drift;
  const mouseY = mouseBase.y + Math.sin(folderAngle) * DRIFT * drift;
  const mouseIn = ease01(frame, c.visualStartFrame + 8, 22);

  const folderProgress = interpolate(frame, [expand, expand + 34], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  const folderRotation = interpolate(folderProgress, [0, 1], [-16, 0]);

  const folderHighlighted = drift > 0.45;
  const promptHighlight = frame >= (c.wheelHighlightStartFrame ?? 150) ? 1 : null;
  const glow = interpolate(
    frame,
    [c.wheelHighlightStartFrame ?? 150, (c.wheelHighlightEndFrame ?? 186) - 8],
    [0, 1],
    CLAMP,
  );

  return (
    <SceneShell scene={scene} stageWidth={STAGE_WIDTH} stageHeight={STAGE_HEIGHT} pushIn={0.026}>
      <div style={{ position: "relative", width: STAGE_WIDTH, height: STAGE_HEIGHT }}>
        <div
          style={{
            position: "absolute",
            left: wheelCenter.x - WHEEL_BOX / 2,
            top: wheelCenter.y - WHEEL_BOX / 2,
            ...getWheelWrapperStyle("standard"),
          }}
        >
          <RingflowWheel
            revealFrame={c.wheelStartFrame ?? c.visualStartFrame}
            mainSlots={SHOWCASE_SLOTS}
            highlightIndex={folderHighlighted ? FOLDER_SECTOR : null}
            showOuterRing
            folderProgress={folderProgress}
            folderRotation={folderRotation}
            folderHighlightIndex={promptHighlight}
            glowProgress={glow}
            centerLabel="提示词"
            appLabel="分组"
          />
        </div>

        {/* Physical mouse (middle held) + on-screen pointer riding above it */}
        <div style={{ position: "absolute", inset: 0, opacity: mouseIn }}>
          <MiddleClickCursor x={mouseX} y={mouseY} pressProgress={1} revealProgress={1} scale={2.0} />
          <MacPointer x={mouseX} y={mouseY - 92} scale={1.25} />
        </div>
      </div>
    </SceneShell>
  );
};
