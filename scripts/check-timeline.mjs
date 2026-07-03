import { composition, scenes } from "../src/config/timeline.ts";

if (scenes.length < 1) {
  throw new Error("Expected at least one scene");
}

for (const scene of scenes) {
  if (scene.durationInFrames <= 0) {
    throw new Error(`Scene ${scene.shot} (${scene.id}) has invalid duration`);
  }
}

for (let i = 0; i < scenes.length - 1; i += 1) {
  if (scenes[i].endFrame !== scenes[i + 1].startFrame) {
    throw new Error(`Gap between ${scenes[i].id} and ${scenes[i + 1].id}`);
  }
}

if (composition.durationSeconds >= 60) {
  throw new Error(`Film too long: ${composition.durationSeconds}s (must stay under 60s)`);
}

console.log(
  `Timeline OK: ${scenes.length} scenes, ${composition.durationSeconds.toFixed(2)}s total (${composition.durationInFrames} frames @ ${composition.fps}fps).`,
);
