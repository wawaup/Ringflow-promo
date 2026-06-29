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
  { id: "quick-input", label: "润色改写" },
  { id: "quick-open", label: "快捷打开" },
  { id: "sticky-note", label: "便签" },
  { id: "macro", label: "宏序列" },
  { id: "shell", label: "Shell" },
  { id: "shortcuts", label: "快捷指令" },
  { id: "monitor", label: "监视器" },
  { id: "profiles", label: "配置" },
] as const;

export type WheelSegmentId = (typeof wheelSegments)[number]["id"];
