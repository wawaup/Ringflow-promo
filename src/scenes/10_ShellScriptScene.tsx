import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MacWindow } from "../components/MacUI/MacWindow";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { sceneCopy } from "../config/copy";
import { SceneShell } from "./SceneShell";

const PROMPT = "$ pnpm run build";
const OUTPUT = "Done in 2.4s";

export const ShellScriptScene = () => {
  const frame = useCurrentFrame();

  const windowReveal = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Typewriter for the command — starts at frame 12
  const cmdChars = Math.floor(
    interpolate(frame, [12, 38], [0, PROMPT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }),
  );

  // Output line appears after command finishes
  const outputReveal = interpolate(frame, [42, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Blinking block cursor
  const showCaret = cmdChars < PROMPT.length && Math.floor(frame / 14) % 2 === 0;

  return (
    <SceneShell lines={sceneCopy["shell-script"].headline} mode="dark">
      <div style={{ display: "grid", gridTemplateColumns: "520px 220px", gap: 34, alignItems: "center" }}>
        <div
          style={{
            opacity: windowReveal,
            transform: `translateY(${(1 - windowReveal) * 18}px)`,
          }}
        >
          <MacWindow title="Terminal" width={520} height={330} mode="dark">
            <div
              style={{
                fontFamily: "Menlo, Monaco, Consolas, monospace",
                fontSize: 26,
                color: "#e8edf7",
                lineHeight: 1.68,
                fontWeight: 640,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span>{PROMPT.slice(0, cmdChars)}</span>
                {showCaret && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 14,
                      height: 28,
                      background: "#7ec8ff",
                      borderRadius: 2,
                      opacity: 0.82,
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </div>
              {outputReveal > 0.05 && (
                <div
                  style={{
                    color: "#8bd69a",
                    opacity: outputReveal,
                    transform: `translateY(${(1 - outputReveal) * 8}px)`,
                  }}
                >
                  {OUTPUT}
                </div>
              )}
            </div>
          </MacWindow>
        </div>
        <RingflowWheel mini mode="dark" runningSegment="shell" centerLabel="Shell" revealFrame={10} />
      </div>
    </SceneShell>
  );
};
