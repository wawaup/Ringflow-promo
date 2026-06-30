import { Easing, interpolate, useCurrentFrame } from "remotion";
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
  /** Frames between each line's reveal (default: 6) */
  lineStagger?: number;
  /** Reduce headline scale for top stage scenes (default: 1) */
  scale?: number;
};

export const PromoText = ({
  lines,
  caption,
  mode = "light",
  align = "left",
  size = theme.type.headline,
  captionSize = theme.type.caption,
  maxWidth = 1120,
  startFrame = 0,
  lineStagger = 6,
  scale = 1,
}: PromoTextProps) => {
  const frame = useCurrentFrame();
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
      {lines.map((line, index) => {
        const lineStart = startFrame + index * lineStagger;
        const lineEnd = lineStart + 22;

        const opacity = interpolate(frame, [lineStart, lineEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        const lift = interpolate(frame, [lineStart, lineEnd + 4], [28, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        // clip-path mask reveal: top of line opens downward
        const clipY = interpolate(frame, [lineStart, lineEnd], [100, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        return (
          <div
            key={`${line}-${index}`}
            style={{
              overflow: "hidden",
              paddingBottom: "0.06em", // prevent descender clipping
            }}
          >
            <div
              style={{
                fontSize: size * scale,
                lineHeight: 1.08,
                fontWeight: 820,
                letterSpacing: 0,
                overflowWrap: "anywhere",
                opacity,
                transform: `translateY(${lift}px)`,
                clipPath: `inset(0 0 ${clipY}% 0)`,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
      {caption ? (
        <div
          style={{
            marginTop: 28,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: captionSize,
              lineHeight: 1.2,
              fontWeight: 620,
              letterSpacing: 0,
              color: dark ? theme.colors.darkMuted : theme.colors.muted,
              overflowWrap: "anywhere",
              opacity: interpolate(
                frame,
                [startFrame + lines.length * lineStagger, startFrame + lines.length * lineStagger + 18],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
              transform: `translateY(${interpolate(
                frame,
                [startFrame + lines.length * lineStagger, startFrame + lines.length * lineStagger + 22],
                [16, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              )}px)`,
            }}
          >
            {caption}
          </div>
        </div>
      ) : null}
    </div>
  );
};
