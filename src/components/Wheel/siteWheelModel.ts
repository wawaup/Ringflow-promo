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
  | "gauge.with.dots.needle.67percent";

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
};

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
