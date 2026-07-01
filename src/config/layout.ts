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