export const FPS = 60;

/**
 * Frames two chained scenes overlap during the cross-dissolve.
 * Lives here (not motion.ts) so this module stays free of remotion imports —
 * it is loaded directly by node-based tests and scripts.
 */
export const SCENE_OVERLAP = 12;

const frame = (seconds: number) => Math.round(seconds * FPS);

export type SceneLayout = "left-stage" | "top-stage" | "center-stage";

/**
 * Frame choreography inside one scene (all frames are scene-local).
 * Core ordered phases: visual → action → hold. `textStartFrame` may come
 * later than the visual on brand moments (e.g. reveal: gesture first, title after).
 */
export type SceneChoreography = {
  textStartFrame: number;
  visualStartFrame: number;
  actionStartFrame: number;
  holdStartFrame: number;
  // Wheel choreography
  wheelStartFrame?: number;
  wheelHighlightStartFrame?: number;
  wheelHighlightEndFrame?: number;
  // Gesture phases
  pressStartFrame?: number;
  swipeStartFrame?: number;
  releaseFrame?: number;
  // Word-by-word headline beats (gesture scene)
  wordFrames?: readonly number[];
  trackpadHintFrame?: number;
  // Feature run
  beatDurationFrames?: number;
  // Group ring
  folderExpandFrame?: number;
  // App profiles
  appSwitchFrames?: readonly number[];
  // Preset library steps (download / import / ready)
  stepFrames?: readonly number[];
  // Outro
  ctaFrame?: number;
};

const baseComposition = {
  id: "RingflowPromo",
  width: 1920,
  height: 1080,
  fps: FPS,
} as const;

export type SceneId =
  | "friction"
  | "turn"
  | "reveal"
  | "gesture"
  | "umbrella"
  | "feature-run"
  | "group-ring"
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

/** Feature-run rhythm: 7 beats, one per showcase sector, uniform length. */
export const FEATURE_BEAT_FRAMES = 126;
export const FEATURE_BEAT_COUNT = 7;

const rawScenes = [
  {
    shot: 1,
    id: "friction",
    name: "摩擦：找菜单、切窗口",
    durationSeconds: 4.2,
    layout: "left-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 42,
      actionStartFrame: 76,
      holdStartFrame: 200,
    },
  },
  {
    shot: 2,
    id: "turn",
    name: "转折：常用的操作，应该就在手边",
    durationSeconds: 3.2,
    layout: "center-stage",
    choreography: {
      textStartFrame: 12,
      visualStartFrame: 90,
      actionStartFrame: 120,
      holdStartFrame: 156,
    },
  },
  {
    shot: 3,
    id: "reveal",
    name: "亮相：按住拖动，轮盘绽放 + Ringflow 标题",
    durationSeconds: 6.5,
    layout: "center-stage",
    choreography: {
      textStartFrame: 210, // brand title lands after the wheel has bloomed
      visualStartFrame: 12,
      actionStartFrame: 66,
      pressStartFrame: 66,
      swipeStartFrame: 90,
      wheelStartFrame: 104,
      holdStartFrame: 330,
    },
  },
  {
    shot: 4,
    id: "gesture",
    name: "核心手势：按住拖动 · 移向目标 · 松手执行",
    durationSeconds: 7.0,
    layout: "center-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 20,
      actionStartFrame: 56,
      pressStartFrame: 56,
      swipeStartFrame: 92,
      wheelStartFrame: 104,
      wheelHighlightStartFrame: 150,
      wheelHighlightEndFrame: 216,
      releaseFrame: 252,
      holdStartFrame: 320,
      wordFrames: [24, 140, 258],
      trackpadHintFrame: 330,
    },
  },
  {
    shot: 5,
    id: "umbrella",
    name: "伞句：把常用操作，放进轮盘",
    durationSeconds: 2.4,
    layout: "center-stage",
    choreography: {
      textStartFrame: 8,
      visualStartFrame: 46,
      actionStartFrame: 70,
      holdStartFrame: 110,
    },
  },
  {
    shot: 6,
    id: "feature-run",
    name: "功能节拍：七种动作，一种手势",
    durationSeconds: (FEATURE_BEAT_FRAMES * FEATURE_BEAT_COUNT) / FPS, // 14.7s
    layout: "top-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 6,
      actionStartFrame: 30,
      holdStartFrame: FEATURE_BEAT_FRAMES * FEATURE_BEAT_COUNT - 26,
      beatDurationFrames: FEATURE_BEAT_FRAMES,
    },
  },
  {
    shot: 7,
    id: "group-ring",
    name: "分组外环：一个轮盘装下更多",
    durationSeconds: 4.5,
    layout: "center-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 18,
      actionStartFrame: 84,
      folderExpandFrame: 96,
      wheelStartFrame: 18,
      wheelHighlightStartFrame: 168,
      wheelHighlightEndFrame: 204,
      holdStartFrame: 232,
    },
  },
  {
    shot: 8,
    id: "app-profiles",
    name: "应用配置：不同应用，自动换轮盘",
    durationSeconds: 4.0,
    layout: "center-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 20,
      actionStartFrame: 44,
      appSwitchFrames: [44, 112, 180],
      holdStartFrame: 216,
    },
  },
  {
    shot: 9,
    id: "preset-library",
    name: "预设库：不想从零编排？一键导入",
    durationSeconds: 4.0,
    layout: "center-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 24,
      actionStartFrame: 48,
      stepFrames: [48, 116, 176],
      holdStartFrame: 212,
    },
  },
  {
    shot: 10,
    id: "outro",
    name: "收尾：品牌定版 + CTA",
    durationSeconds: 4.0,
    layout: "center-stage",
    choreography: {
      textStartFrame: 66,
      visualStartFrame: 0,
      actionStartFrame: 56,
      ctaFrame: 150,
      holdStartFrame: 204,
    },
  },
] as const;

let cursorSeconds = 0;

export const scenes: SceneTiming[] = rawScenes.map((scene, index) => {
  const startSeconds = Number(cursorSeconds.toFixed(2));
  const endSeconds = Number((startSeconds + scene.durationSeconds).toFixed(2));
  cursorSeconds = endSeconds;
  const startFrame = frame(startSeconds);
  const endFrame = frame(endSeconds);
  const isLast = index === rawScenes.length - 1;
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
    // Scenes cross-dissolve: each scene's Sequence is extended by this many
    // frames past its nominal end while the next scene fades in over it.
    overlapWithNextFrames: isLast ? 0 : SCENE_OVERLAP,
  };
});

const lastScene = scenes[scenes.length - 1];

export const composition = {
  ...baseComposition,
  durationSeconds: lastScene.endSeconds,
  durationInFrames: lastScene.endFrame,
} as const;
