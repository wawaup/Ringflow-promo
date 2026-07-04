import { AbsoluteFill } from "remotion";

/**
 * Classic macOS desktop wallpaper — a Big Sur/Monterey-style mountain-ridge
 * gradient. Pure CSS/SVG, no external image assets.
 */
export const MacDesktopWallpaper = () => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b1c3d" />
          <stop offset="34%" stopColor="#3a2f6e" />
          <stop offset="60%" stopColor="#8b4a86" />
          <stop offset="80%" stopColor="#e07a5f" />
          <stop offset="100%" stopColor="#f4a45f" />
        </linearGradient>
        <linearGradient id="ridgeFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3d78" />
          <stop offset="100%" stopColor="#6b4f7a" />
        </linearGradient>
        <linearGradient id="ridgeMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#33285a" />
          <stop offset="100%" stopColor="#4a3468" />
        </linearGradient>
        <linearGradient id="ridgeNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1638" />
          <stop offset="100%" stopColor="#221a3f" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe3b0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffe3b0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1920" height="1080" fill="url(#sky)" />
      <circle cx="1500" cy="300" r="260" fill="url(#sun)" />

      {/* Far ridge */}
      <path
        d="M0,620 L160,560 320,600 480,540 660,590 840,520 1040,585 1240,530 1440,600 1640,545 1920,610 L1920,1080 0,1080 Z"
        fill="url(#ridgeFar)"
        opacity="0.85"
      />
      {/* Mid ridge */}
      <path
        d="M0,720 L200,660 420,710 620,650 860,715 1080,655 1300,720 1520,660 1740,715 1920,680 L1920,1080 0,1080 Z"
        fill="url(#ridgeMid)"
        opacity="0.92"
      />
      {/* Near ridge */}
      <path
        d="M0,840 L240,780 500,830 760,770 1000,835 1260,775 1500,835 1740,780 1920,830 L1920,1080 0,1080 Z"
        fill="url(#ridgeNear)"
      />
    </svg>
  </AbsoluteFill>
);
