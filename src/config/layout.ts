/**
 * Ringflow Promo - Layout Discipline Constants
 * 
 * Centralized rules for consistent sizing, positioning, and alignment.
 * No more arbitrary absolute shifts or variable sizes.
 * 
 * Wheel roles:
 * - hero: Reveal and core gesture scenes (prominent, near cursor in context)
 * - standard: Feature scenes (balanced with workspace)
 * - mini: Supporting indicators only
 * 
 * Text alignment:
 * - left-stage: left aligned, fixed headline size
 * - top-stage / center-stage: center aligned, slightly scaled
 */

export const LAYOUT = {
  // Canvas
  width: 1920,
  height: 1080,

  // Safe margins
  safeAreaX: 120,
  safeAreaY: 110,

  // Wheel sizes (diameter in px, applied via scale in component)
  wheel: {
    hero: 300,      // Large for reveal / core teaching
    standard: 220,  // Most feature scenes
    mini: 130,      // Side indicators
  },

  // Text sizes (base, SceneShell can scale)
  text: {
    headline: 88,
    caption: 44,
    label: 32,
    small: 24,
    // For top-stage (scaled down for density)
    headlineTop: 64,
    captionTop: 32,
  },

  // Stage dimensions (for children containers)
  stage: {
    left: { width: 700, height: 600 },
    top: { width: 1320, height: 610 },
    center: { width: 1320, height: 610 },
  },

  // Wheel placement rules (relative to stage/content)
  wheelPlacement: {
    // In left-stage: right of text area, vertically centered-ish
    leftStage: { right: 40, top: '30%' },
    // In top-stage: below text, centered or right
    topStage: { bottom: -20, right: 20 },
    // In center: below or integrated with cursor
    centerStage: { bottom: 60, left: '50%' },
  },

  // Fixed paddings and gaps
  gap: 60,
  padding: 20,

  // Max widths for text containers
  textMaxWidth: {
    left: 700,
    topCenter: 1320,
  },
} as const;

export type LayoutRole = 'hero' | 'standard' | 'mini';
export type SceneLayout = 'left-stage' | 'top-stage' | 'center-stage';

/**
 * LAYOUT DISCIPLINE RULES (per Block 3):
 * - hero: NearerConcept + CoreGesture (prominent, ~300px visual, near cursor in context)
 * - standard: Most feature scenes (Quick*, Sticky, Macro, Shell, Monitor, etc.) — non-mini
 * - mini: ONLY for side indicators or when space extremely tight (never default for feature demos)
 *
 * Always prefer importing LAYOUT and using wheel sizes + placement rules.
 * Avoid magic left/top/right numbers. Use relative positioning or these constants.
 */
export const WHEEL_SIZE = {
  hero: 300,
  standard: 220,
  mini: 130,
} as const;

export function getWheelPlacementStyle(sceneLayout: SceneLayout, role: LayoutRole = 'standard') {
  const base = { position: 'absolute' as const };
  if (sceneLayout === 'left-stage') {
    return { ...base, right: 40, top: '28%' };
  }
  if (sceneLayout === 'center-stage') {
    return { ...base, bottom: 50, left: '52%', transform: 'translateX(-50%)' };
  }
  // top-stage default
  return { ...base, bottom: -18, right: 18 };
}

/**
 * Recommended container width/scale for RingflowWheel by role.
 * Use with <RingflowWheel ... /> wrapped in div with this style.
 */
export function getWheelWrapperStyle(role: LayoutRole) {
  const diameter = role === 'hero' ? 300 : role === 'standard' ? 220 : 130;
  const scale = role === 'hero' ? 1.05 : role === 'standard' ? 1.0 : 0.72;
  return {
    width: diameter,
    height: diameter,
    transform: `scale(${scale})`,
    transformOrigin: 'center',
  } as const;
}

/**
 * Canonical layout for the "hold + drag right, wheel emerges" hero gesture
 * (Block 6). Guarantees, by construction:
 * - The wheel is anchored to the right of the stage's horizontal center.
 * - The cursor starts to the left and travels rightward toward the wheel.
 * - The combined bounding box of (cursor start -> wheel) is centered on
 *   both axes within the given stage box, so callers never need magic
 *   left/top offsets to "eyeball" centering.
 */
export function getHeroGestureLayout(
  stageWidth: number,
  stageHeight: number,
  opts?: { wheelOffsetX?: number; approachMargin?: number; verticalDrift?: number }
) {
  const wheelSize = WHEEL_SIZE.hero;
  const wheelVisual = wheelSize * 1.05; // matches getWheelWrapperStyle('hero') scale
  const wheelOffsetX = opts?.wheelOffsetX ?? 140;
  const approachMargin = opts?.approachMargin ?? 40;
  const verticalDrift = opts?.verticalDrift ?? 15;

  const centerX = stageWidth / 2;
  const centerY = stageHeight / 2;

  const wheelCenter = { x: centerX + wheelOffsetX, y: centerY };
  // Mirrors wheelCenter across centerX so the full (cursorStart..wheel-edge)
  // span is centered on centerX.
  const cursorStart = { x: stageWidth - wheelCenter.x - wheelVisual / 2, y: centerY + verticalDrift };
  const cursorEnd = { x: wheelCenter.x - wheelVisual / 2 - approachMargin, y: centerY - verticalDrift };

  return { wheelCenter, cursorStart, cursorEnd, wheelSize, wheelVisual, centerX, centerY };
}