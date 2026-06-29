# Ringflow Promo Remotion Animatic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first runnable Ringflow-promo Remotion animatic: a 36-second, 15-scene, 1920x1080, 60fps product film skeleton with real Chinese copy, a React/SVG Ringflow wheel, cursor motion, audio placement, and representative still-frame QA.

**Architecture:** Treat `Ringflow-promo` as a self-contained video project. Remotion owns timeline sequencing and export; React/SVG components own the wheel, cursor, mock macOS UI, text, cards, and toasts. The first milestone is an animatic that proves timing, scene composition, and wheel interaction, before high-fidelity polishing.

**Tech Stack:** Remotion, React, TypeScript, SVG, CSS modules/plain CSS, Vitest for geometry/config tests, Node/pnpm scripts, existing storyboard Excel as source reference.

---

## Repo Boundary

All promo files live under `/Users/admin/dev/Ringflow/Ringflow-promo`.

The parent repo currently ignores `Ringflow-promo`, so implementation commits should be made inside a nested git repository at `/Users/admin/dev/Ringflow/Ringflow-promo` unless the user later decides to track the promo project in the parent repo. Do not move promo plans/specs back to the parent `docs/` folder.

## File Structure

Create or modify these files inside `Ringflow-promo`:

- Create: `.gitignore` - ignore Remotion build outputs and dependencies inside the promo project.
- Create: `package.json` - pnpm scripts and dependencies.
- Create: `tsconfig.json` - TypeScript config for Remotion.
- Create: `remotion.config.ts` - Remotion output settings.
- Create: `src/index.ts` - Remotion entry registration.
- Create: `src/Root.tsx` - composition definition.
- Create: `src/PromoFilm.tsx` - top-level timeline renderer.
- Create: `src/styles/global.css` - global frame styles and font stack.
- Create: `src/config/assets.ts` - audio and asset references.
- Create: `src/config/copy.ts` - storyboard text and UI copy.
- Create: `src/config/timeline.ts` - 15-shot timing, frame conversion, overlap metadata.
- Create: `src/config/theme.ts` - colors, typography, safe area, shadows.
- Create: `src/config/wheel.ts` - SwiftUI-derived wheel constants and labels.
- Create: `src/components/Wheel/wheelGeometry.ts` - pure geometry helpers.
- Create: `src/components/Wheel/wheelGeometry.test.ts` - geometry regression tests.
- Create: `src/components/Wheel/RingflowWheel.tsx` - React/SVG wheel.
- Create: `src/components/Cursor/Cursor.tsx` - SVG cursor and optional trail.
- Create: `src/components/Background/PromoBackground.tsx` - light/dark backgrounds.
- Create: `src/components/MacUI/MacWindow.tsx` - mock native macOS window.
- Create: `src/components/MacUI/FeatureCards.tsx` - resource, macro, profile, and preset cards.
- Create: `src/components/Text/PromoText.tsx` - headline/caption components.
- Create: `src/components/Toast/Toast.tsx` - status toast component.
- Create: `src/scenes/SceneShell.tsx` - common scene layout wrapper.
- Create: `src/scenes/01_IntroFocusScene.tsx` through `src/scenes/15_OutroScene.tsx` - individual scene components.
- Create: `src/scenes/index.ts` - scene registry.
- Create: `scripts/check-timeline.mjs` - timeline duration and overlap check.
- Create: `scripts/render-stills.mjs` - representative still render helper.
- Move/copy: `penguinmusic-abstract-minimal-technology-139186.mp3` to `public/audio/penguinmusic-abstract-minimal-technology-139186.mp3`.

Do not modify macOS app Swift files during this animatic milestone.

## Task 1: Initialize Promo Project Boundary

**Files:**
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/.gitignore`
- Create or initialize: `/Users/admin/dev/Ringflow/Ringflow-promo/.git/`

- [ ] **Step 1: Check whether promo already has its own git repo**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git rev-parse --show-toplevel
```

Expected if not initialized:

```text
fatal: not a git repository
```

Expected if already initialized:

```text
/Users/admin/dev/Ringflow/Ringflow-promo
```

- [ ] **Step 2: Initialize nested git repo if missing**

Run only if Step 1 reports "not a git repository":

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git init
```

Expected:

```text
Initialized empty Git repository in /Users/admin/dev/Ringflow/Ringflow-promo/.git/
```

- [ ] **Step 3: Create promo-local `.gitignore`**

Write `/Users/admin/dev/Ringflow/Ringflow-promo/.gitignore`:

```gitignore
node_modules/
dist/
out/
build/
.remotion/
.turbo/
.DS_Store
npm-debug.log*
coverage/
*.mp4
*.mov
*.webm
*.wav
*.aac
```

- [ ] **Step 4: Verify only promo-local files are visible**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git status --short
```

Expected includes source project files such as:

```text
?? .gitignore
?? AGENTS.md
?? docs/
?? ringflow_storyboard_cn_detailed_prompts.xlsx
?? 素材列表.xlsx
```

- [ ] **Step 5: Commit project boundary**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git add .gitignore AGENTS.md .agents docs ringflow_storyboard_cn_detailed_prompts.xlsx 素材列表.xlsx penguinmusic-abstract-minimal-technology-139186.mp3
git commit -m "chore: 初始化宣传片工程边界"
```

Expected:

```text
[main <hash>] chore: 初始化宣传片工程边界
```

## Task 2: Create Minimal Remotion TypeScript Project

**Files:**
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/package.json`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/tsconfig.json`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/remotion.config.ts`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/index.ts`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/Root.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/styles/global.css`
- Modify: `/Users/admin/dev/Ringflow/Ringflow-promo/.gitignore`

- [ ] **Step 1: Write `package.json`**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/package.json`:

```json
{
  "name": "ringflow-promo",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "remotion studio src/index.ts",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check:timeline": "node scripts/check-timeline.mjs",
    "build": "pnpm run typecheck && pnpm run test && pnpm run check:timeline",
    "still": "remotion still src/index.ts RingflowPromo out/stills/frame-900.png --frame=900 --scale=0.5",
    "render": "remotion render src/index.ts RingflowPromo out/ringflow-promo-animatic.mp4"
  },
  "dependencies": {
    "@remotion/media": "^4.0.0",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "remotion": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.5.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "remotion.config.ts"]
}
```

- [ ] **Step 3: Write `remotion.config.ts`**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/remotion.config.ts`:

```ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle");
Config.setConcurrency(null);
```

- [ ] **Step 4: Write root Remotion entry files**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/index.ts`:

```ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
import "./styles/global.css";

registerRoot(RemotionRoot);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/Root.tsx`:

```tsx
import { Composition } from "remotion";
import { PromoFilm } from "./PromoFilm";
import { composition } from "./config/timeline";

export const RemotionRoot = () => {
  return (
    <Composition
      id="RingflowPromo"
      component={PromoFilm}
      durationInFrames={composition.durationInFrames}
      fps={composition.fps}
      width={composition.width}
      height={composition.height}
    />
  );
};
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/styles/global.css`:

```css
:root {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: #111827;
  background: #f7fbff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  overflow: hidden;
}
```

- [ ] **Step 5: Install dependencies**

Run with network approval if needed:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm install
```

Expected:

```text
added ... packages
```

- [ ] **Step 6: Run typecheck to confirm expected missing files**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm run typecheck
```

Expected failure at this stage:

```text
Cannot find module './PromoFilm'
Cannot find module './config/timeline'
```

- [ ] **Step 7: Commit scaffold**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git add package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json remotion.config.ts src/index.ts src/Root.tsx src/styles/global.css .gitignore
git commit -m "chore: 搭建 Remotion TypeScript 工程"
```

Expected:

```text
[main <hash>] chore: 搭建 Remotion TypeScript 工程
```

## Task 3: Add Timeline, Copy, Theme, and Asset Config

**Files:**
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/config/timeline.ts`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/config/copy.ts`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/config/assets.ts`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/config/theme.ts`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/scripts/check-timeline.mjs`
- Copy: `/Users/admin/dev/Ringflow/Ringflow-promo/public/audio/penguinmusic-abstract-minimal-technology-139186.mp3`

- [ ] **Step 1: Create audio folder and copy music**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
mkdir -p public/audio
cp penguinmusic-abstract-minimal-technology-139186.mp3 public/audio/penguinmusic-abstract-minimal-technology-139186.mp3
```

Expected:

```text
public/audio/penguinmusic-abstract-minimal-technology-139186.mp3
```

- [ ] **Step 2: Write `timeline.ts`**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/config/timeline.ts`:

```ts
export const FPS = 60;

export const composition = {
  id: "RingflowPromo",
  width: 1920,
  height: 1080,
  fps: FPS,
  durationSeconds: 36,
  durationInFrames: 36 * FPS,
} as const;

export type SceneId =
  | "intro-focus"
  | "friction"
  | "nearer-concept"
  | "product-reveal"
  | "core-gesture"
  | "quick-input"
  | "quick-open"
  | "sticky-note"
  | "macro-sequence"
  | "shell-script"
  | "shortcuts"
  | "monitor"
  | "app-profiles"
  | "preset-library"
  | "outro";

export type SceneTiming = {
  shot: number;
  id: SceneId;
  name: string;
  startSeconds: number;
  endSeconds: number;
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
  overlapWithNextFrames: number;
};

const frame = (seconds: number) => Math.round(seconds * FPS);

const rawScenes = [
  [1, "intro-focus", "开场：保持连贯", 0, 2.8],
  [2, "friction", "操作绕远", 2.8, 5.2],
  [3, "nearer-concept", "理念转折：常用的，应该更近一点", 5.2, 7.1],
  [4, "product-reveal", "Ringflow 产品亮相", 7.1, 8.4],
  [5, "core-gesture", "核心交互：按住、划动、完成", 8.4, 10],
  [6, "quick-input", "快捷输入", 10, 11.35],
  [7, "quick-open", "快捷打开", 11.25, 13.75],
  [8, "sticky-note", "便签", 13.75, 16.65],
  [9, "macro-sequence", "快捷键 / 宏序列", 16.55, 19.8],
  [10, "shell-script", "Shell 脚本", 19.75, 22.35],
  [11, "shortcuts", "macOS 快捷指令", 22.25, 24.55],
  [12, "monitor", "系统监视器", 24.45, 26.75],
  [13, "app-profiles", "应用独立配置", 26.6, 29.9],
  [14, "preset-library", "预设库", 29.75, 33.75],
  [15, "outro", "品牌收尾", 33.45, 36],
] as const;

export const scenes: SceneTiming[] = rawScenes.map(
  ([shot, id, name, startSeconds, endSeconds], index) => {
    const next = rawScenes[index + 1];
    const startFrame = frame(startSeconds);
    const endFrame = frame(endSeconds);
    const nextStartFrame = next ? frame(next[3]) : endFrame;
    return {
      shot,
      id,
      name,
      startSeconds,
      endSeconds,
      startFrame,
      endFrame,
      durationInFrames: endFrame - startFrame,
      overlapWithNextFrames: Math.max(0, endFrame - nextStartFrame),
    };
  },
);
```

- [ ] **Step 3: Write `copy.ts`**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/config/copy.ts`:

```ts
import type { SceneId } from "./timeline";

export type SceneCopy = {
  headline: string[];
  caption?: string;
  uiLabels?: string[];
};

export const sceneCopy: Record<SceneId, SceneCopy> = {
  "intro-focus": {
    headline: ["正在做的事，", "应该保持连贯。"],
    uiLabels: ["Prompt 模板", "正文草稿", "灵感片段"],
  },
  friction: {
    headline: ["找来找去。", "来回切换。", "一遍又一遍。"],
    uiLabels: ["菜单", "二级菜单", "窗口切换"],
  },
  "nearer-concept": {
    headline: ["常用的，", "应该更近一点。"],
  },
  "product-reveal": {
    headline: ["Ringflow", "出现在光标旁边。"],
  },
  "core-gesture": {
    headline: ["按住。", "划动。", "完成。"],
  },
  "quick-input": {
    headline: ["常用文字，一划输入。"],
    uiLabels: ["润色改写", "总结提炼", "Prompt inserted · Clipboard restored"],
  },
  "quick-open": {
    headline: ["常用应用、文件、文件夹，一划打开。"],
    uiLabels: ["Terminal", "README.md", "Project Folder"],
  },
  "sticky-note": {
    headline: ["灵感，不必打断。"],
    uiLabels: ["会议要点", "下次同步前确认三件事"],
  },
  "macro-sequence": {
    headline: ["复杂流程，", "一次划动。"],
    uiLabels: ["复制", "切换应用", "粘贴", "保存"],
  },
  "shell-script": {
    headline: ["脚本，也可以一划运行。"],
    uiLabels: ["pnpm run build", "Done in 2.4s"],
  },
  shortcuts: {
    headline: ["已有的自动化，也能更近一点。"],
    uiLabels: ["发送到手机", "快捷指令完成"],
  },
  monitor: {
    headline: ["状态，一眼看到。"],
    uiLabels: ["CPU", "内存", "网络", "电池"],
  },
  "app-profiles": {
    headline: ["不同 App，", "不同轮盘。"],
    uiLabels: ["Writing", "Coding", "Meeting"],
  },
  "preset-library": {
    headline: ["下载。导入。开始使用。"],
    uiLabels: ["AI 写作", "开发者", "会议记录"],
  },
  outro: {
    headline: ["让 Mac 操作，", "更接近直觉。", "Ringflow"],
  },
};
```

- [ ] **Step 4: Write `assets.ts` and `theme.ts`**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/config/assets.ts`:

```ts
export const assets = {
  audio: {
    music: "audio/penguinmusic-abstract-minimal-technology-139186.mp3",
  },
  missingAssetTag: "replace-with-approved-ringflow-brand-asset",
} as const;
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/config/theme.ts`:

```ts
export const theme = {
  safeArea: {
    x: 120,
    y: 110,
  },
  colors: {
    ink: "#111827",
    muted: "#5d6676",
    softBlue: "#eaf5ff",
    accentBlue: "#2f7fd3",
    darkInk: "#e8edf7",
    darkMuted: "#9aa7bd",
    darkPanel: "rgba(23, 31, 45, 0.72)",
    glassLight: "rgba(255, 255, 255, 0.64)",
    glassDark: "rgba(29, 38, 54, 0.66)",
    runningOrange: "#f59e0b",
  },
  type: {
    headline: 88,
    caption: 44,
    label: 32,
    small: 24,
  },
  shadow: {
    panel: "0 24px 80px rgba(30, 45, 70, 0.16), 0 2px 12px rgba(30, 45, 70, 0.08)",
    wheel: "0 20px 64px rgba(20, 40, 70, 0.20)",
  },
} as const;
```

- [ ] **Step 5: Write timeline checker**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/scripts/check-timeline.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const timelinePath = path.join(process.cwd(), "src/config/timeline.ts");
const source = fs.readFileSync(timelinePath, "utf8");

const sceneRows = [...source.matchAll(/\[(\d+), "([^"]+)", "([^"]+)", ([0-9.]+), ([0-9.]+)\]/g)].map(
  (match) => ({
    shot: Number(match[1]),
    id: match[2],
    name: match[3],
    start: Number(match[4]),
    end: Number(match[5]),
  }),
);

if (sceneRows.length !== 15) {
  throw new Error(`Expected 15 scenes, found ${sceneRows.length}`);
}

if (sceneRows[0].start !== 0 || sceneRows.at(-1).end !== 36) {
  throw new Error("Timeline must start at 0s and end at 36s");
}

for (const scene of sceneRows) {
  if (scene.end <= scene.start) {
    throw new Error(`Scene ${scene.shot} has invalid duration`);
  }
}

const overlaps = [];
for (let i = 0; i < sceneRows.length - 1; i += 1) {
  const current = sceneRows[i];
  const next = sceneRows[i + 1];
  if (current.end > next.start) {
    overlaps.push(`${current.shot}->${next.shot}: ${(current.end - next.start).toFixed(2)}s`);
  }
}

console.log(`Timeline OK: ${sceneRows.length} scenes, 36s total.`);
console.log(`Intentional overlaps: ${overlaps.join(", ")}`);
```

- [ ] **Step 6: Run timeline check**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm run check:timeline
```

Expected:

```text
Timeline OK: 15 scenes, 36s total.
Intentional overlaps: 6->7: 0.10s, 8->9: 0.10s, 9->10: 0.05s, 10->11: 0.10s, 11->12: 0.10s, 12->13: 0.15s, 13->14: 0.15s, 14->15: 0.30s
```

- [ ] **Step 7: Commit config**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git add public/audio src/config scripts/check-timeline.mjs
git commit -m "feat: 导入宣传片时间轴与文案配置"
```

Expected:

```text
[main <hash>] feat: 导入宣传片时间轴与文案配置
```

## Task 4: Implement Wheel Geometry with Tests

**Files:**
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/config/wheel.ts`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Wheel/wheelGeometry.ts`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Wheel/wheelGeometry.test.ts`

- [ ] **Step 1: Write failing geometry tests**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Wheel/wheelGeometry.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  annulusSectorPath,
  labelPosition,
  sectorIndexAtPoint,
  sectorMidAngle,
} from "./wheelGeometry";
import { wheelConfig } from "../../config/wheel";

describe("wheelGeometry", () => {
  it("matches Swift sector mid-angle convention with index 0 at top-right", () => {
    expect(sectorMidAngle(0, 8)).toBeCloseTo(-Math.PI / 2 + Math.PI / 8, 6);
    expect(sectorMidAngle(2, 8)).toBeCloseTo(Math.PI / 2 - Math.PI / 8, 6);
  });

  it("maps points to the same sector index convention as Swift hit testing", () => {
    const center = { x: 128, y: 128 };
    expect(sectorIndexAtPoint({ x: 128, y: 40 }, center, 8, 128, 0.375)).toBe(0);
    expect(sectorIndexAtPoint({ x: 216, y: 128 }, center, 8, 128, 0.375)).toBe(2);
    expect(sectorIndexAtPoint({ x: 128, y: 128 }, center, 8, 128, 0.375)).toBe(null);
  });

  it("creates an SVG annulus path with two arcs and a close path", () => {
    const path = annulusSectorPath(0, 8, { x: 128, y: 128 }, 128, 48);
    expect(path).toContain("A 128 128");
    expect(path).toContain("A 48 48");
    expect(path.endsWith("Z")).toBe(true);
  });

  it("places labels on the annulus mid-radius", () => {
    const point = labelPosition(0, 8, { x: 128, y: 128 }, wheelConfig.overlayOuterRadius, wheelConfig.overlayInnerDeadZoneRatio);
    const dx = point.x - 128;
    const dy = point.y - 128;
    const distance = Math.hypot(dx, dy);
    expect(distance).toBeCloseTo(88, 0);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm run test -- src/components/Wheel/wheelGeometry.test.ts
```

Expected:

```text
Cannot find module './wheelGeometry'
```

- [ ] **Step 3: Write wheel constants**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/config/wheel.ts`:

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
} as const;

export const wheelSegments = [
  { id: "quick-input", label: "润色改写" },
  { id: "quick-open", label: "快捷打开" },
  { id: "sticky-note", label: "便签" },
  { id: "macro", label: "宏序列" },
  { id: "shell", label: "Shell" },
  { id: "shortcuts", label: "快捷指令" },
  { id: "monitor", label: "监视器" },
  { id: "profiles", label: "配置" },
] as const;

export type WheelSegmentId = (typeof wheelSegments)[number]["id"];
```

- [ ] **Step 4: Write wheel geometry implementation**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Wheel/wheelGeometry.ts`:

```ts
export type Point = {
  x: number;
  y: number;
};

const polarPoint = (center: Point, radius: number, angle: number): Point => ({
  x: center.x + Math.cos(angle) * radius,
  y: center.y + Math.sin(angle) * radius,
});

export const sectorMidAngle = (index: number, sectorCount: number): number => {
  const sectorAngle = (2 * Math.PI) / sectorCount;
  return -Math.PI / 2 + sectorAngle * (index + 0.5);
};

export const annulusMidRadius = (outerRadius: number, innerDeadZoneRatio: number): number => {
  return outerRadius * (1 + innerDeadZoneRatio) / 2;
};

export const labelPosition = (
  index: number,
  sectorCount: number,
  center: Point,
  outerRadius: number,
  innerDeadZoneRatio: number,
): Point => {
  const angle = sectorMidAngle(index, sectorCount);
  return polarPoint(center, annulusMidRadius(outerRadius, innerDeadZoneRatio), angle);
};

export const annulusSectorPath = (
  index: number,
  sectorCount: number,
  center: Point,
  outerRadius: number,
  innerRadius: number,
): string => {
  const sectorAngle = (2 * Math.PI) / sectorCount;
  const start = -Math.PI / 2 + sectorAngle * index;
  const end = start + sectorAngle;
  const largeArcFlag = sectorAngle > Math.PI ? 1 : 0;
  const outerStart = polarPoint(center, outerRadius, start);
  const outerEnd = polarPoint(center, outerRadius, end);
  const innerEnd = polarPoint(center, innerRadius, end);
  const innerStart = polarPoint(center, innerRadius, start);

  return [
    `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
    `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    "Z",
  ].join(" ");
};

export const sectorIndexAtPoint = (
  point: Point,
  center: Point,
  sectorCount: number,
  outerRadius: number,
  innerDeadZoneRatio: number,
): number | null => {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const distance = Math.hypot(dx, dy);
  const innerRadius = outerRadius * innerDeadZoneRatio;

  if (distance < innerRadius || distance > outerRadius) {
    return null;
  }

  let angle = Math.atan2(dy, dx) + Math.PI / 2;
  if (angle < 0) {
    angle += 2 * Math.PI;
  }

  const sectorAngle = (2 * Math.PI) / sectorCount;
  return Math.min(Math.max(Math.floor(angle / sectorAngle), 0), sectorCount - 1);
};
```

- [ ] **Step 5: Run tests to verify pass**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm run test -- src/components/Wheel/wheelGeometry.test.ts
```

Expected:

```text
4 passed
```

- [ ] **Step 6: Commit geometry**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git add src/config/wheel.ts src/components/Wheel/wheelGeometry.ts src/components/Wheel/wheelGeometry.test.ts
git commit -m "feat: 复刻轮盘几何参数"
```

Expected:

```text
[main <hash>] feat: 复刻轮盘几何参数
```

## Task 5: Build Core Visual Components

**Files:**
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Wheel/RingflowWheel.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Cursor/Cursor.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Background/PromoBackground.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/MacUI/MacWindow.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/MacUI/FeatureCards.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Text/PromoText.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Toast/Toast.tsx`

- [ ] **Step 1: Write `RingflowWheel.tsx`**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Wheel/RingflowWheel.tsx`:

```tsx
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../config/theme";
import { wheelConfig, wheelSegments, type WheelSegmentId } from "../../config/wheel";
import { annulusSectorPath, labelPosition } from "./wheelGeometry";

type RingflowWheelProps = {
  mode?: "light" | "dark";
  activeSegment?: WheelSegmentId;
  runningSegment?: WheelSegmentId;
  centerLabel?: string;
  mini?: boolean;
  revealFrame?: number;
  showSegmentStagger?: boolean;
  showOuterRing?: boolean;
};

export const RingflowWheel = ({
  mode = "light",
  activeSegment,
  runningSegment,
  centerLabel = "Ringflow",
  mini = false,
  revealFrame = 0,
  showSegmentStagger = true,
  showOuterRing = false,
}: RingflowWheelProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleFactor = mini ? 0.55 : 1;
  const outer = wheelConfig.overlayOuterRadius;
  const inner = outer * wheelConfig.overlayInnerDeadZoneRatio;
  const size = (showOuterRing ? outer + wheelConfig.folderRingGap + wheelConfig.folderRingThickness : outer) * 2 + 16;
  const center = { x: size / 2, y: size / 2 };
  const baseProgress = spring({
    frame: Math.max(0, frame - revealFrame),
    fps,
    config: { damping: 86, stiffness: 220, mass: 1 },
    durationInFrames: Math.round(0.35 * fps),
  });
  const opacity = interpolate(frame, [revealFrame, revealFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dark = mode === "dark";

  return (
    <div
      style={{
        width: size * scaleFactor,
        height: size * scaleFactor,
        opacity,
        scale: baseProgress * scaleFactor,
        filter: `drop-shadow(${theme.shadow.wheel})`,
      }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" aria-label="Ringflow action wheel">
        <defs>
          <radialGradient id={`wheel-glass-${mode}`} cx="28%" cy="22%" r="80%">
            <stop offset="0%" stopColor={dark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.92)"} />
            <stop offset="48%" stopColor={dark ? "rgba(43,62,88,0.70)" : "rgba(234,245,255,0.55)"} />
            <stop offset="100%" stopColor={dark ? "rgba(11,18,31,0.70)" : "rgba(255,255,255,0.72)"} />
          </radialGradient>
          <filter id="soft-blur">
            <feGaussianBlur stdDeviation="0.2" />
          </filter>
        </defs>

        {showOuterRing ? (
          <circle
            cx={center.x}
            cy={center.y}
            r={outer + wheelConfig.folderRingGap + wheelConfig.folderRingThickness / 2}
            fill="none"
            stroke={dark ? "rgba(113,151,210,0.22)" : "rgba(90,150,220,0.18)"}
            strokeWidth={wheelConfig.folderRingThickness}
          />
        ) : null}

        <circle cx={center.x} cy={center.y} r={outer} fill={`url(#wheel-glass-${mode})`} opacity={0.92} />
        <circle cx={center.x} cy={center.y} r={inner} fill={dark ? "rgba(9,14,24,0.68)" : "rgba(255,255,255,0.78)"} />

        {wheelSegments.map((segment, index) => {
          const stagger = showSegmentStagger ? index * wheelConfig.fanPresentStaggerSeconds * fps : 0;
          const segmentOpacity = interpolate(frame, [revealFrame + stagger, revealFrame + stagger + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const isActive = activeSegment === segment.id;
          const isRunning = runningSegment === segment.id;
          const path = annulusSectorPath(index, wheelConfig.sectorCount, center, outer, inner);
          const label = labelPosition(index, wheelConfig.sectorCount, center, outer, wheelConfig.overlayInnerDeadZoneRatio);

          return (
            <g key={segment.id} opacity={segmentOpacity}>
              <path
                d={path}
                fill={
                  isRunning
                    ? "rgba(245, 158, 11, 0.42)"
                    : isActive
                      ? "rgba(89, 161, 236, 0.38)"
                      : dark
                        ? "rgba(255,255,255,0.045)"
                        : "rgba(255,255,255,0.18)"
                }
                stroke={dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.48)"}
                strokeWidth={1}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={dark ? theme.colors.darkInk : theme.colors.ink}
                fontSize={mini ? 18 : 22}
                fontWeight={600}
              >
                {segment.label}
              </text>
            </g>
          );
        })}

        <circle
          cx={center.x}
          cy={center.y}
          r={inner * wheelConfig.overlayCenterGlassRatio}
          fill={dark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.76)"}
          stroke={dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.82)"}
          strokeWidth={1}
        />
        <text
          x={center.x}
          y={center.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={dark ? theme.colors.darkInk : theme.colors.ink}
          fontSize={mini ? 18 : 24}
          fontWeight={700}
        >
          {centerLabel}
        </text>
      </svg>
    </div>
  );
};
```

- [ ] **Step 2: Write supporting visual components**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Cursor/Cursor.tsx`:

```tsx
type CursorProps = {
  x: number;
  y: number;
  pressed?: boolean;
  trail?: Array<{ x: number; y: number; opacity: number }>;
};

export const Cursor = ({ x, y, pressed = false, trail = [] }: CursorProps) => {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        {trail.map((point, index) => (
          <circle key={`${point.x}-${point.y}-${index}`} cx={point.x} cy={point.y} r={8 - index} fill={`rgba(47,127,211,${point.opacity})`} />
        ))}
        <g transform={`translate(${x} ${y}) scale(${pressed ? 0.94 : 1})`}>
          <path d="M0 0 L0 34 L9 25 L16 42 L25 38 L17 22 L30 22 Z" fill="white" stroke="rgba(15,23,42,0.72)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Background/PromoBackground.tsx`:

```tsx
import { AbsoluteFill } from "remotion";

type PromoBackgroundProps = {
  mode?: "light" | "dark";
};

export const PromoBackground = ({ mode = "light" }: PromoBackgroundProps) => {
  const dark = mode === "dark";
  return (
    <AbsoluteFill
      style={{
        background: dark
          ? "linear-gradient(135deg, #08111f 0%, #152238 48%, #25364d 100%)"
          : "linear-gradient(135deg, #f8fbff 0%, #eef7ff 46%, #ffffff 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "12% 18%",
          borderRadius: 999,
          background: dark ? "rgba(70,116,180,0.12)" : "rgba(92,161,236,0.10)",
          filter: "blur(70px)",
        }}
      />
    </AbsoluteFill>
  );
};
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/MacUI/MacWindow.tsx`:

```tsx
import type { ReactNode } from "react";
import { theme } from "../../config/theme";

type MacWindowProps = {
  title?: string;
  children: ReactNode;
  width?: number;
  height?: number;
};

export const MacWindow = ({ title = "Draft", children, width = 900, height = 560 }: MacWindowProps) => (
  <div
    style={{
      width,
      height,
      borderRadius: 24,
      background: "rgba(255,255,255,0.72)",
      border: "1px solid rgba(255,255,255,0.72)",
      boxShadow: theme.shadow.panel,
      overflow: "hidden",
      backdropFilter: "blur(26px)",
    }}
  >
    <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 22px", borderBottom: "1px solid rgba(148,163,184,0.18)" }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f57" }} />
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ffbd2e" }} />
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28c840" }} />
      <span style={{ marginLeft: 16, fontSize: 18, color: theme.colors.muted, fontWeight: 600 }}>{title}</span>
    </div>
    <div style={{ padding: 30 }}>{children}</div>
  </div>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/MacUI/FeatureCards.tsx`:

```tsx
import { theme } from "../../config/theme";

export const FeatureCard = ({ label, emphasis = false }: { label: string; emphasis?: boolean }) => (
  <div
    style={{
      minWidth: 190,
      padding: "20px 24px",
      borderRadius: 18,
      background: emphasis ? "rgba(232,244,255,0.88)" : "rgba(255,255,255,0.72)",
      border: "1px solid rgba(255,255,255,0.72)",
      boxShadow: theme.shadow.panel,
      fontSize: 28,
      fontWeight: 700,
      color: theme.colors.ink,
      backdropFilter: "blur(22px)",
    }}
  >
    {label}
  </div>
);

export const MetricPill = ({ label, value }: { label: string; value: string }) => (
  <div style={{ width: 160, padding: 18, borderRadius: 18, background: "rgba(255,255,255,0.68)", boxShadow: theme.shadow.panel }}>
    <div style={{ fontSize: 22, color: theme.colors.muted }}>{label}</div>
    <div style={{ marginTop: 8, fontSize: 36, fontWeight: 800, color: theme.colors.ink }}>{value}</div>
  </div>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Text/PromoText.tsx`:

```tsx
import { theme } from "../../config/theme";

type PromoTextProps = {
  lines: string[];
  mode?: "light" | "dark";
  align?: "left" | "center";
  size?: number;
};

export const PromoText = ({ lines, mode = "light", align = "left", size = theme.type.headline }: PromoTextProps) => (
  <div style={{ textAlign: align, color: mode === "dark" ? theme.colors.darkInk : theme.colors.ink }}>
    {lines.map((line) => (
      <div key={line} style={{ fontSize: size, lineHeight: 1.08, fontWeight: 780, letterSpacing: 0 }}>
        {line}
      </div>
    ))}
  </div>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/components/Toast/Toast.tsx`:

```tsx
export const Toast = ({ text }: { text: string }) => (
  <div
    style={{
      padding: "14px 20px",
      borderRadius: 999,
      background: "rgba(17,24,39,0.78)",
      color: "white",
      fontSize: 24,
      fontWeight: 650,
      boxShadow: "0 16px 42px rgba(15,23,42,0.22)",
      backdropFilter: "blur(18px)",
    }}
  >
    {text}
  </div>
);
```

- [ ] **Step 3: Run typecheck**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm run typecheck
```

Expected still fails because `PromoFilm` and scenes are not created:

```text
Cannot find module './PromoFilm'
```

- [ ] **Step 4: Commit components**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git add src/components
git commit -m "feat: 添加宣传片核心视觉组件"
```

Expected:

```text
[main <hash>] feat: 添加宣传片核心视觉组件
```

## Task 6: Add Scene Shell, Scene Components, and Promo Timeline

**Files:**
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/SceneShell.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/01_IntroFocusScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/02_FrictionScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/03_NearerConceptScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/04_ProductRevealScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/05_CoreGestureScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/06_QuickInputScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/07_QuickOpenScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/08_StickyNoteScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/09_MacroSequenceScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/10_ShellScriptScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/11_ShortcutsScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/12_MonitorScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/13_AppProfilesScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/14_PresetLibraryScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/15_OutroScene.tsx`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/index.ts`
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/src/PromoFilm.tsx`

- [ ] **Step 1: Write scene shell**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/SceneShell.tsx`:

```tsx
import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PromoBackground } from "../components/Background/PromoBackground";
import { PromoText } from "../components/Text/PromoText";
import { theme } from "../config/theme";

type SceneShellProps = {
  lines: string[];
  mode?: "light" | "dark";
  align?: "left" | "center";
  children: ReactNode;
};

export const SceneShell = ({ lines, mode = "light", align = "left", children }: SceneShellProps) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill>
      <PromoBackground mode={mode} />
      <AbsoluteFill
        style={{
          padding: `${theme.safeArea.y}px ${theme.safeArea.x}px`,
          opacity,
          display: "grid",
          gridTemplateColumns: align === "center" ? "1fr" : "0.86fr 1.14fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        <div style={{ justifySelf: align === "center" ? "center" : "start" }}>
          <PromoText lines={lines} mode={mode} align={align} />
        </div>
        <div style={{ justifySelf: "center" }}>{children}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Write scene components**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/01_IntroFocusScene.tsx`:

```tsx
import { MacWindow } from "../components/MacUI/MacWindow";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const IntroFocusScene = () => (
  <SceneShell lines={sceneCopy["intro-focus"].headline}>
    <MacWindow title="Writing">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 230px", gap: 28 }}>
        <div style={{ display: "grid", gap: 18, fontSize: 24, lineHeight: 1.6, color: "#334155" }}>
          <div>今天的重点，是把想法保持在同一个上下文里。</div>
          <div style={{ height: 180, borderRadius: 18, background: "rgba(241,245,249,0.82)" }} />
        </div>
        <div style={{ borderRadius: 18, background: "rgba(234,245,255,0.88)", padding: 20, fontSize: 22, fontWeight: 700 }}>Prompt 模板</div>
      </div>
    </MacWindow>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/02_FrictionScene.tsx`:

```tsx
import { FeatureCard } from "../components/MacUI/FeatureCards";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const FrictionScene = () => (
  <SceneShell lines={sceneCopy.friction.headline}>
    <div style={{ display: "grid", gap: 18 }}>
      <FeatureCard label="菜单" />
      <FeatureCard label="二级菜单" />
      <FeatureCard label="窗口切换" emphasis />
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/03_NearerConceptScene.tsx`:

```tsx
import { Cursor } from "../components/Cursor/Cursor";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const NearerConceptScene = () => (
  <SceneShell lines={sceneCopy["nearer-concept"].headline} align="center">
    <Cursor x={960} y={570} trail={[{ x: 960, y: 570, opacity: 0.18 }, { x: 960, y: 570, opacity: 0.10 }]} />
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/04_ProductRevealScene.tsx`:

```tsx
import { Cursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const ProductRevealScene = () => (
  <SceneShell lines={sceneCopy["product-reveal"].headline}>
    <div style={{ position: "relative", width: 520, height: 420 }}>
      <div style={{ position: "absolute", left: 120, top: 40 }}>
        <RingflowWheel centerLabel="Ringflow" activeSegment="quick-input" />
      </div>
      <Cursor x={168} y={110} />
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/05_CoreGestureScene.tsx`:

```tsx
import { Cursor } from "../components/Cursor/Cursor";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const CoreGestureScene = () => (
  <SceneShell lines={sceneCopy["core-gesture"].headline}>
    <div style={{ position: "relative", width: 540, height: 420 }}>
      <div style={{ position: "absolute", left: 130, top: 42 }}>
        <RingflowWheel activeSegment="quick-input" centerLabel="按住" />
      </div>
      <Cursor x={350} y={150} pressed trail={[{ x: 314, y: 186, opacity: 0.18 }, { x: 280, y: 220, opacity: 0.10 }]} />
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/06_QuickInputScene.tsx`:

```tsx
import { MacWindow } from "../components/MacUI/MacWindow";
import { Toast } from "../components/Toast/Toast";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const QuickInputScene = () => (
  <SceneShell lines={sceneCopy["quick-input"].headline}>
    <div style={{ position: "relative" }}>
      <MacWindow title="AI Prompt" width={760} height={420}>
        <div style={{ fontSize: 28, color: "#334155" }}>请帮我总结提炼以下内容，并保持语气自然。</div>
      </MacWindow>
      <div style={{ position: "absolute", right: -120, bottom: -50 }}>
        <RingflowWheel mini activeSegment="quick-input" centerLabel="文本" />
      </div>
      <div style={{ position: "absolute", left: 120, bottom: -36 }}>
        <Toast text="Prompt inserted · Clipboard restored" />
      </div>
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/07_QuickOpenScene.tsx`:

```tsx
import { FeatureCard } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const QuickOpenScene = () => (
  <SceneShell lines={sceneCopy["quick-open"].headline}>
    <div style={{ display: "grid", gap: 18, justifyItems: "end" }}>
      <RingflowWheel mini activeSegment="quick-open" centerLabel="打开" />
      <FeatureCard label="Terminal" />
      <FeatureCard label="README.md" />
      <FeatureCard label="Project Folder" emphasis />
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/08_StickyNoteScene.tsx`:

```tsx
import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const StickyNoteScene = () => (
  <SceneShell lines={sceneCopy["sticky-note"].headline}>
    <div style={{ position: "relative" }}>
      <RingflowWheel mini activeSegment="sticky-note" centerLabel="便签" />
      <div style={{ position: "absolute", left: 260, top: 40 }}>
        <MacWindow title="会议要点" width={420} height={280}>
          <div style={{ fontSize: 28, lineHeight: 1.5, color: "#334155" }}>下次同步前确认三件事</div>
        </MacWindow>
      </div>
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/09_MacroSequenceScene.tsx`:

```tsx
import { FeatureCard } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const MacroSequenceScene = () => (
  <SceneShell lines={sceneCopy["macro-sequence"].headline} mode="dark">
    <div style={{ display: "grid", gridTemplateColumns: "220px 220px", gap: 18 }}>
      <FeatureCard label="复制" />
      <FeatureCard label="切换应用" />
      <FeatureCard label="粘贴" />
      <FeatureCard label="保存" emphasis />
      <div style={{ gridColumn: "1 / -1", justifySelf: "center" }}>
        <RingflowWheel mini mode="dark" runningSegment="macro" centerLabel="运行中" />
      </div>
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/10_ShellScriptScene.tsx`:

```tsx
import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const ShellScriptScene = () => (
  <SceneShell lines={sceneCopy["shell-script"].headline} mode="dark">
    <div style={{ position: "relative" }}>
      <MacWindow title="Terminal" width={720} height={360}>
        <div style={{ fontFamily: "Menlo, monospace", fontSize: 26, color: "#0f172a", lineHeight: 1.7 }}>
          <div>$ pnpm run build</div>
          <div>✓ Done in 2.4s</div>
        </div>
      </MacWindow>
      <div style={{ position: "absolute", right: -120, top: -70 }}>
        <RingflowWheel mini mode="dark" runningSegment="shell" centerLabel="Shell" />
      </div>
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/11_ShortcutsScene.tsx`:

```tsx
import { FeatureCard } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const ShortcutsScene = () => (
  <SceneShell lines={sceneCopy.shortcuts.headline}>
    <div style={{ display: "grid", gap: 18, justifyItems: "center" }}>
      <RingflowWheel mini activeSegment="shortcuts" centerLabel="快捷指令" />
      <FeatureCard label="发送到手机" />
      <FeatureCard label="快捷指令完成" emphasis />
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/12_MonitorScene.tsx`:

```tsx
import { MetricPill } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const MonitorScene = () => (
  <SceneShell lines={sceneCopy.monitor.headline} mode="dark">
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <MetricPill label="CPU" value="18%" />
      <MetricPill label="内存" value="62%" />
      <MetricPill label="网络" value="42M" />
      <MetricPill label="电池" value="86%" />
      <div style={{ gridColumn: "1 / -1", justifySelf: "center" }}>
        <RingflowWheel mini mode="dark" activeSegment="monitor" centerLabel="状态" />
      </div>
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/13_AppProfilesScene.tsx`:

```tsx
import { FeatureCard } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const AppProfilesScene = () => (
  <SceneShell lines={sceneCopy["app-profiles"].headline}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, alignItems: "center" }}>
      <FeatureCard label="Writing" emphasis />
      <FeatureCard label="Coding" />
      <FeatureCard label="Meeting" />
      <div style={{ gridColumn: "1 / -1", justifySelf: "center" }}>
        <RingflowWheel mini centerLabel="App" activeSegment="profiles" />
      </div>
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/14_PresetLibraryScene.tsx`:

```tsx
import { FeatureCard } from "../components/MacUI/FeatureCards";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const PresetLibraryScene = () => (
  <SceneShell lines={sceneCopy["preset-library"].headline}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 220px)", gap: 18 }}>
      <FeatureCard label="AI 写作" emphasis />
      <FeatureCard label="开发者" />
      <FeatureCard label="会议记录" />
    </div>
  </SceneShell>
);
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/15_OutroScene.tsx`:

```tsx
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const OutroScene = () => (
  <SceneShell lines={sceneCopy.outro.headline} align="center">
    <RingflowWheel mini centerLabel="Ringflow" />
  </SceneShell>
);
```

- [ ] **Step 3: Write scene registry and promo film**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/scenes/index.ts`:

```ts
export { IntroFocusScene } from "./01_IntroFocusScene";
export { FrictionScene } from "./02_FrictionScene";
export { NearerConceptScene } from "./03_NearerConceptScene";
export { ProductRevealScene } from "./04_ProductRevealScene";
export { CoreGestureScene } from "./05_CoreGestureScene";
export { QuickInputScene } from "./06_QuickInputScene";
export { QuickOpenScene } from "./07_QuickOpenScene";
export { StickyNoteScene } from "./08_StickyNoteScene";
export { MacroSequenceScene } from "./09_MacroSequenceScene";
export { ShellScriptScene } from "./10_ShellScriptScene";
export { ShortcutsScene } from "./11_ShortcutsScene";
export { MonitorScene } from "./12_MonitorScene";
export { AppProfilesScene } from "./13_AppProfilesScene";
export { PresetLibraryScene } from "./14_PresetLibraryScene";
export { OutroScene } from "./15_OutroScene";
```

Create `/Users/admin/dev/Ringflow/Ringflow-promo/src/PromoFilm.tsx`:

```tsx
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence } from "remotion";
import { staticFile } from "remotion";
import { assets } from "./config/assets";
import { scenes } from "./config/timeline";
import {
  AppProfilesScene,
  CoreGestureScene,
  FrictionScene,
  IntroFocusScene,
  MacroSequenceScene,
  MonitorScene,
  NearerConceptScene,
  OutroScene,
  PresetLibraryScene,
  ProductRevealScene,
  QuickInputScene,
  QuickOpenScene,
  ShellScriptScene,
  ShortcutsScene,
  StickyNoteScene,
} from "./scenes";

const sceneComponents = [
  IntroFocusScene,
  FrictionScene,
  NearerConceptScene,
  ProductRevealScene,
  CoreGestureScene,
  QuickInputScene,
  QuickOpenScene,
  StickyNoteScene,
  MacroSequenceScene,
  ShellScriptScene,
  ShortcutsScene,
  MonitorScene,
  AppProfilesScene,
  PresetLibraryScene,
  OutroScene,
] as const;

export const PromoFilm = () => {
  return (
    <AbsoluteFill>
      {scenes.map((scene, index) => {
        const Scene = sceneComponents[index];
        return (
          <Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.durationInFrames}>
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile(assets.audio.music)} volume={0.32} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 4: Run typecheck**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm run typecheck
```

Expected:

```text
no output, exit code 0
```

- [ ] **Step 5: Commit scenes**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git add src/PromoFilm.tsx src/scenes
git commit -m "feat: 搭建十五镜头动画样片"
```

Expected:

```text
[main <hash>] feat: 搭建十五镜头动画样片
```

## Task 7: Add Representative Still QA Render

**Files:**
- Create: `/Users/admin/dev/Ringflow/Ringflow-promo/scripts/render-stills.mjs`
- Create output during verification: `/Users/admin/dev/Ringflow/Ringflow-promo/out/stills/*.png`

- [ ] **Step 1: Write still render helper**

Create `/Users/admin/dev/Ringflow/Ringflow-promo/scripts/render-stills.mjs`:

```js
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const frames = [60, 450, 570, 660, 900, 1150, 1620, 1900, 2100];
const outDir = path.join(process.cwd(), "out/stills");
fs.mkdirSync(outDir, { recursive: true });

for (const frame of frames) {
  execFileSync(
    "npx",
    [
      "remotion",
      "still",
      "src/index.ts",
      "RingflowPromo",
      `out/stills/frame-${frame}.png`,
      "--frame",
      String(frame),
      "--scale",
      "0.5",
    ],
    { stdio: "inherit" },
  );
}
```

- [ ] **Step 2: Add still script to `package.json`**

Modify `/Users/admin/dev/Ringflow/Ringflow-promo/package.json` scripts:

```json
{
  "scripts": {
    "start": "remotion studio src/index.ts",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check:timeline": "node scripts/check-timeline.mjs",
    "build": "pnpm run typecheck && pnpm run test && pnpm run check:timeline",
    "still": "remotion still src/index.ts RingflowPromo out/stills/frame-900.png --frame=900 --scale=0.5",
    "stills": "node scripts/render-stills.mjs",
    "render": "remotion render src/index.ts RingflowPromo out/ringflow-promo-animatic.mp4"
  }
}
```

- [ ] **Step 3: Run full non-render verification**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm run build
```

Expected:

```text
Timeline OK: 15 scenes, 36s total.
```

and:

```text
Test Files  1 passed
Tests  4 passed
```

- [ ] **Step 4: Render stills**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm run stills
```

Expected:

```text
out/stills/frame-60.png
out/stills/frame-450.png
out/stills/frame-570.png
out/stills/frame-660.png
out/stills/frame-900.png
out/stills/frame-1150.png
out/stills/frame-1620.png
out/stills/frame-1900.png
out/stills/frame-2100.png
```

- [ ] **Step 5: Inspect stills visually**

Open these files in the Codex app image viewer or local preview:

```text
/Users/admin/dev/Ringflow/Ringflow-promo/out/stills/frame-450.png
/Users/admin/dev/Ringflow/Ringflow-promo/out/stills/frame-570.png
/Users/admin/dev/Ringflow/Ringflow-promo/out/stills/frame-900.png
/Users/admin/dev/Ringflow/Ringflow-promo/out/stills/frame-1620.png
/Users/admin/dev/Ringflow/Ringflow-promo/out/stills/frame-2100.png
```

Expected visual checks:

- Main Chinese text is not clipped.
- Each frame has one clear focal point.
- Wheel is visible and not blank.
- Dark scenes remain readable.
- No Apple logo or third-party logo appears.

- [ ] **Step 6: Commit QA tooling**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git add package.json scripts/render-stills.mjs
git commit -m "test: 添加宣传片静帧检查"
```

Expected:

```text
[main <hash>] test: 添加宣传片静帧检查
```

## Task 8: Render First Animatic MP4

**Files:**
- Create output during verification: `/Users/admin/dev/Ringflow/Ringflow-promo/out/ringflow-promo-animatic.mp4`

- [ ] **Step 1: Run final build checks**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm run build
```

Expected:

```text
Timeline OK: 15 scenes, 36s total.
```

and:

```text
Test Files  1 passed
Tests  4 passed
```

- [ ] **Step 2: Render animatic**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
pnpm run render
```

Expected:

```text
out/ringflow-promo-animatic.mp4
```

- [ ] **Step 3: Verify output file exists and is non-empty**

Run:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
ls -lh out/ringflow-promo-animatic.mp4
```

Expected:

```text
-rw-r--r-- ... out/ringflow-promo-animatic.mp4
```

- [ ] **Step 4: Review motion QA checklist**

Use `Ringflow-promo/.agents/skills/motion-qa/SKILL.md` and record findings in the final response:

```text
Timing: 36s, 15 scenes
Visual quality: text readable or list exact frames with issues
Animation quality: wheel reveal/cursor acceptable or list exact frames with issues
Brand consistency: no Apple logo, no noisy cyberpunk, no clutter
Technical checks: build/test/timeline/render commands and outputs
```

- [ ] **Step 5: Commit render milestone metadata only**

Do not commit `out/ringflow-promo-animatic.mp4` unless the user explicitly wants binary renders versioned. Commit source changes already covered by earlier tasks. If the final render required source fixes, commit those source fixes with:

```bash
cd /Users/admin/dev/Ringflow/Ringflow-promo
git add src package.json scripts
git commit -m "fix: 修正宣传片样片渲染问题"
```

Expected if no source fixes were required:

```text
nothing to commit, working tree clean
```

## Self-Review

Spec coverage:

- Remotion + React + TypeScript project: Task 2.
- Timeline in `src/config/timeline.ts`: Task 3.
- Real Chinese copy in `src/config/copy.ts` and scenes: Tasks 3 and 6.
- Swift-derived wheel constants and geometry: Task 4.
- React/SVG wheel: Task 5.
- 15 separate scenes: Task 6.
- Audio placement: Tasks 3 and 6.
- Still-frame QA and build checks: Tasks 7 and 8.
- All promo files under `Ringflow-promo`: every path in this plan is under `/Users/admin/dev/Ringflow/Ringflow-promo`.

Placeholder scan:

- The plan does not rely on unspecified future files.
- Missing final brand icon is handled through text and a wheel center label in this animatic milestone.
- AI-generated media is not required for this milestone.

Type consistency:

- `SceneId` keys match `sceneCopy` keys.
- `WheelSegmentId` values match `wheelSegments` ids.
- `PromoFilm` maps the 15 timeline rows to the 15 scene components in order.
- `Root.tsx` imports `composition` from `src/config/timeline.ts`.

## Execution Choice

Plan complete and saved to `Ringflow-promo/docs/superpowers/plans/2026-06-30-ringflow-promo-remotion-animatic.md`.

Two execution options:

1. Subagent-Driven (recommended) - dispatch a fresh subagent per task, review between tasks, faster iteration and cleaner task boundaries.
2. Inline Execution - execute tasks in this session using executing-plans, with checkpoints after each committed task.
