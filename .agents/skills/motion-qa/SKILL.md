
---
name: motion-qa
description: Use this skill to review Remotion videos, product motion graphics, scene timing, UI consistency, animation quality, text readability, export settings, and visual polish.
---
# Motion QA Skill

When reviewing a Remotion promotional video, check:

## Timing

- Total duration matches the storyboard.
- Scene transitions are not too abrupt.
- No scene holds too long without motion.
- Important product moments have enough screen time.

## Visual quality

- Text is readable at 1080p.
- Chinese characters are not clipped.
- UI spacing feels macOS-native.
- Shadows and glows are subtle, not muddy.
- Dark theme elements have enough contrast.
- Light theme is not overexposed.

## Animation quality

- Use spring or eased interpolate curves.
- Avoid linear robotic movement unless intentional.
- Cursor movement should feel human but precise.
- Wheel reveal should feel fast, soft, and responsive.
- Repeated elements should use staggered timing.

## Brand consistency

- Apple-like, clean, elegant.
- No cluttered e-commerce style.
- No excessive neon cyberpunk.
- No inconsistent icon styles.

## Technical checks

- Run npm run build or npm run typecheck if available.
- Check Remotion render command.
- Verify 1920x1080, 30fps or 60fps as requested.
- Verify audio, subtitles, and safe margins.
