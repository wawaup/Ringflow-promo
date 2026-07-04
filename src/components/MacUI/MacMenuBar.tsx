import { theme } from "../../config/theme";

type MacMenuBarProps = {
  appName: string;
  menus?: string[];
  activeMenu?: string;
  width?: number;
  mode?: "light" | "dark";
  /** Flush against a window body below it (no independent radius/blur) — Word-style single panel. */
  embedded?: boolean;
  /** Render red/yellow/green traffic lights on the same row, to the left of the app glyph. */
  trafficLights?: boolean;
  /** 0..1 pulse on the yellow dot (e.g. during a minimize click). */
  minimizePulse?: number;
};

const DEFAULT_MENUS = ["文件", "编辑", "格式", "显示", "窗口", "帮助"];

/**
 * Fixed geometry (not flex-measured) so a caller can compute exactly where a
 * dropdown should appear under a given tab — see `menuTabLeft`.
 */
export const MENU_BAR_METRICS = {
  height: 40,
  padX: 18,
  gap: 16,
  appW: 84,
  tabW: 46,
  /** Extra left inset reserved for traffic lights when `trafficLights` is set. */
  trafficW: 74,
};

/** Left offset (relative to the menu bar's own left edge) of the Nth tab. */
export const menuTabLeft = (index: number, withTraffic = false) => {
  const { padX, gap, appW, tabW, trafficW } = MENU_BAR_METRICS;
  return (withTraffic ? trafficW : 0) + padX + appW + gap + index * (tabW + gap);
};

export const MacMenuBar = ({
  appName,
  menus = DEFAULT_MENUS,
  activeMenu,
  width = 780,
  mode = "light",
  embedded = false,
  trafficLights = false,
  minimizePulse = 0,
}: MacMenuBarProps) => {
  const dark = mode === "dark";
  const { height, padX, gap, appW, tabW, trafficW } = MENU_BAR_METRICS;
  const leftInset = trafficLights ? trafficW : 0;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        background: dark ? "rgba(28, 38, 55, 0.82)" : "rgba(246, 247, 249, 0.86)",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(148,163,184,0.22)",
        borderRadius: embedded ? 0 : "10px 10px 0 0",
        backdropFilter: embedded ? undefined : "blur(20px)",
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {trafficLights ? (
        <div
          style={{
            position: "absolute",
            left: 18,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f57" }} />
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#ffbd2e",
              transform: `scale(${1 - minimizePulse * 0.22})`,
              boxShadow: minimizePulse > 0 ? "0 0 0 3px rgba(255,189,46,0.35)" : "none",
            }}
          />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28c840" }} />
        </div>
      ) : null}
      {/* App name (no literal apple glyph — avoids font-fallback glyph-missing boxes in the renderer) */}
      <span
        style={{
          position: "absolute",
          left: leftInset + padX,
          top: "50%",
          transform: "translateY(-50%)",
          width: appW,
          fontSize: 13,
          fontWeight: 760,
          color: dark ? theme.colors.darkInk : theme.colors.ink,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {appName}
      </span>
      {menus.map((menu, i) => (
        <span
          key={menu}
          style={{
            position: "absolute",
            left: menuTabLeft(i, trafficLights),
            top: 4,
            width: tabW,
            height: height - 8,
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 500,
            color:
              menu === activeMenu
                ? theme.colors.accentBlue
                : dark
                ? theme.colors.darkMuted
                : theme.colors.muted,
            background: menu === activeMenu ? "rgba(47,127,211,0.14)" : "transparent",
          }}
        >
          {menu}
        </span>
      ))}
    </div>
  );
};
