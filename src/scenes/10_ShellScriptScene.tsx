import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "shell-script")!;

const COMMANDS = [
  { cmd: "$ pnpm run build", output: "✓ Compiled in 2.4s", outputColor: "#8bd69a", tag: "构建" },
  { cmd: "$ git push", output: "✓ Pushed to origin", outputColor: "#8bd69a", tag: "Git" },
];

const TerminalLine = ({
  cmd,
  output,
  outputColor,
  tag,
  reveal,
  outputReveal,
}: {
  cmd: string;
  output: string;
  outputColor: string;
  tag: string;
  reveal: number;
  outputReveal: number;
}) => (
  <div
    style={{
      opacity: reveal,
      transform: `translateX(${(1 - reveal) * -12}px)`,
      fontFamily: "Menlo, Monaco, Consolas, monospace",
      fontSize: 20,
      lineHeight: 1.7,
      fontWeight: 540,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 760,
          color: "#7ec8ff",
          background: "rgba(126,200,255,0.12)",
          borderRadius: 5,
          padding: "2px 7px",
          fontFamily: "-apple-system, sans-serif",
          letterSpacing: 0.3,
        }}
      >
        {tag}
      </span>
      <span style={{ color: "#e8edf7" }}>{cmd}</span>
    </div>
    {outputReveal > 0.05 && (
      <div
        style={{
          color: outputColor,
          opacity: outputReveal,
          transform: `translateY(${(1 - outputReveal) * 6}px)`,
          paddingLeft: 4,
          fontSize: 18,
        }}
      >
        {output}
      </div>
    )}
  </div>
);

export const ShellScriptScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const vf = c.visualStartFrame;
  const af = c.actionStartFrame;

  const wheelReveal = interpolate(frame, [c.wheelStartFrame ?? 65, (c.wheelStartFrame ?? 65) + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const highlight = interpolate(frame, [c.wheelHighlightStartFrame ?? 80, c.wheelHighlightEndFrame ?? 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const windowReveal = interpolate(frame, [vf, vf + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Each command staggered by 28 frames from action start
  const reveals = COMMANDS.map((_, i) =>
    interpolate(frame, [af + i * 28, af + i * 28 + 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
  );

  const outputReveals = COMMANDS.map((_, i) =>
    interpolate(frame, [af + i * 28 + 20, af + i * 28 + 34], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
  );

  return (
    <SceneShell lines={sceneCopy["shell-script"].headline} mode="dark" layout={scene.layout} choreography={scene.choreography}>
      <div style={{ display: "grid", gridTemplateColumns: "580px 200px", gap: 32, alignItems: "center" }}>
        <div style={{ opacity: windowReveal, transform: `translateY(${(1 - windowReveal) * 18}px)` }}>
          <MacWindow title="Terminal" width={580} height={320} mode="dark">
            <div style={{ display: "grid", gap: 18 }}>
              {COMMANDS.map((c, i) => (
                <TerminalLine
                  key={c.cmd}
                  {...c}
                  reveal={reveals[i]}
                  outputReveal={outputReveals[i]}
                />
              ))}
            </div>
          </MacWindow>
        </div>
        {/* Wheel first, highlight leads shell result */}
        <RingflowWheel 
          mini 
          mode="dark" 
          runningSegment="shell" 
          centerLabel="Shell" 
          revealProgress={wheelReveal} 
          glowProgress={highlight} 
        />
      </div>
    </SceneShell>
  );
};
