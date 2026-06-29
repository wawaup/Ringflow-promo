import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  annulusSectorPath,
  labelPosition,
  sectorIndexAtPoint,
  sectorMidAngle,
} from "./wheelGeometry.ts";
import { wheelConfig } from "../../config/wheel.ts";

describe("wheelGeometry", () => {
  it("matches Swift sector mid-angle convention with index 0 at top-right", () => {
    const sectorAngle = (2 * Math.PI) / 8;
    assert.equal(Number(sectorMidAngle(0, 8).toFixed(6)), Number((-Math.PI / 2 + sectorAngle * 0.5).toFixed(6)));
    assert.equal(Number(sectorMidAngle(2, 8).toFixed(6)), Number((-Math.PI / 2 + sectorAngle * 2.5).toFixed(6)));
  });

  it("maps points to the same sector index convention as Swift hit testing", () => {
    const center = { x: 128, y: 128 };
    assert.equal(sectorIndexAtPoint({ x: 128, y: 40 }, center, 8, 128, 0.375), 0);
    assert.equal(sectorIndexAtPoint({ x: 216, y: 128 }, center, 8, 128, 0.375), 2);
    assert.equal(sectorIndexAtPoint({ x: 128, y: 128 }, center, 8, 128, 0.375), null);
  });

  it("creates an SVG annulus path with two arcs and a close path", () => {
    const path = annulusSectorPath(0, 8, { x: 128, y: 128 }, 128, 48);
    assert.match(path, /A 128 128/);
    assert.match(path, /A 48 48/);
    assert.equal(path.endsWith("Z"), true);
  });

  it("places labels on the annulus mid-radius", () => {
    const point = labelPosition(
      0,
      8,
      { x: 128, y: 128 },
      wheelConfig.overlayOuterRadius,
      wheelConfig.overlayInnerDeadZoneRatio,
    );
    const dx = point.x - 128;
    const dy = point.y - 128;
    const distance = Math.hypot(dx, dy);
    assert.equal(Math.round(distance), 88);
  });
});
