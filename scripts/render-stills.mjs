import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const frames = [60, 450, 570, 660, 900, 1150, 1620, 1900, 2100];
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
