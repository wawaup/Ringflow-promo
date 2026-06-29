import fs from "node:fs";
import path from "node:path";

const timelinePath = path.join(process.cwd(), "src/config/timeline.ts");
const source = fs.readFileSync(timelinePath, "utf8");

const sceneRows = [...source.matchAll(/\[(\d+), "([^"]+)", "([^"]+)", ([0-9.]+), ([0-9.]+)\]/g)].map(
  (match) => ({
    shot: Number(match[1]),
    id: match[2],
    name: match[3],
    start: Number(match[4]),
    end: Number(match[5]),
  }),
);

if (sceneRows.length !== 15) {
  throw new Error(`Expected 15 scenes, found ${sceneRows.length}`);
}

if (sceneRows[0].start !== 0 || sceneRows.at(-1).end !== 36) {
  throw new Error("Timeline must start at 0s and end at 36s");
}

for (const scene of sceneRows) {
  if (scene.end <= scene.start) {
    throw new Error(`Scene ${scene.shot} has invalid duration`);
  }
}

const overlaps = [];
for (let i = 0; i < sceneRows.length - 1; i += 1) {
  const current = sceneRows[i];
  const next = sceneRows[i + 1];
  if (current.end > next.start) {
    overlaps.push(`${current.shot}->${next.shot}: ${(current.end - next.start).toFixed(2)}s`);
  }
}

console.log(`Timeline OK: ${sceneRows.length} scenes, 36s total.`);
console.log(`Intentional overlaps: ${overlaps.join(", ")}`);
