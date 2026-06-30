import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor } from "../components/Cursor/Cursor";
import { sceneCopy } from "../config/copy";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "nearer-concept")!;

export const NearerConceptScene = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Cursor glides from lower-left toward center of canvas
  const t = interpolate(frame, [scene.choreography.actionStartFrame, scene.choreography.actionStartFrame + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const cx = width / 2;
  const cy = height / 2;

  const cursorX = interpolate(t, [0, 1], [cx - 220, cx + 60]);
  const cursorY = interpolate(t, [0, 1], [cy + 180, cy - 30]);

  // Trail behind cursor
  const trailAlpha = interpolate(frame, [scene.choreography.actionStartFrame, scene.choreography.actionStartFrame + 16, scene.choreography.actionStartFrame + 42, scene.choreography.holdStartFrame], [0, 0.5, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trail =
    t > 0
      ? [
          { x: cursorX - 30, y: cursorY + 26, opacity: trailAlpha * 0.45 },
          { x: cursorX - 60, y: cursorY + 52, opacity: trailAlpha * 0.22 },
        ]
      : [];

  return (
    <SceneShell lines={sceneCopy["nearer-concept"].headline} layout={scene.layout} choreography={scene.choreography}>
      <Cursor x={cursorX} y={cursorY} scale={1.1} trail={trail} />
    </SceneShell>
  );
};
