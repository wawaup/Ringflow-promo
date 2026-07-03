import { interpolate, useCurrentFrame } from "remotion";
import { EASE, ease01 } from "../../config/motion";
import { theme } from "../../config/theme";

type PromoTextProps = {
  lines: string[];
  caption?: string;
  mode?: "light" | "dark";
  align?: "left" | "center";
  size?: number;
  captionSize?: number;
  maxWidth?: number;
  /** Frame offset for when text animation begins (default: 0) */
  startFrame?: number;
  /** Frames between each line's reveal (default: 8) */
  lineStagger?: number;
  /** Brand gradient headline (reveal / outro moments only). */
  gradient?: boolean;
  /** Delay of the caption relative to the last line (default 14). */
  captionDelay?: number;
};

export const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro SC", "PingFang SC", sans-serif';

export const PromoText = ({
  lines,
  caption,
  mode = "light",
  align = "left",
  size = theme.type.headline,
  captionSize = theme.type.caption,
  maxWidth = 1200,
  startFrame = 0,
  lineStagger = 8,
  gradient = false,
  captionDelay = 14,
}: PromoTextProps) => {
  const frame = useCurrentFrame();
  const dark = mode === "dark";

  const gradientStyle = gradient
    ? {
        backgroundImage: dark ? theme.gradients.headlineDark : theme.gradients.headlineLight,
        backgroundClip: "text" as const,
        WebkitBackgroundClip: "text" as const,
        color: "transparent",
      }
    : { color: dark ? theme.colors.darkInk : theme.colors.ink };

  const captionStart = startFrame + (lines.length - 1) * lineStagger + captionDelay;

  return (
    <div
      style={{
        maxWidth,
        textAlign: align,
        fontFamily: FONT_STACK,
      }}
    >
      {lines.map((line, index) => {
        const lineStart = startFrame + index * lineStagger;
        const t = ease01(frame, lineStart, 26);
        const lift = interpolate(t, [0, 1], [30, 0]);
        const clipY = interpolate(t, [0, 1], [100, 0]);

        return (
          <div
            key={`${line}-${index}`}
            style={{
              overflow: "hidden",
              paddingBottom: "0.08em", // prevent descender clipping
              marginBottom: "-0.08em",
            }}
          >
            <div
              style={{
                fontSize: size,
                lineHeight: 1.1,
                fontWeight: 760,
                letterSpacing: "-0.01em",
                overflowWrap: "anywhere",
                opacity: t,
                transform: `translateY(${lift}px)`,
                clipPath: `inset(0 0 ${clipY}% 0)`,
                ...gradientStyle,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
      {caption ? (
        <div style={{ marginTop: Math.round(size * 0.34), overflow: "hidden" }}>
          <div
            style={{
              fontSize: captionSize,
              lineHeight: 1.25,
              fontWeight: 560,
              letterSpacing: "-0.005em",
              color: dark ? theme.colors.darkMuted : theme.colors.muted,
              overflowWrap: "anywhere",
              opacity: ease01(frame, captionStart, 24),
              transform: `translateY(${interpolate(ease01(frame, captionStart, 28), [0, 1], [18, 0])}px)`,
            }}
          >
            {caption}
          </div>
        </div>
      ) : null}
    </div>
  );
};

/** Re-export the shared ease for callers composing custom text beats. */
export { EASE };
