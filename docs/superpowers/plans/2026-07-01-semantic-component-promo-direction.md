# Ringflow Promo — Semantic Component Direction (2026-07-01)

## Core Philosophy (用户确认的方向)

- **不使用真实 App 截图**：真实界面信息密度太高，放在宣传片中会抢夺视觉焦点、降低清晰度。
- **采用语义化前端组件**：像写前端需求一样，用 React + Remotion + SVG 组件清晰表达“用户正在做什么、Ringflow 如何帮助”。
- **第一屏是标杆**：`IntroFocusScene` + `InterruptedWorkflowWorkspace` 是目前最成功的例子。
  - 有明确的操作时间逻辑（choreography 驱动的 copy/paste 序列）。
  - 具体工作上下文（代码文件 + AI Chat + 会议纪要 + Prompt 列表）。
  - 不是静态方块+文字，而是“正在发生”的微操作叙事。
- 所有其他场景必须向这个水准看齐：**有上下文 → 呼出 Ringflow → 具体动作执行 → 可见结果反馈**。

## 关键原则

- 每个场景都是一个**小操作故事**（operational narrative）。
- 使用 `choreography`（textStartFrame, actionStartFrame, holdStartFrame 等）精确控制动作时序。
- 轮盘不是装饰，而是驱动真实结果变化的入口。
- 保持 Apple-like：干净、玻璃质感、大留白、克制动效。
- 所有文案和示例数据从单一真相来源读取，避免硬编码漂移。

## 规划的改进方案（已执行核心部分）

### 1. 数据来源（Canonical Product Semantics）
- 新建 `src/config/productSemantics.ts`
- 集中管理：
  - 轮盘主扇区 + 文件夹扇区（与真实 Swift `ActionItem` / `WheelFolder` 对齐）
  - 各功能示例结果文案（quick input result, macro steps, monitor metrics 等）
  - App Profiles、Presets 示例
- 所有场景和组件逐步从这里取数据。

### 2. 集成修复（Integration）
- `src/config/timeline.ts`
  - 补齐缺失的 `product-reveal`（shot 4）。
  - 15 个场景连续编号。
  - 保持第一屏密集叙事时长，其他场景微调以获得更好整体节奏（当前总时长 ~51.7s）。
- `src/PromoFilm.tsx`
  - 从硬编码数组改为基于 `SceneId` 的 `SCENE_MAP`。
  - 确保 timeline 配置与实际播放组件 1:1 对齐。

### 3. 场景升级方向（以第一屏为模板）

**必须达到的效果**：
- 观众不需要额外解释，就能清楚说出“这个人刚才在做什么、Ringflow 具体帮他完成了什么”。

具体场景语义重点（规划）：

- **ProductReveal**：干净的“出现在光标旁边”仪式感 + 光标意图。
- **CoreGesture**：按住 → 划动（外环展开 + 扇区预告） → 释放 → 明确完成反馈。三段式必须可读。
- **QuickInput**：当前编辑上下文 + 轮盘出现 + “润色改写”动作 → 输入框出现 prompt + “剪贴板已恢复”反馈。
- **QuickOpen**：上下文里一划打开 Terminal / README / 项目文件夹，并给出清晰“已打开”状态。
- **StickyNote**：hover 预览 → 松手钉到桌面（弹性展开）。
- **Macro / Shell**：步骤/命令按时间依次执行，轮盘进入 “运行中” 状态，结果可见（Done in 2.4s 等）。
- **Friction**：不要抽象菜单卡片。要像第一屏一样用微操作链展示“找来找去、来回切换”的代价。
- **AppProfiles / PresetLibrary**：用极简语义卡片表达“不同 App 不同轮盘”和“下载→导入→可用”，并与轮盘状态联动。
- **Monitor / Shortcuts**：快速查看状态 / 触发已有自动化 的清晰演示。

### 4. 其他方向

- 继续复用/对齐真实 Swift 代码中的常量（`WheelConfig.swift`、`WheelGeometry.swift`、`ActionType` 等）。
- 轮盘组件（`RingflowWheel` + `siteWheelModel`）已经非常接近真实 app，继续保持并逐步对齐最新行为（folder ring、gesture 阈值等）。
- 节奏：前半慢而有力建立价值，后半清晰高效展示能力。
- QA 标准：渲染关键 stills，对比“是否让观众立刻明白我们在干什么”。

## 与真实 App 代码的关系

现在可以直接参考父文件夹的真实代码来保证语义准确性：
- `Ringflow/Utils/WheelConfig.swift`（sectorCount=8, overlayInnerDeadZoneRatio=0.375, folderRingGap=8, folderRingThickness=60 等）
- `Ringflow/Models/ActionItem.swift`（ActionType: text=快捷输入, openApp=快捷打开, stickyNote, shellScript, monitor 等）
- `Ringflow/Views/Wheel/` 下的真实绘制逻辑
- `RingflowTests/WheelDesignSpecTests.swift`

目标是：promo 的组件语义与真实 app 行为一致，但视觉上更干净、适合视频叙事。

## 当前状态与后续

- 核心集成和几个关键场景（ProductReveal、CoreGesture、QuickInput、Friction、StickyNote、Macro）已按此方向升级。
- 第一屏保持为参考实现。
- 后续可以继续把更多场景接上 `productSemantics.ts`，并根据真实 Swift 代码里的最新 Action / Preset 模型更新示例数据。

---

**文档目的**：作为后续迭代、与设计师/剪辑师沟通、以及未来参考的单一事实来源。

下一步建议：
- 继续用真实 Swift 代码对齐 wheel 行为和 action labels。
- 渲染多帧 stills 做视觉 QA。
- 针对剩余场景（Shell、AppProfiles、PresetLibrary 等）继续按“操作故事”模板升级。