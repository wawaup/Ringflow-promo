export const theme = {
  safeArea: {
    x: 120,
    y: 110,
  },
  colors: {
    ink: "#111827",
    muted: "#5d6676",
    softBlue: "#eaf5ff",
    accentBlue: "#2f7fd3",
    darkInk: "#e8edf7",
    darkMuted: "#9aa7bd",
    darkPanel: "rgba(23, 31, 45, 0.72)",
    glassLight: "rgba(255, 255, 255, 0.64)",
    glassDark: "rgba(29, 38, 54, 0.66)",
    runningOrange: "#f59e0b",
  },
  type: {
    headline: 88,
    caption: 44,
    label: 32,
    small: 24,
  },
  shadow: {
    panel: "0 24px 80px rgba(30, 45, 70, 0.16), 0 2px 12px rgba(30, 45, 70, 0.08)",
    wheel: "0 20px 64px rgba(20, 40, 70, 0.20)",
  },
} as const;
