
---
name: ringflow-promo
description: Use this skill when creating or editing the Ringflow macOS app promotional video, Remotion scenes, Apple-like UI animation, action wheel animation, product demo motion graphics, subtitles, timing, and video export.
---
# Ringflow Promo Skill

## Product style

Ringflow is a macOS productivity app based on a radial action wheel. The video style should feel Apple-like, macOS-native, elegant, lightweight, glassy, and precise.

## Visual direction

- Use soft white-blue gradients for light scenes.
- Use deep blue-gray glassmorphism for dark scenes.
- Avoid heavy cyberpunk, neon overload, noisy particles, and e-commerce poster style.
- Prefer large negative space, soft shadows, subtle glow, and clean typography.
- UI should look native to macOS.

## Technical direction

- Use Remotion + React + TypeScript.
- Use React/SVG for the Ringflow wheel instead of static screenshots whenever animation is needed.
- Use real rendered text for all Chinese and English copy.
- Do not let AI video models generate Chinese text.
- Use screenshots only as supporting assets, not as the only animation source.
- Every scene should be a separate component.
- Put timeline data in src/config/timeline.ts.
- Keep animation curves smooth and restrained.

## Ringflow wheel behavior

The wheel should support:

- theme: light | dark
- activeSegment
- runningSegment
- centerLabel
- mini wheel
- cursor reveal
- segment stagger
- glow pulse
- drag trail
- release-to-trigger animation

## Brand copy direction

Main feeling:

- 让 Mac 操作，更接近直觉
- 一划唤出，一圈完成
- 把常用动作，放在手边
- Different apps, different wheels

## Quality rules

Before finishing a task:

- Run typecheck or build if available.
- Render or preview at least one frame if possible.
- Check that text is not clipped.
- Check that all animations are frame-based, not browser-recording-based.
- Avoid adding dependencies unless necessary.
