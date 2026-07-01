/**
 * Ringflow Promo - Canonical Product Semantics
 * 
 * Single source of truth for Ringflow concepts, labels, and example data.
 * All scenes and components should import from here instead of hardcoding strings.
 * This ensures consistency with the real app behavior while keeping video UIs clean and semantic.
 */

export type WheelAction = {
  id: string;
  label: string;
  semantic: string; // What it actually does for the user
};

export const MAIN_WHEEL_ACTIONS: readonly WheelAction[] = [
  { id: "copy", label: "复制", semantic: "Copy selection (cmd+c)" },
  { id: "paste", label: "粘贴", semantic: "Paste (cmd+v)" },
  { id: "undo", label: "撤销", semantic: "Undo (cmd+z)" },
  { id: "save", label: "保存", semantic: "Save (cmd+s)" },
  { id: "select-all", label: "全选", semantic: "Select all (cmd+a)" },
  { id: "shell", label: "新脚本", semantic: "Shell script action" },
  { id: "monitor", label: "监视器", semantic: "System monitor (CPU, memory, battery...)" },
  { id: "sticky-note", label: "新便签", semantic: "Sticky note" },
] as const;

export const FOLDER_WHEEL_ACTIONS: readonly (WheelAction | null)[] = [
  { id: "summarize", label: "总结提炼", semantic: "Summarize key points" },
  { id: "polish", label: "润色改写", semantic: "Polish / rewrite text" },
  { id: "step-by-step", label: "分步说明", semantic: "Step-by-step explanation" },
  null,
  null,
  { id: "compare", label: "对比分析", semantic: "Compare and analyze" },
  { id: "complete", label: "补充完善", semantic: "Complete and fill details" },
  null,
] as const;

// Real default prompt content examples from the app
export const TEXT_ACTION_PROMPTS: Record<string, string> = {
  "总结提炼": "请阅读以上内容，提炼核心信息，用清晰有条理的方式总结，并列出最重要的几个要点。",
  "润色改写": "请帮我润色这段文字，让表达更清晰、自然，保持原意不变，适合日常阅读和使用。",
  "分步说明": "请把这个问题拆分成若干步骤，逐步说明该怎么做，并在关键步骤注明需要注意的地方。",
  "对比分析": "请从多个角度对比分析这些选项的优劣，说明各自适用场景，并给出你的建议和理由。",
  "补充完善": "请在现有内容基础上适当补充细节和例子，把说明写得更完整、更容易理解。",
};

// Exact real default actions from mac app (ActionItem.defaultLibrary)
export const REAL_DEFAULT_MAIN_ACTIONS = [
  "复制", "粘贴", "撤销", "保存", "全选", "新脚本", "监视器", "新便签"
] as const;

export const REAL_TEXT_PROMPTS = [
  "总结提炼", "润色改写", "分步说明", "对比分析", "补充完善"
] as const;

export const REAL_MONITOR_LABELS = [
  { label: "CPU", metric: "cpuUsage" },
  { label: "内存", metric: "memoryUsage" },
  { label: "网速", metric: "networkTraffic" },
  { label: "电池", metric: "batteryLevel" },
];

// Core feature examples used across scenes (semantic, video-friendly)
export const QUICK_INPUT_EXAMPLE = {
  action: "润色改写",
  result: "Prompt inserted · 剪贴板已恢复",
  insertedText: "把需求拆成可验证的步骤，并给出边界检查建议。",
};

export const QUICK_OPEN_TARGETS = [
  { label: "Terminal", desc: "命令行环境" },
  { label: "README.md", desc: "项目说明" },
  { label: "Project Folder", desc: "项目目录" },
];

export const STICKY_NOTE_EXAMPLE = {
  title: "会议要点",
  items: [
    "订阅状态刷新点",
    "设备解绑入口",
    "预设导入后的默认轮盘",
  ],
};

export const MACRO_STEPS = [
  { label: "复制选区", status: "完成" },
  { label: "切换到目标 App", status: "完成" },
  { label: "粘贴并保存", status: "完成" },
  { label: "恢复剪贴板", status: "完成" },
];

export const SHELL_EXAMPLE = {
  command: "pnpm run build",
  result: "Done in 2.4s",
};

export const MONITOR_METRICS = [
  { label: "CPU", value: "18%", raw: 0.18 },
  { label: "内存", value: "62%", raw: 0.62 },
  { label: "网络", value: "42M", raw: 0.45 },
  { label: "电池", value: "86%", raw: 0.86 },
];

export const APP_PROFILES = [
  {
    role: "写作",
    app: "Notion",
    actions: ["润色改写", "总结提炼", "翻译"],
  },
  {
    role: "开发",
    app: "Cursor",
    actions: ["运行测试", "新脚本", "Git Push"],
  },
  {
    role: "会议",
    app: "Zoom",
    actions: ["新便签", "截图", "快捷指令"],
  },
];

export const PRESETS = [
  {
    name: "AI 写作助手",
    desc: "提示词 + 便签 + 总结",
    status: "应用中",
  },
  {
    name: "开发者工作流",
    desc: "Shell + 宏序列 + 监视器",
    status: "导入",
  },
  {
    name: "会议记录整理",
    desc: "便签 + 总结 + 快捷指令",
    status: "导入",
  },
];

export const SHORTCUTS_EXAMPLE = {
  action: "发送到手机",
  result: "快捷指令完成",
};

// Helper: get action label by semantic id (for wheel integration)
export function getActionLabel(id: string): string {
  const found = [...MAIN_WHEEL_ACTIONS, ...FOLDER_WHEEL_ACTIONS.filter(Boolean)].find(
    (a) => a && (a.id === id || a.label.includes(id))
  );
  return found ? found.label : id;
}
