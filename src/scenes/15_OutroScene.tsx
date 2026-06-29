import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AppLogoMark } from "../components/Brand/AppLogoMark";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const OutroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoReveal = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 18, stiffness: 160, mass: 1.1 },
    durationInFrames: 34,
  });

  // Slow ambient pulse — logo breathes
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 0.6), [-1, 1], [0.94, 1.06]);

  return (
    <SceneShell lines={sceneCopy.outro.headline} align="center" childrenDelay={12}>
      <div
        style={{
          opacity: logoReveal,
          transform: `scale(${(0.72 + logoReveal * 0.28) * pulse})`,
          filter: `drop-shadow(0 12px 40px rgba(47,127,211,${0.18 + logoReveal * 0.14}))`,
        }}
      >
        <AppLogoMark size={178} />
      </div>
    </SceneShell>
  );
};
