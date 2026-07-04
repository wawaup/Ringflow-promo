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
  // Reveal: rotate-in centered → shrink to corner → app screenshot
  wheelRotateFrame?: number;
  wheelShrinkFrame?: number;
  screenshotFrame?: number;
  // Gesture phases
  pressStartFrame?: number;
  swipeStartFrame?: number;
  releaseFrame?: number;
  // Gesture: click-select beat before the wheel is summoned
  clickTargetFrame?: number;
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
  // Umbrella: action-list → drag → drop-into-wheel
  dragStartFrame?: number;
  dropFrame?: number;
};

const baseComposition = {
  id: "RingflowPromo",
  width: 1920,
  height: 1080,
  fps: FPS,
} as const;

export type SceneId =
  | "friction"
  | "reveal"
  | "gesture"
  | "umbrella"
  | "feature-run"
  | "group-ring"
  | "app-profiles"
  | "preset-library"
  | "app-gallery"
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
export const FEATURE_BEAT_FRAMES = 102;
export const FEATURE_BEAT_COUNT = 7;

const rawScenes = [
  {
    shot: 1,
    id: "friction",
    name: "摩擦：三个来源窗口搬进 Terminal，一轮完整演示 + 快速切窗蒙太奇 + 计数器",
    durationSeconds: 11.7,
    layout: "left-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 20,
      actionStartFrame: 40, // 阶段1 完整一轮（Markdown bug），阶段2 便签/报错快速接力
      holdStartFrame: 660,
    },
  },
  {
    shot: 2,
    id: "reveal",
    name: "亮相：文案先行 → 轮盘居中旋入 → 缩入应用预览框 + 截图展开",
    durationSeconds: 3.9, // 收紧：轮盘对齐落位后只留 ~0.5s 呼吸，立刻切下一镜
    layout: "center-stage",
    choreography: {
      textStartFrame: 6, // 主标题先读一拍（40 帧），Ringflow 与轮盘同帧入场
      visualStartFrame: 24,
      actionStartFrame: 46,
      wheelStartFrame: 46, // = textStartFrame + lineStagger(40)，与第二行同帧
      wheelRotateFrame: 46,
      wheelShrinkFrame: 140, // 转完即收：截图快速展开 + 轮盘对齐落位
      holdStartFrame: 200,
    },
  },
  {
    shot: 3,
    id: "gesture",
    name: "核心手势：如何唤醒？· 中键下陷 → 轻滑 → 轮盘旋入 → 松手执行 → 触控板接力",
    durationSeconds: 7.6,
    layout: "center-stage",
    choreography: {
      // NOTE: visualStartFrame here ONLY gates SceneShell's outer children-
      // wrapper spring (opacity on the whole title+words+demo block). Since
      // the title itself must read from frame 0, this must be 0 too — any
      // later value re-creates the "everything pops in together" bug (the
      // wrapper's own fade would lag behind and mask the text's carefully
      // staggered internal reveal). The demo's own later start lives in
      // GestureScene's local `demoStart` constant, fully independent of this.
      textStartFrame: 0, // 标题先读一拍，三个词组每 34 帧逐个入场（~128 帧全部落定）
      visualStartFrame: 0,
      actionStartFrame: 140,
      pressStartFrame: 162, // 中键按下：下陷 + 高亮（鼠标原地不动），文字落定后才开始
      swipeStartFrame: 194, // 向斜上方（东北）轻轻一滑
      wheelStartFrame: 200, // 轮盘在偏右位置旋转出现，摇杆式高亮滑动方向
      releaseFrame: 280, // 松手执行：中键取消高亮、鼠标上弹，轮盘收起 → 「动作已执行」toast
      holdStartFrame: 448,
      wordFrames: [162, 200, 280], // 与按下 / 移向 / 松手三个动作同步点亮
      trackpadHintFrame: 374, // 鼠标演示隐去后，触控板演示在同一位置放大接力
    },
  },
  {
    shot: 4,
    id: "umbrella",
    name: "伞句：把常用操作，放进轮盘（快捷键拖入空扇区）",
    durationSeconds: 3.6, // 收紧：落位脉冲结束后 ~0.5s 即切，不多等
    layout: "center-stage",
    choreography: {
      textStartFrame: 8,
      visualStartFrame: 24,
      actionStartFrame: 64,
      dragStartFrame: 96,
      dropFrame: 152,
      holdStartFrame: 200,
    },
  },
  {
    shot: 5,
    id: "feature-run",
    name: "功能节拍：七种动作，一种手势",
    durationSeconds: (FEATURE_BEAT_FRAMES * FEATURE_BEAT_COUNT) / FPS,
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
    shot: 6,
    id: "group-ring",
    name: "分组外环：一个轮盘装下更多（鼠标向左上，外环展开）",
    durationSeconds: 3.6, // 收紧：外环展开+高亮settle 后 ~0.4s 即切
    layout: "center-stage",
    choreography: {
      textStartFrame: 0,
      visualStartFrame: 18,
      actionStartFrame: 64, // 鼠标向左上轻移，分组扇区高亮
      folderExpandFrame: 100, // 外环展开、填满操作区块
      wheelStartFrame: 18,
      wheelHighlightStartFrame: 150,
      wheelHighlightEndFrame: 186,
      holdStartFrame: 208,
    },
  },
  {
    shot: 7,
    id: "app-profiles",
    name: "应用配置：不同应用，自动换轮盘",
    durationSeconds: 3.7,
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
    shot: 8,
    id: "preset-library",
    name: "预设库：不想从零编排？一键导入",
    durationSeconds: 3.7,
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
    shot: 9,
    id: "app-gallery",
    name: "应用长廊：多行 app 胶卷滚动 → 支持 Mac 上的所有应用 → 向两侧收起",
    durationSeconds: 4.4,
    layout: "center-stage",
    choreography: {
      textStartFrame: 64, // 滚动铺满后，标题浮出
      visualStartFrame: 6,
      actionStartFrame: 196, // 各行加速滚出两侧
      holdStartFrame: 250,
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
