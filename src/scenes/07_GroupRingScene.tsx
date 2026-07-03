import { interpolate, useCurrentFrame } from "remotion";
import { Cursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { SHOWCASE_SLOTS } from "../components/Wheel/siteWheelModel";
import { sectorMidAngle } from "../components/Wheel/wheelGeometry";
import { LAYOUT, getWheelWrapperStyle } from "../config/layout";
import { EASE, EASE_TRAVEL, ease01 } from "../config/motion";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "group-ring")!;

const STAGE_WIDTH = 1240;
const STAGE_HEIGHT = 600;
const WHEEL_BOX = 292;
/** 提示词 group folder sector on the showcase wheel. */
const FOLDER_SECTOR = 7;

/**
 * Shot 7 — 分组外环（官网核心卖点，视觉最华丽的时刻）。
 * The cursor hovers the 提示词 group sector — the outer ring blooms with the
 * app's five real default prompt actions. 「分组外环，装下更多。」
 */
export const GroupRingScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const expand = c.folderExpandFrame ?? 96;

  const wheelCenter = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 + 16 };
  const wheelRadius = LAYOUT.wheel.standard / 2;
  const folderAngle = sectorMidAngle(FOLDER_SECTOR, 8);

  // Cursor drifts from below-right into the folder sector, then holds (hover)
  const hover = interpolate(frame, [c.actionStartFrame - 30, c.actionStartFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_TRAVEL,
  });
  const hoverPoint = {
    x: wheelCenter.x + Math.cos(folderAngle) * wheelRadius * 0.74,
    y: wheelCenter.y + Math.sin(folderAngle) * wheelRadius * 0.74,
  };
  const cursorX = interpolate(hover, [0, 1], [wheelCenter.x + 210, hoverPoint.x]);
  const cursorY = interpolate(hover, [0, 1], [wheelCenter.y + 190, hoverPoint.y]);

  const folderProgress = interpolate(frame, [expand, expand + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const folderRotation = interpolate(folderProgress, [0, 1], [-16, 0]);

  const promptHighlight = frame >= (c.wheelHighlightStartFrame ?? 168) ? 1 : null;
  const glow = interpolate(
    frame,
    [c.wheelHighlightStartFrame ?? 168, (c.wheelHighlightEndFrame ?? 204) - 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
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
            highlightIndex={frame >= c.actionStartFrame ? FOLDER_SECTOR : null}
            showOuterRing
            folderProgress={folderProgress}
            folderRotation={folderRotation}
            folderHighlightIndex={promptHighlight}
            glowProgress={glow}
            centerLabel="提示词"
            appLabel="分组"
          />
        </div>

        <div style={{ position: "absolute", inset: 0, opacity: ease01(frame, c.visualStartFrame + 12, 20) }}>
          <Cursor x={cursorX} y={cursorY} scale={1.35} />
        </div>
      </div>
    </SceneShell>
  );
};
