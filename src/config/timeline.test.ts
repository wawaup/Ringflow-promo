import assert from "node:assert/strict";
import test from "node:test";
import {
  FEATURE_BEAT_COUNT,
  FEATURE_BEAT_FRAMES,
  SCENE_OVERLAP,
  composition,
  scenes,
} from "./timeline.ts";

test("composition duration is derived from the final scene", () => {
  const lastScene = scenes.at(-1);

  assert.ok(lastScene);
  assert.equal(composition.durationInFrames, lastScene.endFrame);
  assert.equal(composition.durationSeconds, lastScene.endSeconds);
});

test("film stays under 60 seconds", () => {
  assert.ok(composition.durationSeconds < 60, `film is ${composition.durationSeconds}s`);
});

test("scenes chain with no gaps and valid overlaps", () => {
  for (let i = 0; i < scenes.length - 1; i += 1) {
    assert.equal(scenes[i].endFrame, scenes[i + 1].startFrame, scenes[i].id);
    assert.equal(scenes[i].overlapWithNextFrames, SCENE_OVERLAP, scenes[i].id);
  }
  assert.equal(scenes.at(-1)?.overlapWithNextFrames, 0);
});

test("scene ids are unique", () => {
  const ids = scenes.map((scene) => scene.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("each scene has ordered core choreography phases", () => {
  for (const scene of scenes) {
    const c = scene.choreography;
    // Brand moments may land text after the visual, but the physical
    // visual → action → hold order always holds and fits the scene.
    assert.ok(c.visualStartFrame <= c.actionStartFrame, scene.id);
    assert.ok(c.actionStartFrame <= c.holdStartFrame, scene.id);
    assert.ok(c.holdStartFrame < scene.durationInFrames, scene.id);
    assert.ok(c.textStartFrame >= 0 && c.textStartFrame < scene.durationInFrames, scene.id);
  }
});

test("gesture scene word beats are ordered and inside the scene", () => {
  const gesture = scenes.find((scene) => scene.id === "gesture");
  assert.ok(gesture);
  const words = gesture.choreography.wordFrames ?? [];
  assert.equal(words.length, 3);
  for (let i = 1; i < words.length; i += 1) {
    assert.ok(words[i] > words[i - 1]);
  }
  assert.ok(words.at(-1)! < gesture.durationInFrames);
});

test("feature run holds seven uniform beats that fill the scene", () => {
  const featureRun = scenes.find((scene) => scene.id === "feature-run");
  assert.ok(featureRun);
  assert.equal(featureRun.choreography.beatDurationFrames, FEATURE_BEAT_FRAMES);
  assert.equal(featureRun.durationInFrames, FEATURE_BEAT_FRAMES * FEATURE_BEAT_COUNT);
});

test("teaching scenes keep enough reading room", () => {
  const reveal = scenes.find((scene) => scene.id === "reveal");
  const gesture = scenes.find((scene) => scene.id === "gesture");
  assert.ok(reveal && gesture);
  // Thresholds tightened with the film-wide pacing pass (2026-07): scenes keep
  // just enough reading room without dragging between shots.
  assert.ok(reveal.durationInFrames >= 260);
  assert.ok(gesture.durationInFrames >= 390);
});
