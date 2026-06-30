export const FPS = 60;

const frame = (seconds: number) => Math.round(seconds * FPS);

export type SceneLayout = "left-stage" | "top-stage" | "center-stage";

export type SceneChoreography = {
  textStartFrame: number;
  visualStartFrame: number;
  actionStartFrame: number;
  holdStartFrame: number;
  pageStartFrame?: number;
  pageReadyFrame?: number;
  codexInputStartFrame?: number;
  codexMainStartFrame?: number;
  noteStartFrame?: number;
  stickyOpenFrame?: number;
  noteCopyFrame?: number;
  notePasteFrame?: number;
  promptOpenFrame?: number;
  promptCopyFrame?: number;
  promptPasteFrame?: number;
  mouseStartFrame?: number;
  swipeStartFrame?: number;
  wheelStartFrame?: number;
};

const baseComposition = {
  id: "RingflowPromo",
  width: 1920,
  height: 1080,
  fps: FPS,
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
  layout: SceneLayout;
  choreography: SceneChoreography;
  startSeconds: number;
  endSeconds: number;
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
  overlapWithNextFrames: number;
};

const rawScenes = [
  {
    shot: 1,
    id: "intro-focus",
    name: "开场：保持连贯",
    durationSeconds: 10.4,
    layout: "left-stage",
    choreography: {
      pageStartFrame: 0,
      pageReadyFrame: 56,
      textStartFrame: 70,
      visualStartFrame: 154,
      codexInputStartFrame: 168,
      codexMainStartFrame: 206,
      noteStartFrame: 248,
      actionStartFrame: 304,
      stickyOpenFrame: 318,
      noteCopyFrame: 382,
      notePasteFrame: 430,
      promptOpenFrame: 482,
      promptCopyFrame: 536,
      promptPasteFrame: 580,
      holdStartFrame: 612,
    },
  },
  {
    shot: 2,
    id: "friction",
    name: "操作绕远",
    durationSeconds: 3,
    layout: "left-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 42, actionStartFrame: 76, holdStartFrame: 142 },
  },
  {
    shot: 3,
    id: "nearer-concept",
    name: "理念转折：常用的，应该更近一点",
    durationSeconds: 2.5,
    layout: "center-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 54, actionStartFrame: 72, holdStartFrame: 120 },
  },
  {
    shot: 4,
    id: "product-reveal",
    name: "Ringflow 产品亮相",
    durationSeconds: 3.2,
    layout: "top-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 54, actionStartFrame: 86, holdStartFrame: 158 },
  },
  {
    shot: 5,
    id: "core-gesture",
    name: "核心交互：按住、划动、完成",
    durationSeconds: 4.6,
    layout: "center-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 36,
      mouseStartFrame: 44,
      actionStartFrame: 104,
      swipeStartFrame: 112,
      wheelStartFrame: 136,
      holdStartFrame: 226,
    },
  },
  {
    shot: 6,
    id: "quick-input",
    name: "快捷输入",
    durationSeconds: 2.8,
    layout: "top-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 44, actionStartFrame: 78, holdStartFrame: 136 },
  },
  {
    shot: 7,
    id: "quick-open",
    name: "快捷打开",
    durationSeconds: 3.2,
    layout: "top-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 46, actionStartFrame: 84, holdStartFrame: 158 },
  },
  {
    shot: 8,
    id: "sticky-note",
    name: "便签",
    durationSeconds: 3.2,
    layout: "top-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 46, actionStartFrame: 86, holdStartFrame: 158 },
  },
  {
    shot: 9,
    id: "macro-sequence",
    name: "快捷键 / 宏序列",
    durationSeconds: 3.4,
    layout: "top-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 48, actionStartFrame: 88, holdStartFrame: 170 },
  },
  {
    shot: 10,
    id: "shell-script",
    name: "Shell 脚本",
    durationSeconds: 3.2,
    layout: "top-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 46, actionStartFrame: 88, holdStartFrame: 158 },
  },
  {
    shot: 11,
    id: "shortcuts",
    name: "macOS 快捷指令",
    durationSeconds: 3,
    layout: "top-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 44, actionStartFrame: 82, holdStartFrame: 148 },
  },
  {
    shot: 12,
    id: "monitor",
    name: "系统监视器",
    durationSeconds: 2.8,
    layout: "top-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 44, actionStartFrame: 82, holdStartFrame: 136 },
  },
  {
    shot: 13,
    id: "app-profiles",
    name: "应用独立配置",
    durationSeconds: 3.4,
    layout: "left-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 48, actionStartFrame: 88, holdStartFrame: 170 },
  },
  {
    shot: 14,
    id: "preset-library",
    name: "预设库",
    durationSeconds: 4.2,
    layout: "left-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 54, actionStartFrame: 102, holdStartFrame: 214 },
  },
  {
    shot: 15,
    id: "outro",
    name: "品牌收尾",
    durationSeconds: 3.2,
    layout: "center-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 66, actionStartFrame: 94, holdStartFrame: 154 },
  },
] as const;

let cursorSeconds = 0;

export const scenes: SceneTiming[] = rawScenes.map((scene) => {
  const startSeconds = Number(cursorSeconds.toFixed(2));
  const endSeconds = Number((startSeconds + scene.durationSeconds).toFixed(2));
  cursorSeconds = endSeconds;
  const startFrame = frame(startSeconds);
  const endFrame = frame(endSeconds);
  return {
    shot: scene.shot,
    id: scene.id,
    name: scene.name,
    layout: scene.layout,
    choreography: scene.choreography,
    startSeconds,
    endSeconds,
    startFrame,
    endFrame,
    durationInFrames: endFrame - startFrame,
    overlapWithNextFrames: 0,
  };
});

const lastScene = scenes[scenes.length - 1];

export const composition = {
  ...baseComposition,
  durationSeconds: lastScene.endSeconds,
  durationInFrames: lastScene.endFrame,
} as const;
