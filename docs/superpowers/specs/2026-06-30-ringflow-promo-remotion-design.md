# Ringflow Promo Remotion Design

## Context

Ringflow-promo is a Remotion production workspace for a 36-second Apple-like macOS product film. The current source package contains:

- `Ringflow-promo/AGENTS.md`: project constraints and preferred commands.
- `Ringflow-promo/.agents/skills/ringflow-promo/SKILL.md`: Ringflow promo style, structure, and QA rules.
- `Ringflow-promo/.agents/skills/storyboard-import/SKILL.md`: storyboard-to-config import rules.
- `Ringflow-promo/.agents/skills/svg-ui-assets/SKILL.md`: vector UI asset rules.
- `Ringflow-promo/.agents/skills/motion-qa/SKILL.md`: motion review checklist.
- `ringflow_storyboard_cn_detailed_prompts.xlsx`: 15-shot, 36-second Chinese storyboard.
- `素材列表.xlsx`: A01-A20 recommended asset list.
- `penguinmusic-abstract-minimal-technology-139186.mp3`: candidate background music.

The app already contains the authoritative wheel implementation in SwiftUI:

- `Ringflow/Utils/WheelConfig.swift`
- `Ringflow/Utils/WheelGeometry.swift`
- `Ringflow/Views/Wheel/WheelStyle.swift`
- `Ringflow/Views/Wheel/WheelCanvasView.swift`

The video should reuse those product decisions instead of inventing a separate promo-only wheel.

## Goal

Create a code-driven promotional video pipeline that Codex can maintain scene by scene:

- Use Remotion + React + TypeScript as the main timeline and render system.
- Use React/SVG components for the Ringflow wheel and product UI.
- Use real rendered Chinese and English text, never AI-generated text baked into video.
- Avoid browser screen recording as the primary production path.
- Keep motion smooth, precise, and restrained.
- Produce reusable components for future website hero videos, App Store previews, and feature clips.

## Non-Goals

- Do not use AI text-to-video as the main source for UI-heavy shots.
- Do not build the whole film in After Effects as the primary editable artifact.
- Do not depend on static wheel screenshots for interaction-heavy scenes.
- Do not show real Apple logos, third-party logos, private data, or unconfirmed product behavior.
- Do not create a dense marketing landing page; this is a video production workspace.

## Recommended Production Approach

Use a hybrid but code-first workflow:

1. Remotion owns the final video timeline, text, UI layout, transitions, audio placement, and export.
2. React/SVG owns the Ringflow wheel, cursor, trails, cards, toasts, mock macOS windows, and feature UI.
3. AI-generated imagery is allowed only for abstract backgrounds, soft light textures, style frames, or cover art.
4. Rive or Lottie can be added later for isolated micro-animations, but not for the full film timeline.
5. FFmpeg can be used after render for encoding, audio checks, or format conversions if needed.

This keeps the precise parts precise and lets AI help only where generative looseness is useful.

## Composition Settings

Default first version:

- Aspect ratio: 16:9
- Resolution: 1920x1080 for fast iteration, with the structure ready for 2560x1440 or 3840x2160 export.
- FPS: 60 for wheel/cursor smoothness.
- Duration: 36 seconds, 2160 frames at 60 fps.
- Text safe area: keep key text at least 80px from left/right and 100px from top/bottom at 1080p.
- Main headline size target: 84px minimum at 1080p unless a scene-specific layout requires larger.
- Supporting text target: 44px minimum at 1080p.
- UI labels target: 32px minimum at 1080p when meant to be readable.

## Timeline Model

The storyboard rows should be imported into `src/config/timeline.ts` with explicit frame ranges. The Excel timecodes intentionally overlap in several places. Treat those as crossfade or handoff overlaps, not as accidental duplicate scenes.

| Shot | Time | Scene |
| --- | --- | --- |
| 01 | 0.0-2.8s | IntroFocusScene |
| 02 | 2.8-5.2s | FrictionScene |
| 03 | 5.2-7.1s | NearerConceptScene |
| 04 | 7.1-8.4s | ProductRevealScene |
| 05 | 8.4-10.0s | CoreGestureScene |
| 06 | 10.0-11.35s | QuickInputScene |
| 07 | 11.25-13.75s | QuickOpenScene |
| 08 | 13.75-16.65s | StickyNoteScene |
| 09 | 16.55-19.8s | MacroSequenceScene |
| 10 | 19.75-22.35s | ShellScriptScene |
| 11 | 22.25-24.55s | ShortcutsScene |
| 12 | 24.45-26.75s | MonitorScene |
| 13 | 26.6-29.9s | AppProfilesScene |
| 14 | 29.75-33.75s | PresetLibraryScene |
| 15 | 33.45-36.0s | OutroScene |

Each scene should be a separate component. The root composition should sequence scenes from timeline config rather than hardcoding magic frame numbers inside `Root.tsx`.

## Project Structure

Target structure inside `Ringflow-promo`:

```text
public/
  audio/
  assets/
src/
  Root.tsx
  PromoFilm.tsx
  config/
    assets.ts
    copy.ts
    timeline.ts
    theme.ts
    wheel.ts
  components/
    Background/
    Cursor/
    MacUI/
    Text/
    Toast/
    Wheel/
  scenes/
    01_IntroFocusScene.tsx
    02_FrictionScene.tsx
    03_NearerConceptScene.tsx
    04_ProductRevealScene.tsx
    05_CoreGestureScene.tsx
    06_QuickInputScene.tsx
    07_QuickOpenScene.tsx
    08_StickyNoteScene.tsx
    09_MacroSequenceScene.tsx
    10_ShellScriptScene.tsx
    11_ShortcutsScene.tsx
    12_MonitorScene.tsx
    13_AppProfilesScene.tsx
    14_PresetLibraryScene.tsx
    15_OutroScene.tsx
```

## Wheel Component Design

Build `RingflowWheel` as the hero component. It should support:

- `theme: "light" | "dark"`
- `activeSegment`
- `runningSegment`
- `centerLabel`
- `mini`
- `showCursorReveal`
- `showSegmentStagger`
- `showGlowPulse`
- `showDragTrail`
- `releaseProgress`
- optional folder outer ring state

Port these constants from Swift:

```ts
export const wheelConfig = {
  sectorCount: 8,
  overlayOuterRadius: 128,
  overlayInnerDeadZoneRatio: 0.375,
  overlayCenterGlassRatio: 0.82,
  overlayLayoutInset: 4,
  folderRingGap: 8,
  folderRingThickness: 60,
  fanPresentStaggerSeconds: 0.008,
  fanDismissStaggerSeconds: 0.005,
  fanDismissScale: 0.9,
};
```

Port geometry from Swift:

- Sector path starts at `-Math.PI / 2 + sectorAngle * index`.
- Sector mid-angle is `-Math.PI / 2 + sectorAngle * (index + 0.5)`.
- Label position uses the annulus mid-radius.
- Hit testing uses `atan2(dy, dx) + Math.PI / 2`, normalized to `0...2PI`.

The wheel should draw SVG annulus sectors and labels directly. Static PNG wheel states may be useful for comparison, but the film should animate the SVG version.

## Motion Design

All motion must be frame-based. Do not use CSS transitions, CSS animations, or Tailwind animation utilities.

Use Remotion `useCurrentFrame`, `interpolate`, and `Easing.bezier` for most timing. Use Remotion `spring` only for explicit physical moments: wheel reveal, sticky note pop, center pulse, and release confirmation.

Default motion language:

- Wheel reveal: fast, soft spring, based on Swift `fanUnfold` response `0.22` and damping fraction `0.86`.
- Highlight: 0.13s ease-out equivalent.
- Wheel fold: fast ease-in, around 0.1s, ending at scale `0.9` before fading.
- Cursor motion: precise but human, using curved eased paths and short holds before release.
- Stagger: 8 sector reveal with 0.008s spacing.
- Macro and card sequences: one element at a time, no cluttered simultaneous dashboard.

## Visual System

Use two dominant environments:

- Light: silver-white, soft blue highlights, large negative space, subtle depth.
- Dark: deep blue-gray glass, enough text contrast, restrained glow.

Avoid:

- noisy particles,
- cyberpunk neon,
- e-commerce poster composition,
- fake dense control panels,
- generic gradient-orb decoration.

The video should feel macOS-native. Mock windows should be recognizable but not dependent on real Apple branding.

## Asset Strategy

Map the existing A01-A20 asset list into code assets first:

- A01 Logo/Icon: use provided app icon if available; otherwise create a temporary clean vector placeholder and mark it replaceable.
- A02-A04 Wheel states: generated by `RingflowWheel` props.
- A05-A14 Feature scenes/backgrounds: React components and mock macOS UI.
- A15 Cursor: SVG component.
- A16 Action icons: lucide-react or custom simple SVGs, kept stylistically consistent.
- A17 Toast: React component.
- A18 Labels: real text inside components.
- A19 Background: CSS/SVG/Canvas gradient and optional generated texture.
- A20 Copy: `src/config/copy.ts` from storyboard.

This reduces the initial hard dependency on Figma or AE-exported layers.

## Scene Implementation Strategy

Phase 1 should create an animatic that proves timing and composition:

- All 15 scenes exist.
- Each scene has real Chinese text from the storyboard.
- Product UI placeholders are clean and on-style.
- Ringflow wheel reveal, cursor path, and one highlighted segment work.
- Scene overlaps are represented as intentional transitions.
- Audio is placed but not fully mixed.

Phase 2 should raise fidelity:

- Finish full wheel states and outer ring.
- Build feature-specific mock UI.
- Add cursor trails, toasts, macro step running state, terminal output, monitor metrics, app profile cards, and preset library cards.
- Render representative still frames for QA.

Phase 3 should polish and export:

- Tune timing against music.
- Add sound effects if available.
- Run text clipping checks and motion QA.
- Render final MP4.

## Testing and QA

Use these checks before claiming a milestone is complete:

- `npm run typecheck`
- `npm run build`
- `npm run render` or a representative Remotion still render
- Visual QA at several frames: early concept, wheel reveal, quick input, sticky note, macro, app profiles, outro
- Check Chinese text is readable and not clipped.
- Check wheel geometry against Swift constants.
- Check export is 1920x1080 or better and 60 fps unless changed deliberately.

## Risks

- Installing Remotion may require network access if dependencies are not already present.
- The current `.gitignore` marks `Ringflow-promo` ignored, so generated project files may need a deliberate repo-boundary decision before committing.
- The storyboard is ambitious for 36 seconds. The first animatic should reveal whether some feature shots need shorter montage treatment.
- App icon/logo source is not yet visible in `Ringflow-promo`; final brand shots may need a supplied icon or a copied approved app asset.

## Approval Check

This design recommends starting with a Remotion animatic and real SVG wheel component. Implementation should not begin until the user confirms this scope and the repo-boundary choice for tracking `Ringflow-promo` files.
