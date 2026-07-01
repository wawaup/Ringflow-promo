# Ringflow Promo — Animation Choreography Principles

This document captures the general, reusable rules that emerged from iterative feedback on the promotional video, especially the first screen (intro-focus interrupted workflow). These principles apply across all scenes.

## 1. Full Component / Action Duration Matching (Most Important)

When demonstrating sequential analogous micro-interactions (select → Copy → Paste into a target):

- The **entire active lifetime** of each source component must feel and be roughly equal.
- Lifetime includes:
  - Appearance / fade-in of the source window or panel
  - Duration of selection highlight
  - Full appear + stay + fade of the key visuals (`Control + C`, `Control + V`)
  - Any associated internal state while the action is visible
- Only equalizing the *interval* (time between Copy and Paste) is insufficient.
- The source must "stay alive" for a comparable total span in both cases.

**How to apply**: Use the later, more complete action as reference. Calculate its span from appearance/open to end of its pasteKeys. Position the earlier action's start and the subsequent trigger so the earlier component receives an equivalent total duration.

## 2. Zero-Gap Continuous Chaining

Inside one scene there must be no perceptible empty frames between phases:

- Headline / text animation finishes → first UI elements begin moving or appearing immediately.
- Previous element's exit (window fade) is deliberately overlapped or abutted with the next element's entrance (typical offset: `nextStart - 8` ~ `-10`).
- After a paste result lands, the result content in the target stays visible; do not hide the source prematurely.

Use helper functions such as `sceneWindowVisibility(start, computedEnd, fade)` and small negative margins for smooth handoff.

## 3. Eliminate Long Post-Action Dead Air

After the last key press visual or major motion of a chain:

- Do not leave a large stretch of completely static screen while the viewer waits for the scene (or film) to advance.
- Solutions (preferred order):
  1. Give the earlier actions in the same chain their proper full lifetime (the sequence itself fills the time).
  2. Move `holdStartFrame` earlier and/or reduce the scene's `durationSeconds` so the scene ends only 1–2 s after the final result state.
- The final visible result (e.g. the pasted prompt text in the AI input) deserves 1–2 s of calm breathing, but not several seconds of pure idleness.

## 4. Uniform Perceived Pacing

Within a continuous shot, all steps of the same nature must feel the same tempo.

- Viewers quickly notice when the first two operations feel "rushed" compared with the third.
- Treat the last complete action as the pacing reference.
- Back-apply equivalent duration to earlier actions by shifting the start frames of later elements (instead of speeding up or slowing down individual pieces).

## 5. Density-Driven Flexible Durations

Scene lengths are not fixed globally.

- Analyze information density before choosing `durationSeconds`:
  - Length and complexity of headline + any visible body text.
  - Length of pasted content.
  - Number of distinct moving pieces (windows, highlights, keys, wheel segments, etc.).
- Estimate realistic viewer reading + comprehension time (editor's eye test).
- Denser narrative scenes (multi-step real workflows with actual Chinese sentences) need more time than simple single-gesture scenes.
- Re-evaluate and adjust per scene. Re-check with stills.

## 6. Evaluate from the Animation Editor / Viewer Perspective

Before committing to numbers:

- Simulate watching the shot:
  - Can the viewer comfortably read the headline?
  - Is there enough time to notice the window appear, register the selection, watch the physical keyboard hints, and understand the result?
- Dense Chinese text + multiple simultaneous UI changes require more frames than English or sparse UIs.
- "The whole screen has nothing moving for a long time" is a failure signal. Fix either by extending active phases or trimming total duration.

## 7. Remotion Timing Safety (Non-Negotiable)

- Every call to `interpolate(frame, inputRange, outputRange, ...)` **requires the inputRange to be strictly monotonically increasing**. Otherwise render fails with a clear error.
- When timings become tight after compression:
  - Extract values into named constants (`const notePasteVal = choreography.notePasteFrame ?? 0`).
  - Protect the final point of a 0-1-0 ramp: `Math.max(earlier + 1, target - 2)`.
- Mandatory after every timing edit:
  1. `npm run typecheck`
  2. `remotion still` at several key frames (action start, Copy visible, Paste + result, hold area).
  3. Confirm at least the first few hundred frames of a render would succeed.
- Never check in or leave a state that breaks `npm run render`.

## 8. Other Standing Rules

- Audio (BGM) typically begins around frame 120 (≈ 2 seconds).
- Prefer merging related narrative beats into one longer coherent scene (e.g. concept + first appearance of the wheel) rather than hard cuts.
- Persistent elements that aid understanding (Ringflow wheel, cursor after release) should usually remain visible.
- **All visible text is real** and comes from canonical sources (`src/config/copy.ts` + `src/config/productSemantics.ts`). These must stay in sync with the shipping macOS app.
- macOS windows must look native: traffic light buttons, proper title bars, system fonts, glass effects, real icons with labels. No square + text placeholders.

## Quick Decision Checklist When Timing a Multi-Step UI Sequence

1. Identify all analogous actions that should feel the same.
2. Compute full lifetime of the reference (usually the last) action.
3. Give every earlier analogous action the same lifetime by adjusting its start and the following trigger.
4. Ensure window visibility covers its own keys and selection.
5. Add 1–2 s breathing after the very last action of the chain.
6. Trim or extend scene duration according to density so there is no long static tail.
7. Verify all interpolate ranges are monotonic.
8. Generate stills and judge with the viewer eye.

## References

- Main project instructions: `AGENTS.md`
- Timeline configuration: `src/config/timeline.ts`
- Example implementation: `src/components/ProductUI/ProductSurfaces.tsx` (InterruptedWorkflowWorkspace)
- Real product data: `src/config/productSemantics.ts`, `src/config/copy.ts`, wheel model files
- Skills: `.agents/skills/ringflow-promo/`, `motion-qa/`, `remotion-best-practices/`

Update this document whenever a new general rule is discovered during iteration.
