# Storyline Choreography Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the Remotion promo so each scene tells a readable story before showing motion, with flexible duration, stable text placement, stable wheel placement, and a clearer middle-mouse gesture demonstration.

**Architecture:** Add timeline metadata for each scene's layout and choreography beats, then make `SceneShell` consume that metadata so text, visual, and action phases are staggered consistently. Extend the core gesture scene with a central enlarged mouse teaching moment and a right-side wheel reveal triggered only after the swipe begins.

**Tech Stack:** Remotion, React, TypeScript, Node built-in test runner, pnpm.

---

### Task 1: Timeline Choreography Contract

**Files:**
- Modify: `src/config/timeline.ts`
- Create: `src/config/timeline.test.ts`

- [ ] Add tests proving `composition.durationInFrames` is derived from the last scene, `core-gesture` is longer than before, and every scene exposes ordered choreography beats.
- [ ] Implement `SceneLayout` and `SceneChoreography` metadata on scene timings.
- [ ] Run `corepack pnpm run test`.

### Task 2: Unified Scene Stage

**Files:**
- Modify: `src/scenes/SceneShell.tsx`
- Modify: `src/components/Text/PromoText.tsx`

- [ ] Add `layout`, `visualStartFrame`, `actionStartFrame`, and `holdStartFrame` props.
- [ ] Make left text vertically centered, top text horizontally centered, and center scenes fully centered.
- [ ] Make children appear only after the text phase, with a reserved fixed visual stage.

### Task 3: Core Gesture Teaching Shot

**Files:**
- Modify: `src/scenes/05_CoreGestureScene.tsx`

- [ ] Start with an enlarged mouse centered in the frame.
- [ ] Begin the rightward swipe before the wheel appears.
- [ ] Reveal the double-layer wheel on the right after swipe begins.
- [ ] Hold the selected sector and result long enough to read.

### Task 4: Scene Pass

**Files:**
- Modify: `src/scenes/*.tsx` as needed

- [ ] Wire text-first choreography props into all scenes.
- [ ] Use top layout for feature demonstration scenes that read better with centered text above visuals.
- [ ] Keep the product reveal and brand scenes restrained and readable.

### Task 5: Verification

**Files:**
- Render output stays ignored under `out/`.

- [ ] Run `corepack pnpm run build`.
- [ ] Run `corepack pnpm run stills`.
- [ ] Inspect representative stills for text placement, wheel placement, and gesture readability.
