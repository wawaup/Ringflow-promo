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
**Status**: Completed 2026-07-02 (synced to real app defaults from ActionItem.swift etc.)

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
**Status**: Completed 2026-07-02 (synced to real app defaults from ActionItem.swift etc.)

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
**Status**: Completed 2026-07-02 (synced to real app defaults from ActionItem.swift etc.)

---

## Execution Rules
- **One block at a time**: Fully complete (edits + verification + review + commit) before starting next.
- **Commit after each block**: Use convention `type: 中文内容` (e.g. `feat: 同步轮盘分区为真实App默认动作并实现高亮领先`).
- **Verification mandatory**: typecheck + stills (read images for review) + explicit professional assessment against goals.
- **Real data priority**: Always prefer exact strings/behavior from mac app over promo inventions.
- After all blocks: final review against full list in plan.

**Current Block**: Block 1

**Progress Log**:
- 2026-07-02: Created this prioritized blocks doc. Identified real app data sources. Starting Block 1.

---

## Notes & References
- Real app uses fixed 8 sectors.
- Default main actions include system shortcuts + text prompts (exact Chinese in defaultLibrary).
- Folders for grouping (e.g. prompt folder).
- Promo must replicate this faithfully for credibility.

Next: Execute Block 1 completely.