# Ringflow Promo — Audience Clarity, Product Identity & Scene Realism Overhaul
**Date**: 2026-07-02
**Status**: Planning → Execution
**Owner**: Grok + team
**References**:
- `docs/promo-animation-choreography-principles.md`
- `AGENTS.md` (especially Animation Choreography Principles + Review Checklist)
- `.agents/skills/ringflow-promo/SKILL.md`
- Previous: `2026-07-01-semantic-component-promo-direction.md`, `2026-06-30-professional-animation-gap-review.md`

---

## 1. Goals (Success Criteria)

After this work, a viewer who has **never heard of Ringflow** should be able to say after one viewing:

> "Ringflow is a macOS utility. It puts a customizable action wheel right next to your cursor using a middle-click + swipe gesture. It lets you quickly insert prompts, open files/apps, take notes, run scripts, check system status, etc., without breaking your flow. It supports per-app wheels and presets."

**Measurable targets**:
- Zero prominent confusing product names ("Codex", "AI Chat" as main titles) in the first 15 seconds.
- The wheel appears as a **hero product UI** (not just a small icon) in the concept reveal + at least 2 feature scenes, positioned next to cursor in a believable document/desktop context.
- Every major feature scene follows the operational story pattern: **Realistic context window → Intent (cursor/selection) → Wheel action → Visible result in context + Ringflow attribution**.
- All on-screen text sourced from `copy.ts` + `productSemantics.ts`.
- No long static dead air (hold pauses ≤ ~30 frames where possible).
- Component lifetimes for analogous actions feel uniform.
- Still looks Apple-like, clean, glassy, elegant, restrained motion. No screenshots.

---

## 2. Current Problems (Diagnosis)

From analysis + viewer simulation + stills:

### A. Product Identity Confusion (High impact)
- Intro (`InterruptedWorkflowWorkspace`): "AI Chat" title + "Codex-like" input area.
- QuickInput (`QuickInputWorkspace`): "Codex · AI 应用" header.
- Result feedback mentions Ringflow, but early visuals pollute the mental model ("this is an AI coding app").
- Internal variable names (`codexInput`, `codexMain`) leak the confusion into code.
- File names like "useSubscription.ts" are fine for realism but window titles amplify the issue.

### B. Weak "This is the Product" Anchoring
- Wheel mostly appears as **mini** or isolated.
- NearerConcept reveal has some document context now, but wheel positioning, size, and "summon next to cursor in my actual work" feeling is still weak.
- No clear "desktop + cursor in document + wheel blooms at cursor" hero moment.
- Viewer has to piece together that the wheel = Ringflow.

### C. Too-Simple / Not Realistic Enough Components
Many scenes feel like "feature list + small wheel" instead of "I was doing X, Ringflow let me do it instantly":
- FrictionWorkflow (improved in recent pass but can go further).
- QuickOpenTargets: pure grid of cards.
- StickyNoteScene, MonitorDashboard, Shortcuts: limited cause-effect in a lived-in context.
- Result states are often too abstract.

**Rule**: Every scene should let the viewer answer "What was the user trying to do? What exactly did Ringflow change on screen?"

### D. Pacing & Information Order
- First ~8 seconds are pure problem (good drama).
- Name + core UI arrive late → risk of disengagement for strangers.
- Some scenes still have long post-action static holds.

### E. Text & Data Fidelity
- Some strings still not fully sourced.
- Choreography variable names in timeline (`codex*`) are legacy.

### F. Technical / Implementation Debt
- `ProductRevealScene.tsx` is unused dead code.
- Inconsistent wheel sizes (mini vs full).
- Limited use of `MacWindow` + cursor + selection states across scenes.

### G. Wheel is Decorative Instead of Protagonist (CRITICAL - Added 2026-07-02)
**Biggest current flaw identified by review**:
- In most scenes, result UIs (text insertion, opened targets, sticky notes, metrics) appear without the wheel "conducting" them.
- Wheel is often small, positioned arbitrarily (bottom-right, isolated), static `activeSegment`, appears late or simultaneously with results.
- No sector highlighting synced to UI reveals.
- Arbitrary layout: text not centered/fixed size, components overlap, wheel size/position varies wildly per scene.
- Dark wheels may not match real macOS app summoned appearance (sectors, highlights, center).
- Consequence: Wheel feels like a prop or afterthought. The film fails to communicate that **Ringflow's wheel is the central interaction and UI**.

**Required pattern (new rule)**:
1. Context / desktop appears.
2. Wheel appears first, sized appropriately, configured with sectors relevant to the current scenario (using real data from `productSemantics` + wheel model).
3. For each sequential action/result:
   - Corresponding wheel sector **highlights first** (use `highlightIndex` / `activeSegment` + glow).
   - Smooth slide/transition of highlight across sectors if multiple steps.
   - Then the matching UI result/component appears (text inserted, window opens, etc.).
4. Consistent layout rules per scene type:
   - Fixed wheel sizes: hero (reveal/core), standard, mini (supporting).
   - Predictable positions (use flex/grid in containers, avoid random absolutes).
   - Text: fixed sizes, proper alignment (centered in top/center stages, left in left-stage), no drift.
5. Dark theme wheel must faithfully match real app (correct glass, labels, highlight behavior when summoned on dark surfaces).

This must be added to core calibration and enforced in all scenes. Without it the promo does not sell the product.

---

## 3. Design Principles for This Overhaul (Non-negotiable)

1. **Semantic + Realistic, Never Screenshots**
   - Compose with `MacWindow`, custom panels, real content from `productSemantics.ts`, SVG `RingflowWheel`.
   - Each window shows only the minimum needed to tell the micro-story (3–8 lines max).

2. **Wheel as Protagonist UI**
   - In reveal + key feature shots: larger wheel, placed near cursor inside/adjacent to active content.
   - Show "summon" feel (scale + position from cursor area).
   - Use `centerLabel="Ringflow"` on first major appearance.

3. **Operational Micro-Story Pattern** (benchmark = Intro)
   Context (document/window with state) → Visible intent (selection/cursor) → Wheel trigger → Immediate visible result in the same context + explicit "Ringflow did this".

4. **Clear Attribution**
   - Result states must say or strongly imply **Ringflow** (e.g. "Ringflow 已输入：润色改写 · 剪贴板已恢复").

5. **Choreography Hygiene**
   - Follow `promo-animation-choreography-principles.md` exactly (full component lifetime matching, zero-gap, short connection pauses 10-30f, monotonic interpolates, density-driven durations).
   - Re-verify with stills after every timing change.

6. **Early & Repeated Identity Reinforcement**
   - By frame ~500-600 the viewer must know the name + what the UI looks like in use.
   - Re-show the wheel in context multiple times.

7. **No new external assets** unless minimal SVG. Keep existing BGM, fonts, glass styling.

---

## 4. Scope of Changes (Prioritized)

### Phase 1: Messaging & Brand Hygiene (Low risk, high clarity gain)
- Rename all visible bad titles/labels (already partially done in prior pass).
- Rename internal `codex*` variables to neutral names (`destinationInput*`, `contextInput*`).
- Update copy.ts with clearer reveal messaging and result strings if needed.
- Clean any remaining "Codex" references in comments/code.

### Phase 2: Hero Identity Anchoring (NearerConcept + Supporting Reveal)
- Make NearerConcept the strongest "this is Ringflow" shot:
  - Document MacWindow as active context with selectable/highlighted text.
  - Cursor inside the document.
  - Wheel appears at realistic size right next to cursor (summon effect).
  - Clear "Ringflow" labeling.
- Optionally strengthen the second line or add subtle "macOS 动作轮盘" once.
- Consider small cursor press hint or trail.

### Phase 3: Realism Upgrades for Feature Scenes
Apply the micro-story template to:
- **FrictionWorkflow** (already upgraded once — polish further if needed: real menu bar from MacWindow top).
- **QuickOpenTargets**: Turn into "editor context + wheel selects target → new small window or toast appears".
- **StickyNoteScene**: Editor context → wheel "新便签" → sticky MacWindow floats on "desktop" layer next to main window.
- **MonitorDashboard**: System panel context + wheel action highlights live metrics.
- **MacroExecution & Shell**: Already decent — ensure wheel is visible as the trigger.
- **QuickInputWorkspace** (already strong — minor polish for consistency).
- **AppProfiles & PresetLibrary**: These are "ecosystem" shots — improve cards to feel like real settings surfaces with wheel integration.

### Phase 4: Supporting Polish & Consistency
- Increase wheel size/prominence in 2-3 key scenes (use normal or slightly scaled `RingflowWheel` instead of always `mini`).
- Add consistent cursor usage + light selection states where actions happen.
- Add "via Ringflow" or result attribution elements.
- Clean up unused `ProductRevealScene.tsx` (remove from exports or delete).
- Minor timeline tweaks only if stills reveal dead air or mismatched lifetimes.
- Ensure all text comes from canonical sources.

### Phase 5: Validation & Iteration
- Generate targeted stills at:
  - Intro copy/paste moments (check component lifetime parity).
  - Nearer reveal peak (wheel + document + cursor visible).
  - Core gesture (already good).
  - One before/after for each upgraded scene.
- Full `npm run typecheck`, `npm run check:timeline`.
- Review against principles checklist.
- Short render test if needed.
- Update plan doc with learnings.

---

## 5. Detailed Scene-by-Scene Changes

### NearerConceptScene (Highest priority for identity)
- Add MacWindow frame for the "current work".
- Position wheel larger and adjacent to cursor inside/edge of the window area.
- Cursor movement inside the document content.
- Use caption from copy.
- Add subtle summon animation (scale + slight lift when wheel appears).

### FrictionWorkflow
- Already improved. Further: make menu appear as if dropped from the actual MacWindow titlebar area. Add faint menu bar strip on the window if possible.

### QuickOpenTargets → Upgrade to QuickOpenWorkspace (or enhance)
- Main editor/document MacWindow.
- Selection or focus point.
- Wheel appears.
- On action: a secondary small MacWindow or card representing "Terminal / Folder opened" slides in with confirmation.
- Ringflow attribution.

### StickyNoteScene
- Current: wheel + preview + final MacWindow.
- Improve: put wheel in context of a document MacWindow. Action creates the sticky as a floating second window on the right or "desktop".

### Monitor, Shortcuts, Shell, Macro
- Ensure they have a primary context surface (terminal window, status dashboard, step list) that visibly changes because of the wheel.

### Intro (InterruptedWorkflowWorkspace)
- Already cleaned titles.
- Polish the destination input area title and layout so it feels like "where you are working" rather than a branded chat app.
- Keep rich operational timing (this is the benchmark).

### QuickInputWorkspace
- Titles cleaned.
- Keep the strong "document + sidebar prompts + input receives insertion" pattern. Ensure Ringflow credit is prominent.

### App Profiles & Presets
- Keep more visual/list style but make the surfaces look like real Ringflow settings screens (use MacWindow + lists + wheel mini as "current profile wheel").

---

## 6. Copy & Data Updates

- `copy.ts`: Add/strengthen captions and uiLabels where helpful for attribution.
- `productSemantics.ts`: Ensure all example content (prompts, monitor metrics, steps, sticky items, app profiles, presets) is already good — reuse more consistently.
- New or updated strings must be real Chinese that matches the app voice.

---

## 7. Timeline / Choreography Considerations

- Avoid big duration changes unless stills prove long dead air.
- Focus on **start frames of actions and hold positions** so that:
  - Result is visible long enough to read/understand (10-30f connection pause).
  - Earlier analogous actions in a chain have comparable full lifetime.
- After changes: mandatory stills + typecheck.

---

## 8. Execution Process (This Conversation)

We will proceed **one phase at a time**:
1. Write + save this plan.
2. Create structured todo list.
3. Execute one focused change set.
4. Run `npm run typecheck`.
5. Generate 2-4 targeted stills at critical frames.
6. Review stills (using read_file on pngs for visual description).
7. Fix issues found.
8. Move to next item.
9. Final validation pass.

**Tools we will use**:
- `search_replace` for precise edits.
- `run_terminal_command` for typecheck, stills (`npx remotion still ...`), check:timeline.
- `read_file` on source + generated still PNGs.
- `todo_write` for live tracking.
- Update this plan doc at end of major phases.

**Risk control**:
- Every edit must keep `npm run typecheck` green.
- Never leave inputRange non-monotonic.
- Prefer small, reviewable diffs.
- Revert approach if a change hurts clarity.

---

## 9. Out of Scope (for now)

- Major new audio / SFX.
- Full video re-render unless final step.
- Changing overall film length or BGM.
- Adding voiceover or subtitles.
- Three.js / canvas heavy effects (stick to React + SVG + Remotion interpolate/spring).

---

## 10. Post-Completion Checklist (from AGENTS.md + principles)

- [ ] All visible text from canonical sources.
- [ ] Text readability (Chinese + contrast).
- [ ] Native macOS details (traffic lights, title bars, glass).
- [ ] Wheel fidelity + smoothness.
- [ ] Scene timing, zero-gap chaining, uniform pacing, short connection pauses.
- [ ] Dark + light theme contrast.
- [ ] Viewer can explain what Ringflow is after one watch.
- [ ] `npm run typecheck` + `npm run check:timeline` clean.
- [ ] Stills at key moments look polished.
- [ ] Commit message in Chinese conventional format after complete reviewable piece.

---

**Next action after saving this plan**: Create todo list and begin Phase 1 (final label + variable hygiene) + verification.

This plan will be the single source of truth for the current iteration.