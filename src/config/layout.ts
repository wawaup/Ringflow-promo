/**
 * Ringflow Promo — Layout discipline.
 *
 * The wheel is the protagonist: sizes are large enough to read every sector
 * label on a 1920×1080 canvas. All stages center their content; no magic
 * per-scene absolute offsets.
 */
import { wheelConfig } from "./wheel";

export const LAYOUT = {
  width: 1920,
  height: 1080,

  safeAreaX: 120,
  safeAreaY: 100,

  /**
   * Target visual diameter of the MAIN ring (px).
   * hero: reveal / gesture teaching moments.
   * standard: feature beats and config scenes.
   * mini: supporting indicator only.
   */
  wheel: {
    hero: 470,
    standard: 360,
    mini: 220,
  },

  text: {
    hero: 132,
    headline: 96,
    caption: 40,
    label: 30,
    small: 24,
    // Feature-run beats (denser stage)
    headlineBeat: 72,
    captionBeat: 34,
  },

  stage: {
    left: { width: 760, height: 640 },
    top: { width: 1440, height: 640 },
    center: { width: 1440, height: 660 },
  },

  gap: 60,

  textMaxWidth: {
    left: 720,
    topCenter: 1400,
  },
} as const;

export type LayoutRole = "hero" | "standard" | "mini";
export type SceneLayout = "left-stage" | "top-stage" | "center-stage";

/** Intrinsic pixel size RingflowWheel renders at (main ring only, default padding). */
const WHEEL_INTRINSIC = wheelConfig.overlayOuterRadius * 2 + 18 * 2;

export const WHEEL_SIZE = LAYOUT.wheel;

/**
 * Wrapper style that scales RingflowWheel so its MAIN ring reads at the target
 * diameter for the role. The folder outer ring (when shown) extends beyond the
 * box — wrap in a `display:grid; placeItems:center` parent with overflow visible.
 */
export function getWheelWrapperStyle(role: LayoutRole) {
  const target = LAYOUT.wheel[role];
  const scale = target / WHEEL_INTRINSIC;
  return {
    width: WHEEL_INTRINSIC,
    height: WHEEL_INTRINSIC,
    scale: String(scale),
    transformOrigin: "center",
    display: "grid",
    placeItems: "center",
  } as const;
}

/** Numeric scale factor for a role (for callers composing their own transforms). */
export function getWheelScale(role: LayoutRole): number {
  return LAYOUT.wheel[role] / WHEEL_INTRINSIC;
}

/**
 * Canonical layout for the "hold + drag, wheel emerges" hero gesture:
 * wheel anchored right of center, cursor travels in from the left, whole
 * group centered inside the given stage box.
 */
export function getHeroGestureLayout(
  stageWidth: number,
  stageHeight: number,
  opts?: { wheelOffsetX?: number; approachMargin?: number; verticalDrift?: number },
) {
  const wheelVisual = LAYOUT.wheel.hero;
  const wheelOffsetX = opts?.wheelOffsetX ?? 180;
  const approachMargin = opts?.approachMargin ?? 48;
  const verticalDrift = opts?.verticalDrift ?? 16;

  const centerX = stageWidth / 2;
  const centerY = stageHeight / 2;

  const wheelCenter = { x: centerX + wheelOffsetX, y: centerY };
  const cursorStart = { x: stageWidth - wheelCenter.x - wheelVisual / 2, y: centerY + verticalDrift };
  const cursorEnd = { x: wheelCenter.x - wheelVisual / 2 - approachMargin, y: centerY - verticalDrift };

  return { wheelCenter, cursorStart, cursorEnd, wheelSize: wheelVisual, wheelVisual, centerX, centerY };
}
