import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { scenes } from "../src/config/timeline.ts";

const frameFor = (sceneId, localFrame) => {
  const scene = scenes.find((item) => item.id === sceneId);
  if (!scene) {
    throw new Error(`Unknown scene ${sceneId}`);
  }
  return scene.startFrame + localFrame;
};

const frames = [
  frameFor("intro-focus", 12),
  frameFor("intro-focus", 64),
  frameFor("intro-focus", 230),
  frameFor("intro-focus", 402),
  frameFor("intro-focus", 594),
  frameFor("product-reveal", 116),
  frameFor("core-gesture", 58),
  frameFor("core-gesture", 124),
  frameFor("core-gesture", 152),
  frameFor("core-gesture", 238),
  frameFor("quick-input", 118),
  frameFor("shell-script", 140),
  frameFor("preset-library", 226),
  frameFor("outro", 178),
];
const outDir = path.join(process.cwd(), "out/stills");

fs.mkdirSync(outDir, { recursive: true });

for (const frame of frames) {
  execFileSync(
    "pnpm",
    [
      "exec",
      "remotion",
      "still",
      "src/index.ts",
      "RingflowPromo",
      `out/stills/frame-${frame}.png`,
      "--frame",
      String(frame),
      "--scale",
      "0.5",
    ],
    { stdio: "inherit" },
  );
}
