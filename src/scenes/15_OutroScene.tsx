import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AppLogoMark } from "../components/Brand/AppLogoMark";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "outro")!;

export const OutroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoReveal = spring({
    frame: Math.max(0, frame - scene.choreography.visualStartFrame),
    fps,
    config: { damping: 18, stiffness: 160, mass: 1.1 },
    durationInFrames: 34,
  });

  const ctaReveal = interpolate(
    frame,
    [scene.choreography.visualStartFrame + 30, scene.choreography.visualStartFrame + 48],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 0.6), [-1, 1], [0.94, 1.06]);

  return (
    <SceneShell lines={sceneCopy.outro.headline} layout={scene.layout} choreography={scene.choreography}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div
          style={{
            opacity: logoReveal,
            transform: `scale(${(0.72 + logoReveal * 0.28) * pulse})`,
            filter: `drop-shadow(0 12px 40px rgba(47,127,211,${0.18 + logoReveal * 0.14}))`,
          }}
        >
          <AppLogoMark size={178} />
        </div>

        {/* CTA download badge */}
        <div
          style={{
            opacity: ctaReveal,
            transform: `translateY(${(1 - ctaReveal) * 12}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* macOS App Store style badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(148,163,184,0.22)",
              borderRadius: 18,
              padding: "12px 24px",
              boxShadow: "0 8px 28px rgba(30,45,70,0.10), 0 1px 4px rgba(30,45,70,0.06)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Apple logo mark */}
            <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
              <path
                d="M18.5 13.8c0-3.4 2.8-5 2.9-5.1-1.6-2.3-4-2.6-4.9-2.6-2.1-.2-4 1.2-5.1 1.2-1 0-2.7-1.2-4.4-1.1-2.3 0-4.4 1.3-5.5 3.4-2.4 4.1-.6 10.1 1.7 13.4 1.1 1.6 2.5 3.4 4.2 3.4 1.7-.1 2.3-1.1 4.3-1.1 2 0 2.6 1.1 4.4 1 1.8 0 3-1.6 4.1-3.2.8-1.1 1.5-2.3 2-3.6-4.6-1.8-4.7-5.8-4.7-5.8z"
                fill="#1d1d1f"
              />
              <path
                d="M15.5 4.2c.9-1.1 1.5-2.6 1.4-4.2-1.3.1-3 .9-3.9 2-.9 1-1.6 2.5-1.4 4 1.5.1 3-.8 3.9-1.8z"
                fill="#1d1d1f"
              />
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: 0.3 }}>
                免费下载
              </span>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 780,
                  color: "#1e293b",
                  fontFamily: '-apple-system, "SF Pro Display", sans-serif',
                  letterSpacing: -0.2,
                }}
              >
                ringflow.emio.cn
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#94a3b8",
              fontWeight: 560,
              letterSpacing: 0.2,
            }}
          >
            macOS 14 或更高版本
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
