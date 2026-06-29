import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PromoBackground } from "../components/Background/PromoBackground";
import { PromoText } from "../components/Text/PromoText";
import { theme } from "../config/theme";

type SceneShellProps = {
  lines: string[];
  caption?: string;
  mode?: "light" | "dark";
  align?: "left" | "center";
  children: ReactNode;
};

export const SceneShell = ({
  lines,
  caption,
  mode = "light",
  align = "left",
  children,
}: SceneShellProps) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const lift = interpolate(frame, [0, 28], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill>
      <PromoBackground mode={mode} />
      <AbsoluteFill
        style={{
          padding: `${theme.safeArea.y}px ${theme.safeArea.x}px`,
          boxSizing: "border-box",
          opacity,
          translate: `0 ${lift}px`,
          display: "grid",
          gridTemplateColumns: align === "center" ? "1fr" : "minmax(0, 0.9fr) minmax(620px, 1.1fr)",
          gap: align === "center" ? 54 : 72,
          alignItems: "center",
          justifyItems: align === "center" ? "center" : "stretch",
        }}
      >
        <div
          style={{
            justifySelf: align === "center" ? "center" : "start",
            width: align === "center" ? "100%" : "auto",
          }}
        >
          <PromoText
            lines={lines}
            caption={caption}
            mode={mode}
            align={align}
            maxWidth={align === "center" ? 1320 : 760}
          />
        </div>
        <div
          style={{
            justifySelf: "center",
            maxWidth: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
