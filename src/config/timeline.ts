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
