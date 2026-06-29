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
