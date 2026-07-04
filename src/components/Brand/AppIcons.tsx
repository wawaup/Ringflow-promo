import type { CSSProperties } from "react";

export type AppIconName = "notion" | "cursor" | "zoom" | "terminal" | "doc" | "folder";

/**
 * Recognizable, hand-drawn (pure SVG/CSS) recreations of real app icons —
 * Notion / Cursor / Zoom plus the macOS Terminal, TextEdit-style document and
 * Finder folder. No trademarked image assets are bundled; these are stylized
 * lookalikes good enough to read instantly at promo sizes.
 */
export const AppIcon = ({ name, size = 54 }: { name: AppIconName; size?: number }) => {
  const radius = size * 0.235;
  const box: CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    display: "grid",
    placeItems: "center",
    flex: "none",
    boxShadow: "0 4px 12px rgba(10,20,45,0.16)",
    overflow: "hidden",
  };

  switch (name) {
    case "notion":
      return (
        <div style={{ ...box, background: "#ffffff", border: "1px solid rgba(10,11,13,0.12)" }}>
          <span
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: 700,
              fontSize: size * 0.58,
              color: "#0a0b0d",
              lineHeight: 1,
              transform: "translateY(-2%)",
            }}
          >
            N
          </span>
        </div>
      );
    case "cursor":
      return (
        <div style={{ ...box, background: "linear-gradient(150deg, #1c1c1e 0%, #000000 100%)" }}>
          {/* Isometric cube mark */}
          <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="12,1.5 21.5,7 21.5,17.5 12,23 2.5,17.5 2.5,7" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinejoin="round" />
            <polygon points="12,1.5 21.5,7 12,12.4 2.5,7" fill="rgba(255,255,255,0.32)" />
            <polygon points="12,12.4 21.5,7 21.5,17.5 12,23" fill="rgba(255,255,255,0.78)" />
          </svg>
        </div>
      );
    case "zoom":
      return (
        <div style={{ ...box, background: "linear-gradient(150deg, #4a8cff 0%, #0b5cff 100%)" }}>
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2.5" y="7" width="13" height="10" rx="3.2" fill="#ffffff" />
            <path d="M16.5 10.6 21.5 8v8l-5-2.6z" fill="#ffffff" />
          </svg>
        </div>
      );
    case "terminal":
      return (
        <div style={{ ...box, background: "linear-gradient(160deg, #2b2f38 0%, #14161c 100%)", border: "1px solid rgba(255,255,255,0.14)" }}>
          <span
            style={{
              fontFamily: "SF Mono, Menlo, monospace",
              fontWeight: 700,
              fontSize: size * 0.36,
              color: "#f4f6fb",
              lineHeight: 1,
            }}
          >
            &gt;_
          </span>
        </div>
      );
    case "doc":
      return (
        <div style={{ ...box, background: "#ffffff", border: "1px solid rgba(10,11,13,0.12)" }}>
          <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 3.2h11.6L20 7.6v13.2H4z" fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M15.4 3.4v4.4H19.8" fill="none" stroke="#94a3b8" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M7 11h10M7 14.2h10M7 17.4h6.4" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case "folder":
      return (
        <div style={{ ...box, background: "transparent", boxShadow: "none", overflow: "visible" }}>
          <svg width={size * 0.92} height={size * 0.92} viewBox="0 0 24 24" aria-hidden="true" style={{ filter: "drop-shadow(0 3px 6px rgba(10,20,45,0.22))" }}>
            <defs>
              <linearGradient id="rf-folder-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#79bbff" />
                <stop offset="100%" stopColor="#3f8ef7" />
              </linearGradient>
            </defs>
            <path d="M2.4 6.2c0-1 .8-1.8 1.8-1.8h5l1.7 1.9h9c1 0 1.7.8 1.7 1.8v.9H2.4z" fill="#5ea3fb" />
            <rect x="2.4" y="7.6" width="19.2" height="12" rx="1.8" fill="url(#rf-folder-grad)" />
          </svg>
        </div>
      );
    default:
      return null;
  }
};
