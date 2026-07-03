import type { WheelSegmentId } from "../../config/wheel";

export type SiteWheelSlot = {
  label: string;
  icon: SiteWheelIconName;
  isFolder?: boolean;
  isMonitor?: boolean;
};

export type SiteWheelIconName =
  | "folder.fill"
  | "doc.on.doc"
  | "doc.on.clipboard"
  | "arrow.uturn.backward"
  | "square.and.arrow.down"
  | "selection.pin.in.out"
  | "terminal.fill"
  | "thermometer.medium"
  | "note.text"
  | "text.alignleft"
  | "pencil.line"
  | "list.number"
  | "arrow.left.arrow.right"
  | "text.append"
  | "text.bubble.fill"
  | "gauge.with.dots.needle.67percent"
  | "keyboard"
  | "square.grid.2x2"
  | "bolt.fill"
  | "globe"
  | "play.fill"
  | "camera.fill"
  | "mic.slash"
  | "arrow.up.circle";

export const MAIN_SLOTS = [
  { label: "复制", icon: "doc.on.doc" },
  { label: "粘贴", icon: "doc.on.clipboard" },
  { label: "撤销", icon: "arrow.uturn.backward" },
  { label: "保存", icon: "square.and.arrow.down" },
  { label: "全选", icon: "selection.pin.in.out" },
  { label: "新脚本", icon: "terminal.fill" },
  { label: "监视器", icon: "gauge.with.dots.needle.67percent" },
  { label: "新便签", icon: "note.text" },
] as const satisfies readonly SiteWheelSlot[];

export const FOLDER_SLOTS = [
  { label: "总结提炼", icon: "text.alignleft" },
  { label: "润色改写", icon: "pencil.line" },
  { label: "分步说明", icon: "list.number" },
  null,
  null,
  { label: "对比分析", icon: "arrow.left.arrow.right" },
  { label: "补充完善", icon: "text.append" },
  null,
] as const satisfies readonly (SiteWheelSlot | null)[];

export const SITE_WHEEL_ICON_PATHS: Record<SiteWheelIconName, string> = {
  "folder.fill":
    '<path d="M3.5 7.8c0-1.1.8-1.9 1.9-1.9h4.2c.6 0 1.1.2 1.5.7l1.2 1.3h6.3c1.1 0 1.9.8 1.9 1.9v7.7c0 1.1-.8 1.9-1.9 1.9H5.4c-1.1 0-1.9-.8-1.9-1.9V7.8z" fill="currentColor"/>',
  "doc.on.doc":
    '<path d="M8.2 6.4V5.2c0-1 .7-1.7 1.7-1.7h6.2c1 0 1.7.7 1.7 1.7v9.2c0 1-.7 1.7-1.7 1.7h-1.2" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><rect x="5.8" y="8" width="9.1" height="12.5" rx="1.7" fill="none" stroke="currentColor" stroke-width="1.55"/>',
  "doc.on.clipboard":
    '<path d="M8.2 5.8h1.5a2.4 2.4 0 0 1 4.6 0h1.5c.9 0 1.6.7 1.6 1.6v10.1c0 .9-.7 1.6-1.6 1.6H8.2c-.9 0-1.6-.7-1.6-1.6V7.4c0-.9.7-1.6 1.6-1.6z" fill="none" stroke="currentColor" stroke-width="1.55"/><path d="M9.4 8h5.2" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M9.2 12h5.6M9.2 15.4h4.2" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>',
  "arrow.uturn.backward":
    '<path d="M9.2 6.2 5.4 10l3.8 3.8M5.7 10h8.1a4.8 4.8 0 1 1 0 9.6h-1.2" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
  "square.and.arrow.down":
    '<path d="M12 4v10M7 10l5 5 5-5M5 19h14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  "selection.pin.in.out":
    '<rect x="6" y="6" width="12" height="12" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.35" stroke-dasharray="2.2 2.2"/><path d="M8.3 3.8v4.5M3.8 8.3h4.5M15.7 20.2v-4.5M20.2 15.7h-4.5" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/>',
  "terminal.fill":
    '<rect x="3.8" y="5.4" width="16.4" height="13.2" rx="2.2" fill="currentColor" opacity="0.96"/><path d="m7 9.5 2.6 2.5L7 14.5M11.2 14.6h5.2" fill="none" stroke="white" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>',
  "thermometer.medium":
    '<path d="M12 4.2v9.2a4.1 4.1 0 1 1-2.7 0V4.2a1.35 1.35 0 1 1 2.7 0z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.65 8.8H12" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><circle cx="10.65" cy="17.1" r="1.85" fill="currentColor"/>',
  "note.text":
    '<path d="M6.1 4.6h9.4l2.4 2.5v12.3H6.1z" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M15.4 4.8v2.7h2.5M8.7 10.4h6.6M8.7 13.4h6.6M8.7 16.4h4.2" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>',
  "text.alignleft":
    '<path d="M5 6.5h14M5 10.3h10.5M5 14.1h14M5 17.9h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  "pencil.line":
    '<path d="M5 18.6h14M6.2 14.8l.8-3.5 7.3-7.3a1.7 1.7 0 0 1 2.4 0l.4.4a1.7 1.7 0 0 1 0 2.4l-7.3 7.3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  "list.number":
    '<path d="M10 7h9M10 12h9M10 17h9" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M5.3 8V5.6L4.5 6M4.4 11.2c.5-.5 2.3-.6 2.3.7 0 1.2-2 1.8-2.3 3h2.4M4.5 17.1c.5-.5 2.1-.6 2.1.5 0 .8-.8 1-1.4 1 .7 0 1.6.2 1.6 1.1 0 1.2-1.8 1-2.4.5" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>',
  "arrow.left.arrow.right":
    '<path d="M8.4 7.2 4.8 10.8l3.6 3.6M5 10.8h14M15.6 16.8l3.6-3.6-3.6-3.6M19 13.2H5" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>',
  "text.append":
    '<path d="M5 6.6h10.2M5 10.2h14M5 13.8h8.2M5 17.4h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M17 15.2v5M14.5 17.7h5" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/>',
  "text.bubble.fill":
    '<path d="M5 6.6a2.6 2.6 0 0 1 2.6-2.6h8.8A2.6 2.6 0 0 1 19 6.6v5.2a2.6 2.6 0 0 1-2.6 2.6h-4.7L8 17.6v-3.2h-.4A2.6 2.6 0 0 1 5 11.8z" fill="currentColor"/><path d="M8.2 8h7.6M8.2 10.8h4.8" stroke="white" stroke-width="1.25" stroke-linecap="round" opacity="0.85"/>',
  "gauge.with.dots.needle.67percent":
    '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 5.5v6.5l4 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  keyboard:
    '<rect x="3.2" y="6.4" width="17.6" height="11.2" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6.2 9.6h.02M9.4 9.6h.02M12.6 9.6h.02M15.8 9.6h.02M6.2 12.4h.02M9.4 12.4h.02M12.6 12.4h.02M15.8 12.4h.02M17.8 9.6h.02M17.8 12.4h.02" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M7.4 15.1h9.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  "square.grid.2x2":
    '<rect x="4" y="4" width="7" height="7" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.8" fill="currentColor"/>',
  "bolt.fill":
    '<path d="M13.4 3.2 5.8 13.1h4.5l-1.7 7.7 7.6-9.9h-4.5z" fill="currentColor" stroke="currentColor" stroke-width="0.8" stroke-linejoin="round"/>',
  globe:
    '<circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="3.9" ry="8.6" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3.6 12h16.8M4.7 8h14.6M4.7 16h14.6" stroke="currentColor" stroke-width="1.3"/>',
  "play.fill":
    '<path d="M8 5.4c0-1 1.1-1.6 2-1.1l9.2 6.6c.8.5.8 1.7 0 2.2L10 19.7c-.9.5-2-.1-2-1.1z" fill="currentColor"/>',
  "camera.fill":
    '<path d="M4.6 7.6h3l1.3-1.9c.3-.4.7-.6 1.2-.6h3.8c.5 0 .9.2 1.2.6l1.3 1.9h3a1.6 1.6 0 0 1 1.6 1.6v8.2a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 17.4V9.2a1.6 1.6 0 0 1 1.6-1.6z" fill="currentColor"/><circle cx="12" cy="13" r="3.2" fill="white" opacity="0.9"/>',
  "mic.slash":
    '<rect x="9.4" y="3.6" width="5.2" height="9.4" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6.4 11.4a5.6 5.6 0 0 0 11.2 0M12 17v3.4M9.4 20.4h5.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4.8 4.8 19.2 19.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  "arrow.up.circle":
    '<circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 16.2V8.4M8.6 11.4 12 8l3.4 3.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
};

/**
 * Showcase wheel for the feature-run + group-ring scenes: one sector per
 * action type (product vocabulary, matching the website's feature cards),
 * plus the group folder at index 7. Highlight sweeps clockwise, one beat per
 * sector, and the folder sector hands over to the group-ring scene.
 */
export const SHOWCASE_SLOTS = [
  { label: "快捷键", icon: "keyboard" },
  { label: "快捷输入", icon: "pencil.line" },
  { label: "快捷打开", icon: "square.grid.2x2" },
  { label: "便签", icon: "note.text" },
  { label: "脚本", icon: "terminal.fill" },
  { label: "指令", icon: "bolt.fill" },
  { label: "监视器", icon: "gauge.with.dots.needle.67percent" },
  { label: "提示词", icon: "folder.fill", isFolder: true },
] as const satisfies readonly SiteWheelSlot[];

/** App-profile wheels for the "不同应用，自动换轮盘" scene. */
export type ProfileWheel = {
  app: string;
  role: string;
  presetName: string;
  slots: readonly SiteWheelSlot[];
};

export const PROFILE_WHEELS: readonly ProfileWheel[] = [
  {
    app: "Notion",
    role: "写作",
    presetName: "写作",
    slots: [
      { label: "润色改写", icon: "pencil.line" },
      { label: "总结提炼", icon: "text.alignleft" },
      { label: "翻译", icon: "globe" },
      { label: "粘贴", icon: "doc.on.clipboard" },
      { label: "便签", icon: "note.text" },
      { label: "保存", icon: "square.and.arrow.down" },
      { label: "全选", icon: "selection.pin.in.out" },
      { label: "提示词", icon: "folder.fill", isFolder: true },
    ],
  },
  {
    app: "Cursor",
    role: "开发",
    presetName: "开发",
    slots: [
      { label: "运行测试", icon: "play.fill" },
      { label: "脚本", icon: "terminal.fill" },
      { label: "Git Push", icon: "arrow.up.circle" },
      { label: "复制", icon: "doc.on.doc" },
      { label: "粘贴", icon: "doc.on.clipboard" },
      { label: "保存", icon: "square.and.arrow.down" },
      { label: "监视器", icon: "gauge.with.dots.needle.67percent" },
      { label: "指令", icon: "bolt.fill" },
    ],
  },
  {
    app: "Zoom",
    role: "会议",
    presetName: "会议",
    slots: [
      { label: "新便签", icon: "note.text" },
      { label: "截图", icon: "camera.fill" },
      { label: "静音", icon: "mic.slash" },
      { label: "复制", icon: "doc.on.doc" },
      { label: "粘贴", icon: "doc.on.clipboard" },
      { label: "指令", icon: "bolt.fill" },
      { label: "监视器", icon: "gauge.with.dots.needle.67percent" },
      { label: "要点", icon: "folder.fill", isFolder: true },
    ],
  },
] as const;

const LEGACY_SEGMENT_TO_SITE_INDEX: Record<WheelSegmentId, number> = {
  "copy": 0,
  "paste": 1,
  "undo": 2,
  "save": 3,
  "select-all": 4,
  "shell": 5,
  "monitor": 6,
  "sticky-note": 7,
  "prompt-folder": 0,
  "quick-input": 1,
  "quick-open": 5,
  "macro": 5,
  shortcuts: 2,
};

const LEGACY_SEGMENT_TO_FOLDER_INDEX: Partial<Record<WheelSegmentId, number>> = {
  "prompt-folder": 0,
  "quick-input": 1,
  "quick-open": 2,
  shortcuts: 5,
};

export const wheelSegmentToSiteIndex = (segment?: WheelSegmentId): number | null => {
  if (!segment) return null;
  return LEGACY_SEGMENT_TO_SITE_INDEX[segment] ?? null;
};

export const wheelSegmentToFolderIndex = (segment?: WheelSegmentId): number | null => {
  if (!segment) return null;
  return LEGACY_SEGMENT_TO_FOLDER_INDEX[segment] ?? null;
};
