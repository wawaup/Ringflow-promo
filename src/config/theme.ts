/**
 * Ringflow Promo — Visual theme, aligned with the official website (Ringflow-web).
 *
 * Website palette reference (public/css):
 *   bg #f8f9fc · ink #0a0b0d · secondary #43474e · brand blue #2f6bff (deep #1e4fd6)
 *   headline gradient, soft radial blue ambience, cubic-bezier(0.22,1,0.36,1)
 */
export const theme = {
  safeArea: {
    x: 120,
    y: 100,
  },
  colors: {
    // Light stage (website-aligned)
    bg: "#f8f9fc",
    ink: "#0a0b0d",
    muted: "#43474e",
    accent: "#2f6bff",
    accentDeep: "#1e4fd6",
    softBlue: "#eef4ff",
    // Legacy alias kept for MacUI/ProductSurfaces components
    accentBlue: "#2f6bff",
    // Dark stage
    darkBg: "#0b0e14",
    darkInk: "#eef2f8",
    darkMuted: "#98a2b3",
    darkPanel: "rgba(22, 28, 40, 0.74)",
    // Glass
    glassLight: "rgba(255, 255, 255, 0.66)",
    glassDark: "rgba(26, 32, 45, 0.66)",
    runningOrange: "#f59e0b",
  },
  gradients: {
    // Brand headline gradient — reserved for brand moments (reveal / outro)
    headlineLight: "linear-gradient(120deg, #0a0b0d 30%, #2f6bff 92%)",
    headlineDark: "linear-gradient(120deg, #f4f7ff 30%, #7fa4ff 92%)",
    accent: "linear-gradient(135deg, #2f6bff 0%, #1e4fd6 100%)",
  },
  type: {
    hero: 132,
    headline: 96,
    caption: 40,
    label: 30,
    small: 24,
  },
  shadow: {
    panel: "0 30px 80px rgba(10, 24, 61, 0.14), 0 2px 12px rgba(10, 24, 61, 0.07)",
    wheel: "0 24px 72px rgba(15, 40, 90, 0.20)",
    card: "0 18px 48px rgba(10, 24, 61, 0.10), 0 1px 6px rgba(10, 24, 61, 0.06)",
  },
} as const;
