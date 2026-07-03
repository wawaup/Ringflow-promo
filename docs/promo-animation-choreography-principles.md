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
  2. Move `holdStartFrame` earlier and/or reduce the scene's `durationSeconds` so the scene ends after only a short, reasonable connection pause (e.g. 15-35 frames) once the final result state is clear.
- The final visible result (e.g. the pasted prompt text in the AI input) should be clearly visible for a short moment using reasonable connection intervals (typically 10-30 frames / 0.17-0.5s), but avoid long static pauses. In a <60s video, tight pacing is essential.

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
5. Add only a short reasonable connection pause (typically 10-30 frames / 0.17-0.5s) after the very last action of the chain so the result registers clearly, then advance. Long pauses feel slow in a sub-60s video.
6. Trim or extend scene duration according to density so final connection pauses are short (no long static tail).
7. Verify all interpolate ranges are monotonic.
8. Generate stills and judge with the viewer eye.

## Wheel Conductor Rules (Added for Block 2, clarified in Block 6)
- Wheel always appears first in the visual sequence for feature demos.
- Configure wheel sectors to match the current scene's real app actions (from synced productSemantics).
- For each result/component: relevant real sector on wheel **highlights/glows first** (use glowProgress or highlightIndex driven by choreography).
- In sequences: smoothly slide the highlight across sectors (interpolate index) in sync with result order.
- Result UI only fully reveals after the highlight peak.
- This makes the wheel the protagonist that "conducts" every action. Use real labels/sectors only. Verify with stills at wheel-enter, highlight-ramp, result-after.
- **"Result" vs. "context" distinction (Block 6)**: A "result" is any panel/content whose purpose is to *demonstrate what the highlighted wheel sector does* (a filled-in dashboard, a created note, terminal command output, a selected preset, a toggled config). A "context" element is pre-existing scene-setting that represents the user's ongoing work *before* they summon the wheel (an already-open document/terminal). Only "result" content is bound by this rule — context elements may appear earlier.
- **Concretely**: a result's reveal must not *start* before `wheelHighlightStartFrame`. A small overlap of up to ~8-10 frames past `wheelHighlightStartFrame` is fine (consistent with the Zero-Gap Continuous Chaining offset convention), but the result must not be mid-reveal or fully visible while the highlight is still ramping up from zero. When in doubt, gate the result's start frame off `wheelHighlightEndFrame` (or `Math.max(wheelHighlightEndFrame, holdStartFrame)` per the `StickyNoteScene` reference pattern) rather than off `actionStartFrame`/`visualStartFrame`, which are not tied to the highlight at all.
- **Screen 1 exemption**: `01_IntroFocusScene` (`InterruptedWorkflowWorkspace`) is exempt from this entire rule — it runs before the wheel has been introduced in the video's narrative, so there is no wheel/highlight to lead with. Do not re-litigate this scene against the Wheel Conductor rule.

## References

- Main project instructions: `AGENTS.md`
- Timeline configuration: `src/config/timeline.ts`
- Example implementation: `src/components/ProductUI/ProductSurfaces.tsx` (InterruptedWorkflowWorkspace)
- Real product data: `src/config/productSemantics.ts`, `src/config/copy.ts`, wheel model files
- Skills: `.agents/skills/ringflow-promo/`, `motion-qa/`, `remotion-best-practices/`

Update this document whenever a new general rule is discovered during iteration.
