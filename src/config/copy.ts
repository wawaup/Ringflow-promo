import type { SceneId } from "./timeline";

/**
 * Ringflow Promo — Film copy deck.
 *
 * All wording aligns with the official website (Ringflow-web):
 * 「围绕光标的快捷操作轮盘」「按住拖动，移向目标，松手执行」「唤出 · 选择 · 执行」.
 * One idea per shot; short lines; feature names use the product's own vocabulary.
 */

export type SceneCopy = {
  headline: string[];
  caption?: string;
  uiLabels?: string[];
  /** Top-anchored line stating what the scene demonstrates, rendered above the headline row. */
  title?: string;
  /** Left-side caption shown alongside the mouse-based demo. */
  mouseCallout?: string;
  /** Left-side caption shown alongside the trackpad-based demo. */
  trackpadCallout?: string;
};

export const sceneCopy: Record<SceneId, SceneCopy> = {
  friction: {
    headline: ["找菜单。", "切窗口。", "一遍又一遍。"],
  },
  reveal: {
    // 主标题先出；第二行 Ringflow 落下的同一帧，轮盘开始旋入（timeline.wheelStartFrame 对齐）
    headline: ["围绕光标的快捷操作轮盘", "Ringflow"],
  },
  gesture: {
    // Three beats, lit word by word (choreography.wordFrames)
    title: "如何唤醒？",
    headline: ["按住拖动", "移向目标", "松手执行"],
    caption: "触控板同样可以：按住 ⇧⌃ 移动光标",
    mouseCallout: "鼠标 · 按下中键，向右上轻滑",
    trackpadCallout: "触控板 · 按住 ⇧⌃ 移动光标",
  },
  umbrella: {
    headline: ["把常用操作，放进轮盘。"],
  },
  "feature-run": {
    // Per-beat copy lives in FEATURE_BEATS below
    headline: [],
  },
  "group-ring": {
    headline: ["分组外环，装下更多。"],
    caption: "悬停展开，离开收起",
  },
  "app-profiles": {
    headline: ["不同应用，自动换轮盘。"],
    caption: "按前台应用，匹配最合适的布局",
  },
  "preset-library": {
    headline: ["不想从零编排？"],
    caption: "预设库，一键导入",
  },
  outro: {
    headline: ["唤出 · 选择 · 执行"],
    caption: "免费下载，开始使用",
  },
};

/** One beat of the feature run: headline + sub line + which showcase sector lights up. */
export type FeatureBeat = {
  id: string;
  /** Big word (feature name, product vocabulary) */
  headline: string;
  /** One-line value statement (from website feature cards) */
  sub: string;
  /** Index into SHOWCASE_SLOTS (siteWheelModel) — highlight sweeps clockwise */
  wheelIndex: number;
};

export const FEATURE_BEATS: readonly FeatureBeat[] = [
  { id: "hotkey", headline: "快捷键", sub: "复制、粘贴、保存，一划即达", wheelIndex: 0 },
  { id: "quick-input", headline: "快捷输入", sub: "固定回复与提示词，一划贴入", wheelIndex: 1 },
  { id: "quick-open", headline: "快捷打开", sub: "应用、文件、文件夹，无需切换窗口", wheelIndex: 2 },
  { id: "sticky-note", headline: "便签", sub: "灵感随取随记", wheelIndex: 3 },
  { id: "shell", headline: "Shell 脚本", sub: "自动化命令，一划运行", wheelIndex: 4 },
  { id: "shortcuts", headline: "快捷指令", sub: "系统里的自动化，直接调用", wheelIndex: 5 },
  { id: "monitor", headline: "监视器", sub: "CPU、内存、网络，一眼看到", wheelIndex: 6 },
] as const;
