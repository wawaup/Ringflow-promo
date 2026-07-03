import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAIN_SLOTS,
  FOLDER_SLOTS,
  PROFILE_WHEELS,
  SHOWCASE_SLOTS,
  SITE_WHEEL_ICON_PATHS,
  wheelSegmentToSiteIndex,
  wheelSegmentToFolderIndex,
} from "./siteWheelModel.ts";

describe("siteWheelModel", () => {
  it("matches the real mac app default wheel (ActionItem.defaultLibrary)", () => {
    assert.deepEqual(
      MAIN_SLOTS.map((slot) => slot.label),
      ["复制", "粘贴", "撤销", "保存", "全选", "新脚本", "监视器", "新便签"],
    );
  });

  it("uses sparse official folder prompt slots", () => {
    assert.deepEqual(
      FOLDER_SLOTS.map((slot) => slot?.label ?? null),
      ["总结提炼", "润色改写", "分步说明", null, null, "对比分析", "补充完善", null],
    );
  });

  it("maps legacy promo segment ids onto the closest real website sectors", () => {
    assert.equal(wheelSegmentToSiteIndex("quick-input"), 1);
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

  it("showcase wheel covers the seven action types plus the group folder", () => {
    assert.equal(SHOWCASE_SLOTS.length, 8);
    assert.deepEqual(
      SHOWCASE_SLOTS.map((slot) => slot.label),
      ["快捷键", "快捷输入", "快捷打开", "便签", "脚本", "指令", "监视器", "提示词"],
    );
    assert.equal(SHOWCASE_SLOTS[7].isFolder, true);
  });

  it("profile wheels always carry a full eight sectors and known icons", () => {
    assert.equal(PROFILE_WHEELS.length, 3);
    for (const profile of PROFILE_WHEELS) {
      assert.equal(profile.slots.length, 8, profile.app);
      for (const slot of profile.slots) {
        assert.ok(slot.icon in SITE_WHEEL_ICON_PATHS, `${profile.app}/${slot.label}`);
      }
    }
  });
});
