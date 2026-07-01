export const wheelConfig = {
  sectorCount: 8,
  overlayOuterRadius: 128,
  overlayInnerDeadZoneRatio: 0.375,
  overlayCenterGlassRatio: 0.82,
  overlayLayoutInset: 4,
  folderRingGap: 8,
  folderRingThickness: 60,
  fanPresentStaggerSeconds: 0.008,
  fanDismissStaggerSeconds: 0.005,
  fanDismissScale: 0.9,
} as const;

export const wheelDerivedConfig = {
  overlayInnerRadius: wheelConfig.overlayOuterRadius * wheelConfig.overlayInnerDeadZoneRatio,
  overlayDiameter: wheelConfig.overlayOuterRadius * 2,
  folderRingInnerRadius: wheelConfig.overlayOuterRadius + wheelConfig.folderRingGap,
  folderRingOuterRadius:
    wheelConfig.overlayOuterRadius + wheelConfig.folderRingGap + wheelConfig.folderRingThickness,
  folderRingMidRadius:
    wheelConfig.overlayOuterRadius + wheelConfig.folderRingGap + wheelConfig.folderRingThickness / 2,
} as const;

export const wheelSegments = [
  { id: "copy", label: "复制" },
  { id: "paste", label: "粘贴" },
  { id: "undo", label: "撤销" },
  { id: "save", label: "保存" },
  { id: "select-all", label: "全选" },
  { id: "shell", label: "新脚本" },
  { id: "monitor", label: "监视器" },
  { id: "sticky-note", label: "新便签" },
  // Feature / folder mappings used by scenes (map to real app labels)
  { id: "prompt-folder", label: "常用提示词" },
  { id: "quick-input", label: "润色改写" },
  { id: "quick-open", label: "快捷打开" },
  { id: "macro", label: "宏序列" },
  { id: "shortcuts", label: "快捷指令" },
] as const;

export type WheelSegmentId = (typeof wheelSegments)[number]["id"];
