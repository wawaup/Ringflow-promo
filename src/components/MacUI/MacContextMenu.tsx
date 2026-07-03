import type { ReactNode } from "react";
import { theme } from "../../config/theme";

export type MacContextMenuItem = {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  hasSubmenu?: boolean;
  selected?: boolean;
  separatorBefore?: boolean;
};

type MacContextMenuProps = {
  items: MacContextMenuItem[];
  width?: number;
  mode?: "light" | "dark";
};

export const MacContextMenu = ({ items, width = 220, mode = "light" }: MacContextMenuProps) => {
  const dark = mode === "dark";
  return (
    <div
      style={{
        width,
        borderRadius: 12,
        padding: "5px",
        background: dark ? "rgba(38, 46, 62, 0.88)" : "rgba(250, 250, 252, 0.92)",
        border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(255,255,255,0.80)",
        boxShadow: "0 16px 42px rgba(20, 30, 50, 0.22), 0 2px 10px rgba(20,30,50,0.10)",
        backdropFilter: "blur(24px)",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {items.map((item) => (
        <div key={item.label}>
          {item.separatorBefore && (
            <div
              style={{
                height: 1,
                margin: "4px 8px",
                background: dark ? "rgba(255,255,255,0.10)" : "rgba(148,163,184,0.24)",
              }}
            />
          )}
          <div
            style={{
              height: 28,
              borderRadius: 6,
              padding: "0 8px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: item.selected ? theme.colors.accentBlue : "transparent",
            }}
          >
            <span style={{ width: 16, flex: "0 0 auto", fontSize: 13, textAlign: "center" }}>{item.icon}</span>
            <span
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 500,
                color: item.selected ? "#ffffff" : dark ? theme.colors.darkInk : theme.colors.ink,
              }}
            >
              {item.label}
            </span>
            {item.shortcut && (
              <span
                style={{
                  fontSize: 12,
                  color: item.selected
                    ? "rgba(255,255,255,0.85)"
                    : dark
                    ? theme.colors.darkMuted
                    : theme.colors.muted,
                }}
              >
                {item.shortcut}
              </span>
            )}
            {item.hasSubmenu && (
              <span
                style={{
                  fontSize: 12,
                  color: item.selected ? "#ffffff" : dark ? theme.colors.darkMuted : theme.colors.muted,
                }}
              >
                ›
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
