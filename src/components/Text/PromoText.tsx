import { theme } from "../../config/theme";

type PromoTextProps = {
  lines: string[];
  caption?: string;
  mode?: "light" | "dark";
  align?: "left" | "center";
  size?: number;
  captionSize?: number;
  maxWidth?: number;
};

export const PromoText = ({
  lines,
  caption,
  mode = "light",
  align = "left",
  size = theme.type.headline,
  captionSize = theme.type.caption,
  maxWidth = 1120,
}: PromoTextProps) => {
  const dark = mode === "dark";
  return (
    <div
      style={{
        maxWidth,
        textAlign: align,
        color: dark ? theme.colors.darkInk : theme.colors.ink,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif',
      }}
    >
      {lines.map((line, index) => (
        <div
          key={`${line}-${index}`}
          style={{
            fontSize: size,
            lineHeight: 1.08,
            fontWeight: 820,
            letterSpacing: 0,
            overflowWrap: "anywhere",
          }}
        >
          {line}
        </div>
      ))}
      {caption ? (
        <div
          style={{
            marginTop: 28,
            fontSize: captionSize,
            lineHeight: 1.2,
            fontWeight: 620,
            letterSpacing: 0,
            color: dark ? theme.colors.darkMuted : theme.colors.muted,
            overflowWrap: "anywhere",
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};
