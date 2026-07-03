import { interpolate, useCurrentFrame } from "remotion";
import { Cursor } from "../components/Cursor/Cursor";
import { ease01 } from "../config/motion";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "turn")!;

/**
 * Shot 2 — 转折。
 * The clutter is gone; one quiet line and a lone cursor.
 * 「常用的操作，应该就在手边。」
 */
export const TurnScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;

  const cursorIn = ease01(frame, c.visualStartFrame, 26);
  // Tiny idle drift so the held frame stays alive.
  const drift = ease01(frame, c.actionStartFrame, 60);
  const x = interpolate(drift, [0, 1], [-26, 10]);
  const y = interpolate(drift, [0, 1], [10, -6]);

  return (
    <SceneShell scene={scene} stageHeight={220}>
      <div style={{ position: "relative", width: 240, height: 160, opacity: cursorIn }}>
        <Cursor x={110 + x} y={60 + y} scale={1.5} />
      </div>
    </SceneShell>
  );
};
