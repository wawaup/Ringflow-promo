
# Ringflow Promo Project Instructions

This repository is for creating a Ringflow macOS app promotional video using Remotion.

## Core goals

- Create a polished Apple-like product video.
- Use Remotion + React + TypeScript.
- Avoid browser screen recording as the main production method.
- Use real text rendering for all Chinese and English copy.
- Use React/SVG components for the Ringflow wheel and UI animations.

## Style

- Apple-like, macOS-native, elegant, clean, glassy.
- White-blue light theme and deep blue-gray dark theme.
- Smooth, restrained motion.
- No cluttered commercial poster style.
- No excessive cyberpunk or noisy particle effects.

## Commands

Prefer:

- npm run start
- npm run build
- npm run typecheck
- npm run render

## Review checklist

Before finishing any scene or the full film:

- Check text readability (real Chinese & English).
- Check scene timing, uniform pacing, zero-gap chaining, and sufficient breathing (see "Animation Choreography Principles" below).
- Check dark theme contrast (and light theme).
- Check wheel animation smoothness and fidelity to real app.
- Check native macOS UI details (no placeholder squares + text).
- Check export resolution (1920×1080 @ 60 fps) and that `npm run render` succeeds cleanly.

## Skill Usage (Memory Note)

This project uses specialized skills for development.

### Loading Skills
Skills from ~/.claude/skills have been symlinked into ~/.grok/skills for availability:
- Use soft links (ln -s) for non-destructive sharing of skills between environments.
- Command example:
  ```bash
  for skill in $(comm -23 <(ls ~/.claude/skills | sort) <(ls ~/.grok/skills | sort)); do
    ln -s ~/.claude/skills/$skill ~/.grok/skills/$skill
  done
  ```

Project-specific skills are in .agents/skills/ (ringflow-promo, motion-qa, etc.).

### Scheduling / Dispatching Skills
- Use the `spawn_subagent` tool with `subagent_type` matching the skill directory name (e.g. "brainstorming", "test-driven-development", "remotion-best-practices", "ringflow-promo").
- Always start creative or complex work with "brainstorming" or "shape" skill.
- For planning: "writing-plans", "executing-plans".
- For this Remotion project: reference "remotion-best-practices" and "ringflow-promo" skill.
- Use `todo_write` tool for multi-step task tracking.
- Sub-agents automatically get the SKILL.md context for the specified type.
- For parallel work: "dispatching-parallel-agents".
- Update this AGENTS.md or ~/.grok/docs/skill-scheduling.md when adding patterns.

See /Users/admin/.grok/docs/skill-scheduling.md for full details.

## Commit Convention (Memory Note)

After completing any full feature or meaningful change, always commit using the standard format used across all projects:

```
type: content
```

- `content` must be written in **Chinese**.
- Use one of the following types:

| Type     | Meaning          | When to use                              |
|----------|------------------|------------------------------------------|
| feat     | New feature      | Add user-facing functionality            |
| fix      | Bug fix          | Fix defects, crashes, or incorrect behavior |
| docs     | Documentation    | README, comments, or doc changes         |
| style    | Code style       | Formatting, spacing, semicolons (no logic change) |
| refactor | Refactoring      | Restructure code without adding features or fixing bugs |
| perf     | Performance      | Improve speed or reduce resource usage   |
| test     | Tests            | Add or update tests                      |
| build    | Build system     | Build tools, dependencies, packaging     |
| ci       | CI/CD            | GitHub Actions, GitLab CI, etc.          |
| chore    | Chore            | Maintenance tasks (dependency updates, scripts) |
| revert   | Revert           | Revert a previous commit                 |

Example commits:
- `feat: 合并第三屏和第四屏，实现理念转折与产品亮相在同一屏`
- `fix: 修复 CoreGestureScene 中 interpolate 输入范围非单调问题`
- `refactor: 重构 QuickInputWorkspace 为更贴近真实 AI Agent 的布局`

Always commit only after a complete, reviewable piece of work. Use `git commit -m "type: content"` directly.

## Animation Choreography Principles (Refined from Iterative Feedback)

A clean standalone version also lives at `docs/promo-animation-choreography-principles.md`.

These rules were established and repeatedly reinforced while perfecting the first screen (intro-focus / InterruptedWorkflowWorkspace with sequential note → prompt copy/paste) and apply broadly to all scenes.

### 1. Match Full Component / Action Duration (Not Just Intervals)

When the same type of micro-interaction (select + Copy + Paste) appears multiple times in one scene or across scenes:

- The **entire time a source component maintains visible state and performs its motion effects** must be comparable.
- This lifetime typically spans:
  - Window / panel fade-in and presence
  - Selection highlight ramp
  - Control + C key combo appear + full stay + fade
  - Control + V key combo appear + full stay + fade
  - Any lingering selection or result association
- Merely equalizing the *gap* between Copy trigger and Paste trigger is not enough. The stay duration of the keys themselves and how long the source stays "alive" during/after the action must feel consistent.

**Rule**: Decide the target lifetime from the most complete later example, then position earlier triggers and window exit points so the earlier component receives an equivalent full span.

### 2. Zero-Gap Continuous Chaining Inside a Scene

- Text finish must lead directly into the first UI motion (no empty frames).
- One window's exit must be calculated relative to the next window's entrance (e.g. `end = nextStart - 8` or `-10`) so the handoff feels immediate.
- After a paste result appears in the target area, the result text remains visible; do not remove the visual evidence too soon.
- Use `sceneWindowVisibility(start, end, fade)` and small negative offsets to create seamless flow between sequential elements (code → note → prompt, etc.).

### 3. Eliminate Long Post-Action Static Dead Air

- After the last key visual or major motion completes, avoid long periods where the whole screen is visually static while the viewer is forced to wait for the scene to end.
- Preferred solutions (in order):
  1. Extend the **earlier** actions in the chain to their proper full duration (so the sequence itself fills time).
  2. Move `holdStartFrame` and/or reduce `durationSeconds` so the scene ends ~1–2 s after the final meaningful state.
- Final result state (pasted prompt visible in input, operation complete) should receive 1–2 seconds of calm breathing time, but not excessive idle.

### 4. Uniform Perceived Pacing

- Within a single continuous shot, all analogous steps must feel the same speed.
- Viewers notice when the first two actions feel "rushed" compared with the third.
- Use the third (or last) action's complete timing as the reference and back-propagate equivalent duration to the first and second by shifting the start of later elements.

### 5. Density-Driven, Flexible Scene Durations

- `durationSeconds` per scene is **not fixed** (avoid hard-coding 5.5 s or 10 s globally).
- Before choosing duration:
  - Count information density: headline length, number of real sentences in UI, length of pasted content, quantity of distinct moving elements.
  - Estimate viewer time needed to read + understand at normal pace.
- First screen (multi-step workflow + real Chinese text + several windows) naturally requires more time than a simple single-gesture scene.
- Adjust `durationSeconds` and internal `holdStartFrame` to give appropriate room; re-verify with stills.

### 6. Always Evaluate from Animation-Editor / Viewer Perspective

- Before writing numbers, simulate the watch experience:
  - Can I comfortably read the headline?
  - Do I have time to register the window appearing, see the selection, watch the physical key press visuals, and register the paste result?
- Adjust upward for dense Chinese text and multiple concurrent UI changes.
- "Nothing is moving for a long time" is a strong negative signal — fix by either lengthening active phases or shortening total duration.

### 7. Remotion Technical Timing Hygiene (Mandatory)

- Every `interpolate(frame, inputRange, ...)` **inputRange must be strictly monotonically increasing**. Remotion will crash the render otherwise.
- When compressing timings:
  - Extract local variables: `const noteCopyVal = ...; const notePasteVal = ...;`
  - For 0→1→0 ramps use `Math.max(previous + 1, target - 2)` (or similar epsilon) on the third value.
- After **any** timing change:
  1. `npm run typecheck`
  2. Generate targeted stills (`remotion still ... --frame=XXX`) at start of action, during Copy, during Paste + result, and near hold.
  3. If possible do a short render or at least confirm first 300 frames succeed.
- Never leave the working tree in a state that would fail `npm run render`.

### 8. Supporting Rules

- BGM (Audio) usually starts around frame 120 (≈2 s).
- Prefer merging conceptually adjacent shots (e.g. concept reveal + wheel appearance) into one coherent scene rather than abrupt cuts.
- Important persistent elements (Ringflow wheel, cursor) should usually remain visible after their triggering action if it helps the viewer understand the result.
- **All on-screen text must be real** — sourced from `src/config/copy.ts` or `src/config/productSemantics.ts` (which align with the actual macOS app). Never invent placeholder copy for visuals.
- macOS windows must use native traffic lights, proper title bar styling, system fonts, and real icons + labels. No "square + text" fakes.

## Iteration & Validation Workflow

1. Read the feedback in terms of "full lifetime of the component" and viewer comprehension, not only start/stop deltas.
2. Update choreography constants in `src/config/timeline.ts`.
3. Adjust reveal, selection, copyKeys, pasteKeys, and `sceneWindowVisibility` end calculations in the UI component.
4. Run `npm run typecheck`.
5. Produce stills at the critical moments of the changed elements.
6. Visually judge using the principles above (uniformity, zero gap, breathing, density).
7. Fix and repeat until clean.
8. Only then commit with the proper Chinese conventional message.
9. Update this document if a new general rule emerges.

## Updated Review Checklist

Before considering any scene or the whole film finished, verify:

- Text readability (Chinese + English, all sizes, contrast).
- Scene timing & pacing uniformity (use the principles in this document).
- Zero-gap chaining between text, windows, selections, and key actions.
- Sufficient 1–2 s breathing on final states; no excessive static dead air.
- Dark theme contrast (and light theme).
- Wheel animation smoothness + fidelity to real app.
- Real app data used (prompts, wheel slots, labels, copy).
- Native macOS UI details (no placeholders).
- Export resolution (1920×1080), 60 fps, and clean render (no inputRange errors).
- Overall film flow when played straight through.
