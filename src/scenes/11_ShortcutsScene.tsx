import { Easing, interpolate, useCurrentFrame } from "remotion";
import { FeatureCard } from "../components/MacUI/FeatureCards";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

export const ShortcutsScene = () => {
  const frame = useCurrentFrame();

  const card1Reveal = interpolate(frame, [8, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const card2Reveal = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <SceneShell lines={sceneCopy.shortcuts.headline}>
      <div style={{ display: "grid", gap: 20, justifyItems: "center" }}>
        <RingflowWheel mini activeSegment="shortcuts" centerLabel="快捷指令" revealFrame={4} />
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
