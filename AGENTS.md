
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

Before finishing:

- Check text readability.
- Check scene timing.
- Check dark theme contrast.
- Check wheel animation smoothness.
- Check export resolution and fps.

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
