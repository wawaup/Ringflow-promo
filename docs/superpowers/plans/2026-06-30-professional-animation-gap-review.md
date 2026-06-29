# Ringflow Promo Professional Animation Gap Review

## Current Verdict

The current animatic is a useful Remotion proof of pipeline, but it is not yet a professional launch promo. The main gap is not only motion smoothness. The larger issue is that several shots still explain features with generic UI props instead of showing Ringflow's real product surfaces, interaction states, and macOS-native behavior.

## Corrections Applied In This Pass

- Product reveal now uses the single-layer wheel.
- The folder outer ring appears only in the core gesture shot, where the cursor drag implies the deeper grouped wheel interaction.
- The folder ring has explicit frame-driven unfold and rotation controls.
- Dark feature shots keep the wheel in the dark single-layer mode unless the shot specifically needs the grouped outer ring.
- Outro uses the real app logo instead of another wheel.
- Several box-and-label placeholders were replaced with product-specific surfaces:
  - writing workspace with prompt list and inserted prompt state
  - friction stack based on menus and window switching
  - quick-open app target grid
  - macro execution timeline
  - monitor bars
  - real app configuration screenshot
  - preset library import surface

## Remaining Creative Gap

### 1. Product Truth

Some shots still need stronger source fidelity. The app screenshot solves the configuration section, but the feature scenes should eventually be based on actual Ringflow data models and screenshots, not invented labels.

Next move:
- Build a canonical `promoProductData.ts` from the app's default actions, preset names, app bindings, monitor metrics, and prompt-folder contents.
- Replace hand-written scene labels with this canonical data.

### 2. Motion Language

The current motion uses frame-based Remotion interpolation. It is technically stable, but the edit still lacks a signature motion language.

Appropriate tool use:
- Remotion interpolation remains the timeline authority.
- GSAP is useful only if we add a complex nested choreography layer for UI cards, app windows, or path-following gestures.
- Canvas is appropriate for gesture trails, cursor pressure fields, and subtle velocity blur.
- Three.js is appropriate for a final brand/logo spatial reveal or a hero wheel close-up with camera depth, not for every feature shot.
- D3 is appropriate only if monitor/data scenes become real animated charts.
- Lottie is appropriate if we import designed icon animations from a motion workflow, not as a substitute for product UI.

### 3. Editing Rhythm

The current shot sequence follows the script, but the pacing is still too evenly staged. A launch promo needs contrast:
- slower first reveal
- sharper gesture snap
- faster feature montage
- calmer brand close

Next move:
- Add per-shot camera scale and parallax.
- Add hard visual beats at interaction moments: press, drag threshold, sector lock, release.
- Trim explanatory visual clutter during feature montage.

### 4. Asset Direction

Avoid decorative generic cards. Every visible prop should answer one of these:
- Is this a real Ringflow screen?
- Is this a real macOS interaction?
- Is this an abstract motion layer that clarifies the gesture?

If not, remove or replace it.

## Next Implementation Plan

1. Create canonical promo product data and use it across scenes.
2. Add Canvas-based gesture trail and velocity field for the core interaction.
3. Replace remaining generic scenes with source-faithful Ringflow surfaces.
4. Add camera choreography to 4 key shots: intro, reveal, core gesture, outro.
5. Render a fresh still board and compare against this review before final MP4.
