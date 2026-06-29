
---
name: storyboard-import
description: Use this skill when converting storyboard Excel, CSV, or Markdown shot lists into Remotion timeline config, scene components, subtitles, asset lists, and production tasks.
---
# Storyboard Import Skill

Convert storyboard files into:

- src/config/timeline.ts
- src/config/copy.ts
- src/config/assets.ts
- scene component stubs
- production checklist

Rules:

- Preserve shot number, start time, end time, duration, visual direction, narration, screen text, and asset needs.
- Detect overlapping timecodes and report them.
- Convert seconds to frames using fps from the project config.
- Keep Chinese copy as real text, not image text.
- Generate TODO comments for missing assets.
