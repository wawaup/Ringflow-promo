import { Easing, interpolate } from "remotion";

/**
 * Ringflow Promo — Motion language.
 *
 * One easing family for the whole film (same curve as the official website),
 * three duration tiers, and shared helpers so every scene breathes the same way.
 */

/** Website-native ease-out: fast start, long silky settle. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** For elements leaving the frame (slightly sharper). */
export const EASE_EXIT = Easing.bezier(0.4, 0, 0.68, 0.06);

/** Symmetric in-out for camera / cursor travel. */
export const EASE_TRAVEL = Easing.bezier(0.45, 0.05, 0.18, 1);

export const DUR = {
  /** Micro feedback: key press, highlight flick */
  micro: 14,
  /** Standard element enter/exit */
  element: 26,
  /** Scene-level moves: hero reveals, camera settles */
  scene: 44,
} as const;

export { SCENE_OVERLAP } from "./timeline";
import { SCENE_OVERLAP } from "./timeline";

/** Eased 0→1 progress starting at `start`, lasting `dur` frames. */
export const ease01 = (frame: number, start: number, dur: number = DUR.element): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

/** Standard enter: fade + lift. Spread into a style object. */
export const fadeUp = (
  frame: number,
  start: number,
  opts: { dur?: number; dist?: number } = {},
): { opacity: number; transform: string } => {
  const t = ease01(frame, start, opts.dur ?? DUR.element);
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * (opts.dist ?? 26)}px)`,
  };
};

/** Standard exit: fade + slight lift away. Multiply with enter opacity. */
export const fadeOut = (frame: number, start: number, dur: number = 16): number =>
  interpolate(frame, [start, start + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_EXIT,
  });

/**
 * Apple-style slow push-in for a whole scene stage: scale 1 → 1.03 across the
 * scene so even static holds keep breathing. Apply to the stage container.
 */
export const scenePushIn = (frame: number, durationInFrames: number, amount = 0.03): number =>
  interpolate(frame, [0, durationInFrames], [1, 1 + amount], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.7, 1),
  });

/**
 * Headline text must fully clear the frame before the scene-level crossfade
 * begins — two different headlines mid-dissolve in the same slot read as
 * garbled overlapping glyphs, not a clean dissolve. Fades text to 0 over
 * `dur` frames, timed to land exactly as the crossfade overlap window opens
 * (no fade when there is no next-scene overlap, e.g. the outro).
 */
export const textExit = (
  frame: number,
  durationInFrames: number,
  overlap: number,
  dur: number = 16,
): number =>
  overlap <= 0
    ? 1
    : interpolate(frame, [durationInFrames - overlap - dur, durationInFrames - overlap], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_EXIT,
      });

/**
 * Scene-level cross-dissolve. Returns opacity/scale for the whole scene while
 * it enters over the previous one and exits under the next one.
 */
export const sceneTransition = (
  frame: number,
  durationInFrames: number,
  overlap: number = SCENE_OVERLAP,
): { opacity: number; scale: number } => {
  const enter = interpolate(frame, [0, overlap], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const exit = interpolate(frame, [durationInFrames - overlap, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_EXIT,
  });
  return {
    opacity: Math.min(enter, exit),
    scale: 0.988 + enter * 0.012 + (1 - exit) * 0.01,
  };
};
