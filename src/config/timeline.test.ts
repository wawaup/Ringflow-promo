import assert from "node:assert/strict";
import test from "node:test";
import { composition, scenes } from "./timeline.ts";

const assertNumber = (value: number | undefined): number => {
  if (typeof value !== "number") {
    throw new TypeError("Expected choreography frame to be a number");
  }
  return value;
};

test("composition duration is derived from the final scene", () => {
  const lastScene = scenes.at(-1);

  assert.ok(lastScene);
  assert.equal(composition.durationInFrames, lastScene.endFrame);
  assert.equal(composition.durationSeconds, lastScene.endSeconds);
});

test("storyline timing gives demonstration scenes enough reading room", () => {
  const coreGesture = scenes.find((scene) => scene.id === "core-gesture");
  const quickInput = scenes.find((scene) => scene.id === "quick-input");
  const presetLibrary = scenes.find((scene) => scene.id === "preset-library");

  assert.ok(coreGesture);
  assert.ok(quickInput);
  assert.ok(presetLibrary);
  assert.ok(coreGesture.durationInFrames >= 180);
  assert.ok(quickInput.durationInFrames >= 132);
  assert.ok(presetLibrary.durationInFrames >= 240);
});

test("each scene has ordered choreography phases", () => {
  for (const scene of scenes) {
    assert.ok(scene.choreography.textStartFrame <= scene.choreography.visualStartFrame, scene.id);
    assert.ok(scene.choreography.visualStartFrame <= scene.choreography.actionStartFrame, scene.id);
    assert.ok(scene.choreography.actionStartFrame <= scene.choreography.holdStartFrame, scene.id);
    assert.ok(scene.choreography.holdStartFrame < scene.durationInFrames, scene.id);
  }
});

test("core gesture teaches mouse before showing the wheel", () => {
  const coreGesture = scenes.find((scene) => scene.id === "core-gesture");

  assert.ok(coreGesture);
  assert.equal(coreGesture.layout, "center-stage");
  const mouseStartFrame = assertNumber(coreGesture.choreography.mouseStartFrame);
  const swipeStartFrame = assertNumber(coreGesture.choreography.swipeStartFrame);
  const wheelStartFrame = assertNumber(coreGesture.choreography.wheelStartFrame);

  assert.ok(mouseStartFrame < wheelStartFrame);
  assert.ok(swipeStartFrame < wheelStartFrame);
  assert.ok(wheelStartFrame < coreGesture.choreography.holdStartFrame);
});

test("intro focus stages the interrupted workflow before text and clipboard actions", () => {
  const intro = scenes.find((scene) => scene.id === "intro-focus");

  assert.ok(intro);
  const pageStartFrame = assertNumber(intro.choreography.pageStartFrame);
  const pageReadyFrame = assertNumber(intro.choreography.pageReadyFrame);
  const destinationInputStartFrame = assertNumber(intro.choreography.destinationInputStartFrame);
  const documentStartFrame = assertNumber(intro.choreography.documentStartFrame);
  const noteStartFrame = assertNumber(intro.choreography.noteStartFrame);
  const stickyOpenFrame = assertNumber(intro.choreography.stickyOpenFrame);
  const noteCopyFrame = assertNumber(intro.choreography.noteCopyFrame);
  const notePasteFrame = assertNumber(intro.choreography.notePasteFrame);
  const promptOpenFrame = assertNumber(intro.choreography.promptOpenFrame);
  const promptCopyFrame = assertNumber(intro.choreography.promptCopyFrame);
  const promptPasteFrame = assertNumber(intro.choreography.promptPasteFrame);

  assert.ok(pageStartFrame < pageReadyFrame);
  assert.ok(pageReadyFrame < intro.choreography.textStartFrame);
  assert.ok(intro.durationInFrames >= 600);
  assert.ok(intro.choreography.textStartFrame < intro.choreography.visualStartFrame);
  assert.ok(intro.choreography.visualStartFrame <= destinationInputStartFrame);
  assert.ok(destinationInputStartFrame < documentStartFrame);
  assert.ok(documentStartFrame < noteStartFrame);
  assert.ok(noteStartFrame < stickyOpenFrame);
  assert.ok(stickyOpenFrame < noteCopyFrame);
  assert.ok(noteCopyFrame < notePasteFrame);
  assert.ok(notePasteFrame < promptOpenFrame);
  assert.ok(promptOpenFrame < promptCopyFrame);
  assert.ok(promptCopyFrame < promptPasteFrame);
  assert.ok(promptPasteFrame < intro.choreography.holdStartFrame);
});
