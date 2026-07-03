import { theme } from "../../config/theme";

type MacMenuBarProps = {
  appName: string;
  menus?: string[];
  activeMenu?: string;
  width?: number;
  mode?: "light" | "dark";
};

const DEFAULT_MENUS = ["文件", "编辑", "格式", "显示", "窗口", "帮助"];

export const MacMenuBar = ({
  appName,
  menus = DEFAULT_MENUS,
  activeMenu,
  width = 780,
  mode = "light",
}: MacMenuBarProps) => {
  const dark = mode === "dark";
  return (
    <div
      style={{
        width,
        height: 28,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 14px",
        background: dark ? "rgba(28, 38, 55, 0.82)" : "rgba(246, 247, 249, 0.86)",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(148,163,184,0.22)",
        backdropFilter: "blur(20px)",
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Apple glyph */}
      <span style={{ fontSize: 15, color: dark ? theme.colors.darkInk : theme.colors.ink, lineHeight: 1 }}>

      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 760,
          color: dark ? theme.colors.darkInk : theme.colors.ink,
        }}
      >
        {appName}
      </span>
      {menus.map((menu) => (
        <span
          key={menu}
          style={{
            fontSize: 13,
            fontWeight: 500,
            color:
              menu === activeMenu
                ? theme.colors.accentBlue
                : dark
                ? theme.colors.darkMuted
                : theme.colors.muted,
            background: menu === activeMenu ? "rgba(47,127,211,0.14)" : "transparent",
            padding: "3px 7px",
            borderRadius: 5,
          }}
        >
          {menu}
        </span>
      ))}
    </div>
  );
};
