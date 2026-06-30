import fs from "node:fs";
import path from "node:path";

const timelinePath = path.join(process.cwd(), "src/config/timeline.ts");
const source = fs.readFileSync(timelinePath, "utf8");

const sceneRows = [...source.matchAll(/shot: (\d+),\s+id: "([^"]+)",\s+name: "([^"]+)",\s+durationSeconds: ([0-9.]+)/g)].map(
  (match) => ({
    shot: Number(match[1]),
    id: match[2],
    name: match[3],
    duration: Number(match[4]),
  }),
);

if (sceneRows.length !== 15) {
  throw new Error(`Expected 15 scenes, found ${sceneRows.length}`);
}

for (const scene of sceneRows) {
  if (scene.duration <= 0) {
    throw new Error(`Scene ${scene.shot} has invalid duration`);
  }
}

let totalSeconds = 0;
for (const scene of sceneRows) {
  totalSeconds += scene.duration;
}

console.log(`Timeline OK: ${sceneRows.length} scenes, ${totalSeconds.toFixed(2)}s total.`);
