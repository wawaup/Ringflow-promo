import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { assets } from "../config/assets";
import { getWheelScale } from "../config/layout";
import { EASE, EASE_TRAVEL, ease01 } from "../config/motion";
import { scenes } from "../config/timeline";
import { wheelConfig } from "../config/wheel";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "reveal")!;

const STAGE_WIDTH = 1240;
const STAGE_HEIGHT = 560;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** app.png intrinsic 2666×1620 — keep the aspect so preview-fraction math stays exact. */
const SHOT_ASPECT = 1620 / 2666;
const SHOT_WIDTH = 880;
const SHOT_HEIGHT = SHOT_WIDTH * SHOT_ASPECT; // ≈ 535
const SHOT_LEFT = (STAGE_WIDTH - SHOT_WIDTH) / 2;
const SHOT_TOP = (STAGE_HEIGHT - SHOT_HEIGHT) / 2;
const SHOT_CENTER = { x: STAGE_WIDTH / 2, y: SHOT_TOP + SHOT_HEIGHT / 2 };

/**
 * Where the wheel-preview circle sits inside app.png, measured as fractions of
 * the image (center x/y of the circle, and its diameter relative to width).
 * The animated wheel lands exactly on top of this preview.
 */
const PREVIEW_CX = 0.7735;
const PREVIEW_CY = 0.611;
const PREVIEW_DIAMETER_FRAC = 0.265;

const PREVIEW_POINT = {
  x: SHOT_LEFT + PREVIEW_CX * SHOT_WIDTH,
  y: SHOT_TOP + PREVIEW_CY * SHOT_HEIGHT,
};
/** RingflowWheel intrinsic box (main ring), for computing the landing scale. */
const WHEEL_INTRINSIC = wheelConfig.overlayOuterRadius * 2 + 18 * 2;
/** Scale against the visible RING diameter (not the padded box) so the ring's
 * edge lands exactly on the preview circle's edge. */
const PREVIEW_WHEEL_SCALE = (PREVIEW_DIAMETER_FRAC * SHOT_WIDTH) / (wheelConfig.overlayOuterRadius * 2);

const CENTER = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };

/**
 * Shot 3 — 亮相（hero moment）。
 * Order of appearance: the brand line ("Ringflow · 围绕光标的快捷操作轮盘")
 * lands first, then the wheel rotates in fully formed at stage center. As the
 * wheel shrinks, the app screenshot expands from a tiny point to its final
 * (slightly enlarged, centered) size, and the wheel travels to overlap the
 * wheel-preview panel inside the app UI — the demo literally docks into the
 * real product.
 */
export const RevealScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const wheelStart = c.wheelStartFrame ?? c.actionStartFrame;
  const rotateStart = c.wheelRotateFrame ?? wheelStart;
  const shrinkStart = c.wheelShrinkFrame ?? wheelStart + 116;

  const heroScale = getWheelScale("hero");

  const rotateProgress = ease01(frame, rotateStart, 90);
  const rotateDeg = interpolate(rotateProgress, [0, 1], [-18, 0]);

  // One shared progress drives both the wheel docking and the screenshot pop —
  // they read as a single "hand off to the real app" move.
  const dock = interpolate(frame, [shrinkStart, shrinkStart + 76], [0, 1], {
    ...CLAMP,
    easing: EASE_TRAVEL,
  });

  // Screenshot: expands from a near-point at its own center to full size.
  const shotScale = interpolate(dock, [0, 1], [0.02, 1], { easing: EASE });
  const shotOpacity = interpolate(dock, [0, 0.18], [0, 1], CLAMP);

  // The preview circle's live stage position while the screenshot is mid-scale.
  const previewNow = {
    x: SHOT_CENTER.x + (PREVIEW_POINT.x - SHOT_CENTER.x) * shotScale,
    y: SHOT_CENTER.y + (PREVIEW_POINT.y - SHOT_CENTER.y) * shotScale,
  };
  const wheelX = interpolate(dock, [0, 1], [CENTER.x, 0]) + previewNow.x * dock;
  const wheelY = interpolate(dock, [0, 1], [CENTER.y, 0]) + previewNow.y * dock;
  const wheelScale = interpolate(dock, [0, 1], [heroScale, PREVIEW_WHEEL_SCALE]);

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
        {/* App UI — pops open from a point, settling centered and slightly enlarged. */}
        <div
          style={{
            position: "absolute",
            left: SHOT_LEFT,
            top: SHOT_TOP,
            width: SHOT_WIDTH,
            height: SHOT_HEIGHT,
            opacity: shotOpacity,
            transform: `scale(${shotScale})`,
            transformOrigin: "center",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 30px 70px rgba(10,20,45,0.28)",
          }}
        >
          <Img src={staticFile(assets.brand.appScreenshot)} style={{ display: "block", width: "100%" }} />
        </div>

        {/* The wheel — rotates in centered, then docks onto the in-app preview circle. */}
        <div
          style={{
            position: "absolute",
            left: wheelX,
            top: wheelY,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{
              width: WHEEL_INTRINSIC,
              height: WHEEL_INTRINSIC,
              display: "grid",
              placeItems: "center",
              transformOrigin: "center",
              scale: String(wheelScale),
              rotate: `${rotateDeg}deg`,
            }}
          >
            <RingflowWheel
              revealFrame={wheelStart}
              pulseFrame={wheelStart + 26}
              centerLabel="Ringflow"
              showSegmentStagger={false}
            />
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
