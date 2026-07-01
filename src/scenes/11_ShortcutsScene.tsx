import { Easing, interpolate, useCurrentFrame } from "remotion";
import { FeatureCard } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "shortcuts")!;

export const ShortcutsScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;

  const wheelReveal = interpolate(frame, [c.wheelStartFrame ?? 60, (c.wheelStartFrame ?? 60) + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const highlight = interpolate(frame, [c.wheelHighlightStartFrame ?? 70, c.wheelHighlightEndFrame ?? 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const card1Reveal = interpolate(frame, [c.actionStartFrame, c.actionStartFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const card2Reveal = interpolate(frame, [c.actionStartFrame + 18, c.actionStartFrame + 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <SceneShell lines={sceneCopy.shortcuts.headline} layout={scene.layout} choreography={scene.choreography}>
      <div style={{ display: "grid", gap: 20, justifyItems: "center" }}>
        {/* Wheel first with highlight on shortcuts sector */}
        <RingflowWheel 
          mini 
          activeSegment="shortcuts" 
          centerLabel="快捷指令" 
          revealProgress={wheelReveal} 
          glowProgress={highlight} 
        />
        <div
          style={{
            opacity: card1Reveal,
            transform: `translateY(${(1 - card1Reveal) * 16}px)`,
          }}
        >
          <FeatureCard label="发送到手机" />
        </div>
        <div
          style={{
            opacity: card2Reveal,
            transform: `translateY(${(1 - card2Reveal) * 16}px)`,
          }}
        >
          <FeatureCard label="快捷指令完成" emphasis />
        </div>
      </div>
    </SceneShell>
  );
};
