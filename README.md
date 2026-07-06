# Ringflow Promo

Remotion 项目：为 macOS 效率应用 **Ringflow**（径向动作轮盘）制作的 Apple 风格产品宣传片，1920×1080 @ 60fps，时长 < 60 秒。全部画面由 React/TypeScript + SVG 编排渲染，不依赖屏幕录制或 AI 生成素材，所有中英文文案均为真实渲染文字。

## 快速开始

```bash
pnpm install        # 安装依赖（本仓库用 pnpm，见 pnpm-workspace.yaml）
pnpm start          # 打开 Remotion Studio，交互式预览/调试所有镜头
pnpm run build      # typecheck + 单元测试 + 时间轴一致性检查（提交前必跑）
pnpm run render     # 渲染完整成片到 out/ringflow-promo-animatic.mp4
```

其他常用脚本：

| 命令 | 作用 |
|---|---|
| `pnpm run typecheck` | `tsc --noEmit` |
| `pnpm test` | `node --test`，跑 `src/**/*.test.ts`（时间轴 + 轮盘几何测试） |
| `pnpm run check:timeline` | 校验 `timeline.ts`：场景无间隙衔接、总时长 < 60s |
| `pnpm run still` | 渲染单帧静态图（默认第 900 帧），用于走查某一时刻的画面 |
| `pnpm run stills` | 按 `scripts/render-stills.mjs` 中列出的关键帧批量出图 |

## 项目结构

```
src/
  index.ts               Remotion 入口，registerRoot
  Root.tsx               <Composition> 声明，尺寸/帧率/总时长取自 timeline.ts
  PromoFilm.tsx           顶层容器：按 timeline.scenes 顺序挂载各镜头 + 交叉淡化
  scenes/
    01_FrictionScene.tsx      镜1 摩擦：多来源窗口反复搬进 Terminal 的烦躁蒙太奇
    03_RevealScene.tsx        镜2 亮相：轮盘居中旋入 → 缩入应用预览
    04_GestureScene.tsx       镜3 核心手势：中键下陷→轻滑→轮盘→松手执行
    05_UmbrellaScene.tsx      镜4 伞句：把常用操作拖进轮盘空扇区
    06_FeatureRunScene.tsx    镜5 功能节拍：七个动作，一种手势
    07_GroupRingScene.tsx     镜6 分组外环：一个轮盘装下更多
    08_AppProfilesScene.tsx   镜7 应用配置：不同应用自动换轮盘
    09_PresetLibraryScene.tsx 镜8 预设库：一键导入
    10_AppGalleryScene.tsx    镜9 应用长廊：多行 app 图标滚动展示
    10_OutroScene.tsx         镜10 收尾：品牌定版 + CTA + 官网地址
    SceneShell.tsx            所有镜头共用的外壳（标题渲染 + 内容淡入 spring）
  components/
    Wheel/          Ringflow 轮盘本体（RingflowWheel、几何计算、真实分区模型）
    Cursor/         鼠标 / 触控板手势可视化
    MacUI/          原生 macOS 菜单栏、窗口 chrome、右键菜单、卡片
    ProductUI/      场景专用的产品界面复刻（Terminal、拖拽列表等）
    Promo/          品牌通用组件：应用图标长廊、结束卡、玻璃卡片、快捷键胶囊
    Background/     桌面壁纸 / 品牌背景
    Text/、Toast/、Brand/  文案渲染、提示 toast、Logo 标记
  config/
    timeline.ts       唯一时间轴真相源：每个镜头的 durationSeconds + 内部编排帧号
    copy.ts           全片文案（对齐官网真实表述，禁止占位文案）
    productSemantics.ts / wheel.ts   真实轮盘分区、动作、图标数据
    theme.ts、motion.ts、layout.ts   配色、缓动曲线、通用布局尺寸
docs/
  promo-animation-choreography-principles.md   动效编排原则详细版
  ringflow-promo-prioritized-work-blocks.md    历史迭代 Block 划分记录
scripts/
  check-timeline.mjs    CI/本地时间轴校验脚本
  render-stills.mjs     批量关键帧出图脚本
.agents/skills/         项目专用 skill（ringflow-promo、motion-qa、remotion-promo-iteration 等）
```

## 核心架构概念

- **单一时间轴真相源**：`src/config/timeline.ts` 里 `rawScenes` 数组声明每个镜头的 `durationSeconds` 和一份场景本地的 `choreography`（各动作的帧号，如 `textStartFrame`/`visualStartFrame`/`actionStartFrame`/`holdStartFrame` 等）。模块顶部的 reduce 把它们转换成带累积绝对帧号（`startFrame`/`endFrame`）的 `scenes` 数组；相邻镜头之间用 `SCENE_OVERLAP`（12 帧）做交叉淡化，`scenes[i].endFrame === scenes[i+1].startFrame`，永远零间隙衔接。
- **SceneShell**：所有镜头共用的外壳，负责渲染可选的内置标题文字（`hideText` 可关闭）并把 `children` 包进一个由 `spring()`（以 `choreography.visualStartFrame` 为起点）驱动透明度的容器。**已知坑**：如果某镜头的 `children` 内部还有自己的逐字/逐词错峰入场动画，而 `visualStartFrame` 又设得较晚，外层这个 spring 会整体延迟出现，把内部精心编排的错峰效果"锁死"成一次性同时弹出。规避方法：把 `visualStartFrame` 保持在 0，"内容延后开始"的需求改用镜头内部一个独立的本地常量（不要复用 `visualStartFrame`）来控制。参见 `04_GestureScene.tsx` 中 `demoStart` 的写法与其上方注释。
- **真实产品数据**：所有轮盘分区、图标、文案必须来自 `productSemantics.ts` / `copy.ts` / `wheel.ts`，与真实 macOS App 和官网保持一致，禁止编造占位内容。
- **60 秒硬约束**：`src/config/timeline.test.ts` 断言 `composition.durationSeconds < 60`；`scripts/check-timeline.mjs` 是等价的独立校验脚本，供 `pnpm run build` 调用。

## 开发规范

详见 `AGENTS.md`（项目指令 + 动效编排原则 + commit 规范）与 `docs/promo-animation-choreography-principles.md`（编排原则详细版）。要点：

- 每次改动时间轴或动效后，固定验证顺序：`pnpm run typecheck` → `node --test src/config/timeline.test.ts src/components/Wheel/*.test.ts` → 用 `remotion still --frame=<N> --scale=0.5` 渲染关键帧走查 → 确认无误再提交。
- `interpolate()` 的 `inputRange` 必须严格单调递增，否则渲染直接崩溃；压缩时序时用 `Math.max(prev + 1, target - 2)` 之类的写法兜底。
- Commit message 用中文 Conventional Commits（`feat:`/`fix:`/`docs:`/`refactor:` 等），只在一个完整可review 的改动做完后提交。
- 素材优先用真实来源：应用图标优先用 [Simple Icons](https://simpleicons.org)（CC0 开源品牌图标集）而非截图爬取或手绘拟真；确实没有开源资源时，明确用注释标注"手绘替代品，非真实素材"，不要用纯文字兜底。

## 相关链接

- 官网：<https://ringflow.emio.cn>
