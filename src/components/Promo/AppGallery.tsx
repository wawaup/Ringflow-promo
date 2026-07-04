import type { CSSProperties, ReactNode } from "react";

/**
 * App gallery tiles — stylized, instantly recognizable recreations of the
 * most popular global + Asian social/productivity apps (pure CSS/SVG, no
 * trademarked assets bundled). Rendered as film-strip rows in the
 * "支持 Mac 上的所有应用" shot.
 */
export type GalleryApp = {
  id: string;
  bg: string;
  /** True for light tiles that need a hairline border. */
  light?: boolean;
  glyph: (s: number) => ReactNode;
};

const text = (content: string, color: string, size: number, weight = 800, family?: string): ReactNode => (
  <span style={{ color, fontSize: size, fontWeight: weight, lineHeight: 1, fontFamily: family ?? "inherit", letterSpacing: "-0.01em" }}>
    {content}
  </span>
);

export const GALLERY_APPS: readonly GalleryApp[] = [
  {
    id: "wechat",
    bg: "linear-gradient(160deg, #2edb72, #07c160)",
    glyph: (s) => (
      <svg width={s * 0.58} height={s * 0.58} viewBox="0 0 24 24">
        <ellipse cx="9.4" cy="9.6" rx="7.2" ry="6" fill="#fff" />
        <path d="M6.4 14.6 5 17.4l3.4-1.6z" fill="#fff" />
        <ellipse cx="16" cy="14.4" rx="5.8" ry="4.8" fill="#fff" opacity="0.92" />
        <path d="M18.6 18.4 20 20.6l-3-1.2z" fill="#fff" opacity="0.92" />
        <circle cx="7" cy="9" r="0.9" fill="#07c160" />
        <circle cx="11.6" cy="9" r="0.9" fill="#07c160" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    bg: "linear-gradient(160deg, #45e065, #25d366)",
    glyph: (s) => (
      <svg width={s * 0.56} height={s * 0.56} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9.4" fill="none" stroke="#fff" strokeWidth="1.9" />
        <path d="M5.4 21.2 6.4 17l2.8 2.6z" fill="#fff" />
        <path d="M8.6 8.9c.4-1 1.4-1.2 1.9-.4l.8 1.3c.3.5-.1 1-.5 1.4-.3.3.9 2 2 2.5.5.2.9-.3 1.4-.5.5-.2 1.1.2 1.4.8l.4.9c.3.7-.5 1.6-1.5 1.5-3-.3-6.6-4.1-5.9-7.5z" fill="#fff" />
      </svg>
    ),
  },
  {
    id: "telegram",
    bg: "linear-gradient(160deg, #37bbfe, #229ed9)",
    glyph: (s) => (
      <svg width={s * 0.55} height={s * 0.55} viewBox="0 0 24 24">
        <path d="M20.8 4.2 3.4 11c-.9.35-.85 1.2.05 1.5l4.3 1.35 1.6 4.9c.3.85 1 .95 1.6.3l2.3-2.3 4.4 3.2c.75.5 1.5.15 1.7-.8l2.5-13.4c.25-1.1-.45-1.7-1.05-1.55zM8.4 13.4l8.9-5.6-6.9 6.5-.3 3z" fill="#fff" />
      </svg>
    ),
  },
  { id: "x", bg: "#0a0a0a", glyph: (s) => text("𝕏", "#fff", s * 0.5, 700) },
  {
    id: "instagram",
    bg: "linear-gradient(45deg, #feda75, #fa7e1e 30%, #d62976 55%, #962fbf 80%, #4f5bd5)",
    glyph: (s) => (
      <svg width={s * 0.54} height={s * 0.54} viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="5.4" fill="none" stroke="#fff" strokeWidth="1.9" />
        <circle cx="12" cy="12" r="4.4" fill="none" stroke="#fff" strokeWidth="1.9" />
        <circle cx="17.3" cy="6.7" r="1.3" fill="#fff" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    bg: "#010101",
    glyph: (s) => (
      <div style={{ position: "relative", fontSize: s * 0.5, fontWeight: 800, lineHeight: 1 }}>
        <span style={{ position: "absolute", left: -2, top: 1, color: "#25f4ee" }}>♪</span>
        <span style={{ position: "absolute", left: 2, top: -1, color: "#fe2c55" }}>♪</span>
        <span style={{ position: "relative", color: "#fff" }}>♪</span>
      </div>
    ),
  },
  { id: "line", bg: "linear-gradient(160deg, #1fd25f, #06c755)", glyph: (s) => text("LINE", "#fff", s * 0.24, 800) },
  {
    id: "kakao",
    bg: "#fee500",
    glyph: (s) => (
      <svg width={s * 0.54} height={s * 0.54} viewBox="0 0 24 24">
        <ellipse cx="12" cy="11" rx="9" ry="7.2" fill="#3c1e1e" />
        <path d="M9 17.4 8 21l4-2.8z" fill="#3c1e1e" />
      </svg>
    ),
  },
  {
    id: "slack",
    bg: "#ffffff",
    light: true,
    glyph: (s) => (
      <svg width={s * 0.52} height={s * 0.52} viewBox="0 0 24 24">
        <rect x="10.6" y="2.5" width="3.4" height="8.4" rx="1.7" fill="#36c5f0" transform="rotate(0 12 12)" />
        <rect x="10.6" y="13.1" width="3.4" height="8.4" rx="1.7" fill="#2eb67d" />
        <rect x="2.5" y="10.6" width="8.4" height="3.4" rx="1.7" fill="#e01e5a" />
        <rect x="13.1" y="10.6" width="8.4" height="3.4" rx="1.7" fill="#ecb22e" />
      </svg>
    ),
  },
  {
    id: "discord",
    bg: "linear-gradient(160deg, #6d79f8, #5865f2)",
    glyph: (s) => (
      <svg width={s * 0.56} height={s * 0.56} viewBox="0 0 24 24">
        <path d="M4.5 7.2C6 5.9 8 5.2 8 5.2l.5 1a10 10 0 0 1 7 0l.5-1s2 .7 3.5 2c1.6 4 2 7.6 1.6 9.4-1.2 1.3-3.9 2.2-3.9 2.2l-.85-1.4c-2 .85-6.7.85-8.7 0L6.8 18.8s-2.7-.9-3.9-2.2c-.4-1.8 0-5.4 1.6-9.4z" fill="#fff" />
        <ellipse cx="9.2" cy="12.6" rx="1.5" ry="1.7" fill="#5865f2" />
        <ellipse cx="14.8" cy="12.6" rx="1.5" ry="1.7" fill="#5865f2" />
      </svg>
    ),
  },
  {
    id: "zoom",
    bg: "linear-gradient(150deg, #4a8cff, #0b5cff)",
    glyph: (s) => (
      <svg width={s * 0.56} height={s * 0.56} viewBox="0 0 24 24">
        <rect x="2.5" y="7" width="13" height="10" rx="3.2" fill="#fff" />
        <path d="M16.5 10.6 21.5 8v8l-5-2.6z" fill="#fff" />
      </svg>
    ),
  },
  { id: "teams", bg: "linear-gradient(160deg, #7b83eb, #5059c9)", glyph: (s) => text("T", "#fff", s * 0.5) },
  { id: "notion", bg: "#ffffff", light: true, glyph: (s) => text("N", "#0a0b0d", s * 0.52, 700, 'Georgia, "Times New Roman", serif') },
  {
    id: "figma",
    bg: "#1e1e1e",
    glyph: (s) => (
      <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="3.4" fill="#f24e1e" />
        <circle cx="12" cy="12" r="3.4" fill="#a259ff" />
        <circle cx="12" cy="19" r="3.4" fill="#1abcfe" />
      </svg>
    ),
  },
  { id: "vscode", bg: "linear-gradient(160deg, #2fa8ff, #007acc)", glyph: (s) => text("</>", "#fff", s * 0.3, 800, "SF Mono, Menlo, monospace") },
  {
    id: "cursor",
    bg: "linear-gradient(150deg, #1c1c1e, #000)",
    glyph: (s) => (
      <svg width={s * 0.56} height={s * 0.56} viewBox="0 0 24 24">
        <polygon points="12,1.5 21.5,7 21.5,17.5 12,23 2.5,17.5 2.5,7" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="12,1.5 21.5,7 12,12.4 2.5,7" fill="rgba(255,255,255,0.32)" />
        <polygon points="12,12.4 21.5,7 21.5,17.5 12,23" fill="rgba(255,255,255,0.78)" />
      </svg>
    ),
  },
  {
    id: "chrome",
    bg: "#ffffff",
    light: true,
    glyph: (s) => (
      <svg width={s * 0.56} height={s * 0.56} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9.6" fill="#fff" />
        <path d="M12 12 4 5.5A9.6 9.6 0 0 1 21.3 8.4H12z" fill="#ea4335" transform="rotate(-8 12 12)" />
        <path d="M12 12 4 5.6A9.6 9.6 0 0 0 6.7 19.3L11 12z" fill="#4285f4" transform="rotate(112 12 12)" />
        <path d="M12 12h9.3A9.6 9.6 0 0 1 6.8 19.4L12 12z" fill="#34a853" transform="rotate(8 12 12)" />
        <circle cx="12" cy="12" r="4.2" fill="#fff" />
        <circle cx="12" cy="12" r="3.3" fill="#4285f4" />
      </svg>
    ),
  },
  {
    id: "safari",
    bg: "linear-gradient(160deg, #59b7ff, #1b6ef3)",
    glyph: (s) => (
      <svg width={s * 0.58} height={s * 0.58} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9.4" fill="#fff" opacity="0.16" />
        <circle cx="12" cy="12" r="9.4" fill="none" stroke="#fff" strokeWidth="1.4" />
        <polygon points="16.8,7.2 13.4,13.4 10.6,10.6" fill="#ff3b30" />
        <polygon points="7.2,16.8 10.6,10.6 13.4,13.4" fill="#fff" />
      </svg>
    ),
  },
  {
    id: "gmail",
    bg: "#ffffff",
    light: true,
    glyph: (s) => (
      <svg width={s * 0.56} height={s * 0.56} viewBox="0 0 24 24">
        <rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="#e8eaed" strokeWidth="1" />
        <path d="M3.5 7 12 13.5 20.5 7" fill="none" stroke="#ea4335" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 18V7.6" stroke="#4285f4" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M20 18V7.6" stroke="#34a853" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "youtube",
    bg: "linear-gradient(160deg, #ff4e45, #ff0033)",
    glyph: (s) => (
      <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 24">
        <path d="M9.2 7.5v9l8-4.5z" fill="#fff" />
      </svg>
    ),
  },
  {
    id: "spotify",
    bg: "linear-gradient(160deg, #23e065, #1db954)",
    glyph: (s) => (
      <svg width={s * 0.54} height={s * 0.54} viewBox="0 0 24 24">
        <path d="M6 9.2c4.2-1.2 8.6-.8 12 1.1" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M6.6 12.8c3.4-.95 7-.6 9.9 1" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7.2 16.2c2.6-.7 5.4-.4 7.7.8" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  { id: "netflix", bg: "#141414", glyph: (s) => text("N", "#e50914", s * 0.54, 900) },
  { id: "red", bg: "linear-gradient(160deg, #ff4d5e, #ff2442)", glyph: (s) => text("小红书", "#fff", s * 0.22, 700) },
  {
    id: "bilibili",
    bg: "linear-gradient(160deg, #2fc1ff, #00aeec)",
    glyph: (s) => (
      <svg width={s * 0.56} height={s * 0.56} viewBox="0 0 24 24">
        <rect x="3.4" y="7" width="17.2" height="12" rx="3" fill="none" stroke="#fff" strokeWidth="1.9" />
        <path d="M8 4.4 10.4 7M16 4.4 13.6 7" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
        <path d="M9 11.4v3.4M15 11.4v3.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  { id: "weibo", bg: "#ffffff", light: true, glyph: (s) => text("微博", "#e6162d", s * 0.3, 800) },
  {
    id: "dingtalk",
    bg: "linear-gradient(160deg, #38a8ff, #007fff)",
    glyph: (s) => (
      <svg width={s * 0.54} height={s * 0.54} viewBox="0 0 24 24">
        <path d="M3.5 10.5C7 4.5 16 3.5 20.5 8c-1.5 3.4-5.5 5.4-9 5.6l6-1.4-7.4 6.4 1.6-4.2c-3.4.2-6.6-1.3-8.2-3.9z" fill="#fff" />
      </svg>
    ),
  },
  { id: "feishu", bg: "#ffffff", light: true, glyph: (s) => text("飞书", "#3370ff", s * 0.3, 800) },
  { id: "word", bg: "linear-gradient(160deg, #2b7cd3, #185abd)", glyph: (s) => text("W", "#fff", s * 0.48) },
  { id: "excel", bg: "linear-gradient(160deg, #21a366, #107c41)", glyph: (s) => text("X", "#fff", s * 0.48) },
] as const;

/** One tile of the gallery strip. */
export const GalleryTile = ({ app, size }: { app: GalleryApp; size: number }) => {
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: size * 0.23,
    background: app.bg,
    border: app.light ? "1px solid rgba(10,11,13,0.10)" : "none",
    display: "grid",
    placeItems: "center",
    flex: "none",
    boxShadow: "0 10px 26px rgba(10,24,61,0.14)",
    overflow: "hidden",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro SC", "PingFang SC", sans-serif',
  };
  return <div style={style}>{app.glyph(size)}</div>;
};

/** Rotate the app list so each row starts on different tiles. */
export const rotateApps = (offset: number): GalleryApp[] => {
  const n = GALLERY_APPS.length;
  const k = ((offset % n) + n) % n;
  return [...GALLERY_APPS.slice(k), ...GALLERY_APPS.slice(0, k)];
};
