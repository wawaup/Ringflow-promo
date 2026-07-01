import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAIN_SLOTS,
  FOLDER_SLOTS,
  wheelSegmentToSiteIndex,
  wheelSegmentToFolderIndex,
} from "./siteWheelModel.ts";

describe("siteWheelModel", () => {
  it("uses the official website wheel slot labels and ordering", () => {
    assert.deepEqual(
      MAIN_SLOTS.map((slot) => slot.label),
      ["常用提示词", "复制", "粘贴", "撤销", "全选", "新脚本", "监视器", "新便签"],
    );
  });

  it("uses sparse official folder prompt slots", () => {
    assert.deepEqual(
      FOLDER_SLOTS.map((slot) => slot?.label ?? null),
      ["总结提炼", "润色改写", "分步说明", null, null, "对比分析", "补充完善", null],
    );
  });

  it("maps legacy promo segment ids onto the closest real website sectors", () => {
    assert.equal(wheelSegmentToSiteIndex("profiles"), 0);
    assert.equal(wheelSegmentToSiteIndex("quick-input"), 0);
    assert.equal(wheelSegmentToSiteIndex("macro"), 5);
    assert.equal(wheelSegmentToSiteIndex("monitor"), 6);
    assert.equal(wheelSegmentToSiteIndex("sticky-note"), 7);
  });

  it("maps prompt-like legacy ids to official folder sectors when the folder ring is visible", () => {
    assert.equal(wheelSegmentToFolderIndex("quick-input"), 1);
    assert.equal(wheelSegmentToFolderIndex("quick-open"), 2);
    assert.equal(wheelSegmentToFolderIndex("shortcuts"), 5);
    assert.equal(wheelSegmentToFolderIndex("shell"), null);
  });
});
