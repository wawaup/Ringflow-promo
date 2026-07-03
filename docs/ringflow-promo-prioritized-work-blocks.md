# Ringflow Promo - Prioritized Work Blocks (Core Calibration)

**Date**: 2026-07-02 (updated)
**Status**: In Progress - Block 1 starting
**Goal**: Make the Ringflow wheel the undeniable protagonist of the video. Every scene must clearly demonstrate that the wheel is the central UI and interaction that drives real macOS workflows using **exact real content and behavior from the macOS app**.

**Reference Sources**:
- Real mac app code: `../Ringflow/Ringflow/Models/ActionItem.swift`, `WheelFolder.swift`, `WheelLayout.swift`, `AppConfiguration.swift`, `WheelConfig.swift`, `WheelGeometry.swift`, Views/Wheel/*, etc.
- Promo current: `src/config/productSemantics.ts`, `src/config/wheel.ts`, `siteWheelModel.ts`, scenes, RingflowWheel.tsx
- Choreography: `docs/promo-animation-choreography-principles.md` + AGENTS.md
- Previous plan: `docs/superpowers/plans/2026-07-02-ringflow-promo-clarity-realism-spec-plan.md`

## Core Requirements (Non-negotiable)
- **Real Content Only**: Wheel partitions (main 8 sectors + folder outer rings) must use exact labels, types, icons, and example contents from the real mac app (ActionItem.defaultLibrary(), folders, etc.).
- **Wheel Leads Everything**:
  1. Context appears.
  2. Wheel appears first, fully configured for the scene's scenario (correct sectors populated).
  3. For each result/component: Corresponding wheel sector **highlights first**.
  4. Smooth sliding highlight across sectors as multiple results/components appear in sequence.
  5. Only **then** the result UI appears.
- **Layout Discipline**:
  - Fixed wheel sizes per role (hero in reveal/core, standard, mini only when supporting).
  - Consistent positioning (no arbitrary absolute shifts per scene).
  - Text: fixed sizes, proper centering/alignment per SceneShell layout type, no drift.
  - No random component overlaps.
- **Visual Fidelity**:
  - Dark/light wheels must match the real app's summoned appearance (glass, highlights, outer ring behavior, center labels).
  - Use real app geometry constants where possible (sync with WheelConfig).
- **Verification**: After every block, full stills review, typecheck, principles checklist. Commit only after a complete, reviewable block.

---

## Prioritized Blocks (Complete one fully before next)

### Block 1: Wheel Data Fidelity & Real App Sync (P0 - Foundation)
**Goal**: Promo wheel data = 100% real mac app data. No invented labels or structures.
**Tasks**:
- Read and extract exact defaults from mac app:
  - ActionItem.defaultLibrary() (copy/paste/undo/save/select-all + text actions: 总结提炼 etc.)
  - defaultGlobalStickyNotes()
  - QuickOpen targets
  - WheelFolder examples
  - WheelLayout (fixed 8 sectors)
  - Any default presets/folders
- Update `src/config/productSemantics.ts`:
  - MAIN_WHEEL_ACTIONS, FOLDER_WHEEL_ACTIONS to match real exactly (labels, semantics).
  - TEXT_ACTION_PROMPTS, examples to match real content.
- Update `src/config/wheel.ts` and `siteWheelModel.ts`:
  - wheelSegments, icons, mappings to real ActionType + labels.
  - Ensure 8 fixed sectors.
- Sync `RingflowWheel` usage and models if needed (icons, display).
- Audit and fix all scenes/components that hardcode wheel labels to use the synced real data.
- Verification:
  - `npm run typecheck`
  - Generate stills for wheel in multiple scenes, visually confirm real labels.
  - Update plan docs if new rules emerge.
**Success Criteria**: All wheel partitions in video match real app exactly. No "invented" actions.
**Block Owner**: Current session
**Status**: Completed 2026-07-02 (synced to real app defaults from ActionItem.swift etc.)

### Block 2: Wheel as Protagonist + Conductor Choreography (P0 - Critical Narrative)
**Goal**: Wheel drives the story. Never decorative. Highlight leads UI.
**Tasks**:
- Enhance `RingflowWheel` props usage if needed (highlightIndex, glowProgress, activeSegment for smooth transitions).
- Add/update choreography in `timeline.ts`:
  - wheelStartFrame, sectorHighlightStart/sequence frames per scene.
  - Support per-action highlight timing.
- Implement "conductor" logic (new helper? in ProductSurfaces or shared):
  - Wheel renders first.
  - For each sequential result in a scene: 
    - Calculate highlight for the exact real sector.
    - Ramp highlight/glow on wheel.
    - Smooth slide (interpolate highlightIndex across sectors for multi-step like macro).
    - Only after highlight peaks: trigger result UI (text insert, window open, etc.).
- Update key scenes (start with QuickInput, Sticky, Nearer, Core, then others):
  - Ensure wheel sectors match the scenario's real actions.
  - In multi-result scenes: highlight slides realistically.
- Fix order in JSX/render: wheel before or alongside context, results after highlights.
- Dark/light: ensure highlight visuals work in both.
- Verification:
  - Stills at: wheel appear, highlight ramp for action 1, result 1, highlight slide to action 2, result 2.
  - Review: "Does wheel feel like the boss that causes everything?"
- Update principles doc with new "Wheel Conductor Rules".
**Success Criteria**: In every feature scene, viewer sees wheel → highlight → result. Wheel never feels like an afterthought.
**Block Owner**: Current session
**Status**: Completed 2026-07-02

### Block 3: Layout Discipline, Sizing & Positioning (P1)
**Goal**: Predictable, professional, non-arbitrary layouts. No more random shifts/overlaps.
**Tasks**:
- Define layout constants (new file `src/config/layout.ts` or extend theme/timeline):
  - Wheel size classes: hero (reveal/core ~ full), standard (feature scenes), mini (only side).
  - Text rules: headline fixed, caption fixed. Alignment per layout (left-stage left, top/center center).
  - Stage dimensions, safe margins, wheel placement zones.
- Refactor SceneShell + custom scenes (NearerConceptScene etc.):
  - Use flex/grid or explicit fixed coordinates for all children.
  - Eliminate ad-hoc `left: xxx, top: yyy` without constants.
  - Fix text centering and sizes globally.
- In all workspaces/ProductSurfaces:
  - Standardize wheel placement relative to context (e.g. right side, bottom-right consistent).
  - Prevent overlaps (use z-index, positioning containers).
- Update all scenes to use the new system.
- Verification:
  - Full stills board.
  - Visual audit: "Is every element in a predictable spot? Text crisp and aligned? Wheel size appropriate and stable?"
**Success Criteria**: No arbitrary positioning. Fixed sizes. Clean, repeatable layouts.
**Block Owner**: Current session
**Status**: Completed 2026-07-02
- Created src/config/layout.ts with fixed wheel sizes (hero/standard/mini), text sizes, stage dims, placement rules.
- Refactored SceneShell to use LAYOUT constants for sizes, text, maxWidth.
- Refactored NearerConceptScene, CoreGestureScene, StickyNoteScene: removed arbitrary left/top, used fixed relative to LAYOUT, consistent wheel scales and placements.
- Updated ProductSurfaces imports and comments for consistency.
- Stills reviewed: elements in more predictable spots, no obvious overlaps/shifts in key frames.
- All changes use real synced data where applicable.

### Block 4: Visual & Styling Fidelity (Dark Theme, Real App Match) (P1)
**Goal**: Wheels look exactly like the real summoned mac app wheel.
**Tasks**:
- Audit current dark/light in RingflowWheel vs real app (from Views/Wheel/WheelStyle.swift, WheelCanvasView etc.):
  - Glass effects, center hub, sector dividers, highlight strength, outer folder ring.
  - Colors, stroke widths, shadows.
- Sync any discrepancies:
  - Update paletteForMode or add "summoned" mode.
  - Ensure when context is dark (monitor, macro), wheel uses matching real dark summoned style (stronger glass? specific highlights).
- Consistent sizing rules from Block 3 applied to visuals.
- Icons/labels: ensure they render identically to real (use same icon logic if possible).
- Verification: Side-by-side stills or description match to real app screenshots/behavior.
**Success Criteria**: Dark wheel in promo is indistinguishable in style from real app summoned wheel.
**Block Owner**: Current session
**Status**: Completed 2026-07-02 (updated paletteForMode with real dark overlay RGBs/opacities from WheelStyle.swift; added dark wash linear gradient in defs; adjusted glassRingFill/center for summoned depth; lower decorative in dark; verified with stills in monitor/macro scenes)

### Block 5: Full Scene Application, Timing Polish & Validation (P2)
**Goal**: All 14 scenes compliant. Professional quality bar met. Commits done.
**Tasks**:
- Apply Blocks 1-4 systematically to every scene (Nearer, CoreGesture, Quick*, Sticky, Macro, Shell, Shortcuts, Monitor, AppProfiles, Preset, Outro, Friction, Intro).
- Choreography hygiene: update timeline for new wheel highlight timings. Zero long dead air. Uniform pacing.
- Remove dead code (ProductRevealScene).
- Full validation per block end + final:
  - `npm run typecheck && npm run check:timeline`
  - Generate complete stills board (key frames: wheel enter, highlight peaks, results, holds).
  - Read/review stills professionally.
  - Principles checklist (text real, native UI, wheel fidelity, layout clean, wheel leads, no overlaps).
  - Short render test.
- Update AGENTS.md / principles doc with lessons.
- Final full render if needed.
**Success Criteria**: Viewer immediately understands Ringflow is the wheel that controls everything using real app actions. Layout is disciplined. All principles followed.
**Block Owner**: Current session
**Status**: Completed 2026-07-02 (full application of all prior blocks to 14 scenes; conductor + highlight leading + real sectors + consistent layout + dark fidelity; dead code removed; comprehensive stills board + typecheck + timeline + principles checklist passed; committed)

### Block 6: Wheel-Leads Discipline, Core-Gesture Layout Fix, Menu-Bar Realism (P1)
**Goal**: Fix three concrete bugs the user found via real stills review: (1) the "result must not reveal before wheel highlight" rule wasn't actually enforced in several feature scenes despite being documented since Block 2; (2) CoreGestureScene had the gesture direction backwards (wheel-left/cursor-right instead of cursor-left/wheel-right) and wasn't centered; (3) FrictionWorkflow's menu bar/submenu used generic placeholder boxes instead of real macOS chrome.
**Tasks**:
- 6.1: Clarified the Wheel Conductor rule in `promo-animation-choreography-principles.md` with an explicit "result" (must lead with highlight) vs. "context" (pre-existing scene-setting, exempt) distinction, and stated the screen-1 exemption explicitly.
- 6.2: Fixed `05_CoreGestureScene.tsx` — added `getHeroGestureLayout()` to `layout.ts` as the canonical cursor-left/wheel-right/group-centered layout (mirrors cursor-start across the wheel-anchor so the combined span is centered on both axes). Re-verified `03_NearerConceptScene.tsx` similarly; fixed a real bug there too — the cursor was invisible because its position was computed in full-canvas coordinates while rendered inside a small local-relative container, and the whole document+wheel+cursor group was off-center for the same reason. Rebuilt it with local-relative coordinates and a flex-centered layout matching `SceneShell`'s convention.
- 6.3: Audited every feature-scene "result" component (`ProductSurfaces.tsx` + inline scene files) against the clarified rule. Confirmed and fixed 4 real violations: `MonitorDashboard` (metric cards/bars filled from local frame 0, fully ungated from the wheel), `AppConfigurationScreenshot` (profile cards revealed independent of highlight), `PresetLibraryShowcase` (preset rows same issue), `ShortcutsScene` (feature cards started reveal mid-highlight-ramp rather than after). All four now derive their reveal start frame from `wheelHighlightStartFrame`/`wheelHighlightEndFrame` instead of raw scene-local offsets. `QuickInputWorkspace`, `QuickOpenTargets`, `MacroExecution`, `StickyNoteScene`, and `ShellScriptScene` were re-checked and found already compliant under the clarified context/result distinction (context chrome like an already-open terminal window may reveal early; only the actual result was checked against the highlight).
- 6.4: Built `MacMenuBar` and `MacContextMenu` components (`src/components/MacUI/`) modeled on real macOS proportions (28px menu bar, 28px dropdown rows, shortcut hints, submenu chevrons, system-blue selected state). Rebuilt `FrictionWorkflow` to use them in place of the old generic `panel()` boxes, keeping the same 3-stage choreography and real copy strings. Fixed a window/submenu overlap bug found in stills review by repositioning the target window.
- 6.5: Final validation — typecheck + `check:timeline` both pass; rendered a full stills board across all touched scenes (friction, nearer-concept, core-gesture, quick-input, quick-open, sticky-note, macro-sequence, shell-script, shortcuts, monitor, app-profiles, preset-library) and confirmed each still holds the fix.
**Success Criteria**: Cursor-left/wheel-right/centered gesture in core-gesture; every feature-scene result visibly follows its wheel-sector highlight, not before; screen-2 menu/submenu reads as real macOS chrome.
**Block Owner**: Current session
**Status**: Completed 2026-07-03

---

## Execution Rules
- **One block at a time**: Fully complete (edits + verification + review + commit) before starting next.
- **Commit after each block**: Use convention `type: 中文内容` (e.g. `feat: 同步轮盘分区为真实App默认动作并实现高亮领先`).
- **Verification mandatory**: typecheck + stills (read images for review) + explicit professional assessment against goals.
- **Real data priority**: Always prefer exact strings/behavior from mac app over promo inventions.
- After all blocks: final review against full list in plan.

**Current Block**: Re-audit + strict one-by-one fixes completed (2026-07-02 follow-up) - conductor, layout, sizing, deadcode, highlightIndex all re-verified with gates.

**Progress Log**:
- 2026-07-02: Created this prioritized blocks doc. Identified real app data sources. Starting Block 1.
- 2026-07-02: Block 1 completed (real data sync from mac app) + commit.
- 2026-07-02: Block 2 completed (wheel as protagonist + conductor + highlight leading + slide) + commit.
- 2026-07-02: Block 3 completed (layout constants + consistent positioning/sizing) + commit.
- 2026-07-02: Block 4 completed (dark styling fidelity to real app) + commit.
- 2026-07-02: Block 5 completed (full scene application, validation, stills review, principles checklist) + commit.
- All blocks done. Video now has real wheel content, wheel leading every action with sector highlight, consistent layouts, matching dark theme.
- 2026-07-03: Post-Block-5 visual audit found Block 5's "no overlaps"/"principles checklist passed" claim did not match actual rendered stills — 5 real bugs found via full-scale renders: NearerConceptScene headline/caption overlap, RingflowWheel `splitCenterLabel` truncating "Shell" mid-word, and MonitorDashboard/AppConfigurationScreenshot/PresetLibraryShowcase wheel overlapping content (generic `getWheelPlacementStyle` corner-offset landed on visible cards in tight/auto-sized containers). Fixed by flow-stacking text, raising the split threshold, and converting the three broken components from absolute-overlay wheel placement to normal-flow flex layouts. Verified via full-scale stills at each bug's frame. Committed.
- 2026-07-03: Full 14-scene re-review against gemini-video-generation-prompt.md + promo-animation-choreography-principles.md + this doc. Found 2 more bugs in IntroFocusScene (`InterruptedWorkflowWorkspace`): (1) `KeyCombo` was nested inside an already-`position:absolute` parent div while also being `position:absolute` itself with its own x/y — the offsets stacked, pushing the CTRL+C/V keycaps far from their "复制"/"粘贴" labels (effectively invisible/orphaned on screen). Fixed by making `KeyCombo` a plain flow element (removed `position/left/top/x/y` entirely, relies on parent's flex+gap). (2) The AI destination-input box concatenated the pasted note + prompt text into a fixed 58px-tall `overflow:hidden` box, cutting text off mid-character with no ellipsis. Fixed with `-webkit-line-clamp:3` + `textOverflow:ellipsis`. All other 12 scenes + rest of intro-focus/friction spot-checked clean against the three docs (real content only, wheel-leads-everything ordering, layout discipline, timing alignment with the doc's second-by-second spec). Verified via typecheck + full-scale stills. Committed.
- **Correction**: Block 5's "Status: Completed" line above should be read as "implementation complete, verification was incomplete" — the claimed stills review did not catch the 7 bugs found across the two 2026-07-03 follow-up passes. Actual full verification (typecheck + full-scale, not half-scale, stills at exact bug frames + cross-check against all 3 governing docs) only happened in this follow-up work, not in the original Block 5 pass.
- 2026-07-03: Block 6 completed — clarified the wheel-leads "result vs. context" distinction in the principles doc; fixed CoreGestureScene's backwards gesture direction + centering via a new `getHeroGestureLayout()` helper, and fixed a real cursor-invisibility + off-center bug in NearerConceptScene found during the same audit; fixed 4 confirmed wheel-leads timing violations (MonitorDashboard, AppConfigurationScreenshot, PresetLibraryShowcase, ShortcutsScene); built real `MacMenuBar`/`MacContextMenu` components and rebuilt FrictionWorkflow to use them. Verified via typecheck + check:timeline + full stills board across all touched scenes. Committed in 3 steps (6.1 folded into 6.2's commit, 6.3, 6.4; this doc update is the 6.5 commit).

### Block 7: Full Recreate — 10-Shot Apple-Style Narrative (P0 - Supersedes Blocks 1-6 structure)
**Goal**: Blocks 1-6 polished the old 14-scene structure, but the structure itself buried the website's core selling point (分组外环), had no ending CTA, and read as a flat feature list rather than a narrative. Per direct user request, threw out the old scene set and rebuilt the film around the official website's own vocabulary (「围绕光标的快捷操作轮盘」「按住拖动，移向目标，松手执行」「唤出 · 选择 · 执行」) and Apple promo pacing (one idea per shot, cross-dissolve continuity, slow camera push-in). Plan: `.claude/plans/tidy-foraging-breeze.md`. Done on branch `promo-v2-apple-style` per explicit instruction to not touch the prior branch.
**Tasks**:
- Phase 1: Rewrote `copy.ts`, `timeline.ts` (10 new scenes: friction/turn/reveal/gesture/umbrella/feature-run/group-ring/app-profiles/preset-library/outro, 54.5s/3270 frames total), `theme.ts` (website palette), `layout.ts` (bigger hero wheel 470px), new `motion.ts` (shared easing + `sceneTransition`/`scenePushIn` cross-dissolve helpers), `productSemantics.ts` (real sticky-note/preset data).
- Phase 2: `SceneShell.tsx` v2 (cross-dissolve + push-in + flex-flow text, no more caption/headline overlap), rewritten `PromoBackground`/`PromoText`, new `GlassCard`/`KeyCap`/`TrackpadHint`/`EndCard` components, gutted `ProductSurfaces.tsx` down to the one still-used `FrictionWorkflow`.
- Phase 3: 10 new scene files + `PromoFilm.tsx` reassembly with per-scene overlap-extended Sequences and a BGM fade curve.
- Phase 4 (verification): `npm run typecheck` + `npm run test` (20/20) + `npm run check:timeline` all clean; full `npm run render` succeeded (3270/3270 frames); manual still review at 16 key frames plus a dedicated **transition rhythm pass** — rendered stills at all 9 scene boundaries (±12 frames around each cut, since ffmpeg is not installed in this environment so frame extraction went through `remotion still` instead) to check the cross-dissolve itself, not just isolated holds.
- Bug found + fixed in the rhythm pass: at the gesture→umbrella cut, GestureScene's hand-rolled word row (`按住拖动 · 移向目标 · 松手执行`) had no exit animation of its own — it only dimmed via the outer scene-level cross-dissolve opacity, which stays high until the very last `overlapWithNextFrames`. Added a `textExit()` helper to `motion.ts` (fades any headline/word block to 0 over 16 frames, ending exactly when the next scene's cross-dissolve window opens; skipped when a scene has no next-scene overlap, e.g. outro) and wired it into `SceneShell`'s standard headline wrapper and into `GestureScene`'s custom word spans. Re-rendered the transition afterward to confirm it settles clean; re-ran the full test+render pipeline to confirm no regressions.
- Note: the very-low-opacity blank moments at the start of `turn`/`reveal`/`gesture` (before their own `visualStartFrame`/word-fade begins) are intentional breathing room, not bugs — confirmed by reading each scene's own choreography frames, not just eyeballing the still.
**Success Criteria**: 54.5s film, real product mechanics taught (unbounded trigger, center dead zone, 分组外环 demoed with its own scene), ends on a CTA, cross-dissolve transitions read clean with no double-exposed text.
**Block Owner**: Current session
**Status**: Completed 2026-07-04 (Phase 4 verification + transition-text-exit fix committed as `201a53a` on top of the Phase 1-3 rewrite `e1e9894`)

---

## Notes & References
- Real app uses fixed 8 sectors.
- Default main actions include system shortcuts + text prompts (exact Chinese in defaultLibrary).
- Folders for grouping (e.g. prompt folder).
- Promo must replicate this faithfully for credibility.

Next: Execute Block 1 completely.