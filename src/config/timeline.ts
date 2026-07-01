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
  destinationInputStartFrame?: number;
  documentStartFrame?: number;
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
  wheelHighlightStartFrame?: number;  // when the relevant sector starts highlighting (leads result)
  wheelHighlightEndFrame?: number;    // when highlight peaks, result can appear
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
    durationSeconds: 4.8,
    layout: "left-stage",
    choreography: {
      pageStartFrame: 0,
      pageReadyFrame: 12,
      textStartFrame: 18,
      visualStartFrame: 26,
      destinationInputStartFrame: 35,
      documentStartFrame: 45,
      noteStartFrame: 95,
      actionStartFrame: 98,
      stickyOpenFrame: 98,
      noteCopyFrame: 105,
      notePasteFrame: 117,
      promptOpenFrame: 175,
      promptCopyFrame: 185,
      promptPasteFrame: 197,
      holdStartFrame: 220,
    },
  },
  {
    shot: 2,
    id: "friction",
    name: "操作绕远",
    durationSeconds: 2.8,
    layout: "left-stage",
    choreography: { textStartFrame: 0, visualStartFrame: 42, actionStartFrame: 76, holdStartFrame: 142 },
  },
  {
    shot: 3,
    id: "nearer-concept",
    name: "理念转折：常用的，应该更近一点 + Ringflow 亮相",
    durationSeconds: 6.0,
    layout: "center-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 60,
      actionStartFrame: 90,
      mouseStartFrame: 100,
      wheelStartFrame: 80,
      wheelHighlightStartFrame: 100,
      wheelHighlightEndFrame: 140,
      holdStartFrame: 300,
    },
  },
  {
    shot: 5,
    id: "core-gesture",
    name: "核心交互：按住、划动、完成",
    durationSeconds: 4.2,
    layout: "center-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 36,
      mouseStartFrame: 44,
      actionStartFrame: 60,
      swipeStartFrame: 100,
      wheelStartFrame: 70,
      wheelHighlightStartFrame: 90,
      wheelHighlightEndFrame: 130,
      holdStartFrame: 180,
    },
  },
  {
    shot: 6,
    id: "quick-input",
    name: "快捷输入",
    durationSeconds: 3.2,
    layout: "top-stage",
    choreography: { 
      textStartFrame: 0, 
      visualStartFrame: 44, 
      actionStartFrame: 78, 
      wheelStartFrame: 60, 
      wheelHighlightStartFrame: 70, 
      wheelHighlightEndFrame: 95, 
      holdStartFrame: 110 
    },
  },
  {
    shot: 7,
    id: "quick-open",
    name: "快捷打开",
    durationSeconds: 3.2,
    layout: "top-stage",
    choreography: { 
      textStartFrame: 0, 
      visualStartFrame: 46, 
      actionStartFrame: 84, 
      wheelStartFrame: 60, 
      wheelHighlightStartFrame: 70, 
      wheelHighlightEndFrame: 95, 
      holdStartFrame: 110 
    },
  },
  {
    shot: 8,
    id: "sticky-note",
    name: "便签",
    durationSeconds: 3.2,
    layout: "top-stage",
    choreography: { 
      textStartFrame: 0, 
      visualStartFrame: 46, 
      actionStartFrame: 86, 
      wheelStartFrame: 60, 
      wheelHighlightStartFrame: 75, 
      wheelHighlightEndFrame: 100, 
      holdStartFrame: 110 
    },
  },
  {
    shot: 9,
    id: "macro-sequence",
    name: "快捷键 / 宏序列",
    durationSeconds: 3.3,
    layout: "top-stage",
    choreography: { 
      textStartFrame: 0, 
      visualStartFrame: 48, 
      actionStartFrame: 88, 
      wheelStartFrame: 70, 
      wheelHighlightStartFrame: 85, 
      wheelHighlightEndFrame: 140, 
      holdStartFrame: 110 
    },
  },
  {
    shot: 10,
    id: "shell-script",
    name: "Shell 脚本",
    durationSeconds: 3.0,
    layout: "top-stage",
    choreography: { 
      textStartFrame: 0, 
      visualStartFrame: 46, 
      actionStartFrame: 88, 
      wheelStartFrame: 65, 
      wheelHighlightStartFrame: 80, 
      wheelHighlightEndFrame: 105, 
      holdStartFrame: 100 
    },
  },
  {
    shot: 11,
    id: "shortcuts",
    name: "macOS 快捷指令",
    durationSeconds: 2.8,
    layout: "top-stage",
    choreography: { 
      textStartFrame: 0, 
      visualStartFrame: 44, 
      actionStartFrame: 82, 
      wheelStartFrame: 60, 
      wheelHighlightStartFrame: 70, 
      wheelHighlightEndFrame: 95, 
      holdStartFrame: 90 
    },
  },
  {
    shot: 12,
    id: "monitor",
    name: "系统监视器",
    durationSeconds: 2.7,
    layout: "top-stage",
    choreography: { 
      textStartFrame: 0, 
      visualStartFrame: 44, 
      actionStartFrame: 82, 
      wheelStartFrame: 60, 
      wheelHighlightStartFrame: 70, 
      wheelHighlightEndFrame: 95, 
      holdStartFrame: 90 
    },
  },
  {
    shot: 13,
    id: "app-profiles",
    name: "应用独立配置",
    durationSeconds: 3.0,
    layout: "left-stage",
    choreography: { 
      textStartFrame: 0, 
      visualStartFrame: 48, 
      actionStartFrame: 88, 
      wheelStartFrame: 70, 
      wheelHighlightStartFrame: 85, 
      wheelHighlightEndFrame: 130, 
      holdStartFrame: 170 
    },
  },
  {
    shot: 14,
    id: "preset-library",
    name: "预设库",
    durationSeconds: 3.6,
    layout: "left-stage",
    choreography: { 
      textStartFrame: 0, 
      visualStartFrame: 54, 
      actionStartFrame: 102, 
      wheelStartFrame: 70, 
      wheelHighlightStartFrame: 90, 
      wheelHighlightEndFrame: 140, 
      holdStartFrame: 214 
    },
  },
  {
    shot: 15,
    id: "outro",
    name: "品牌收尾",
    durationSeconds: 2.8,
    layout: "center-stage",
    choreography: { 
      textStartFrame: 0, 
      visualStartFrame: 66, 
      actionStartFrame: 94, 
      wheelStartFrame: 80, 
      wheelHighlightStartFrame: 100, 
      wheelHighlightEndFrame: 130, 
      holdStartFrame: 154 
    },
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
