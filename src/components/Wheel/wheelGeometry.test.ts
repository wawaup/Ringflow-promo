import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  annulusSectorPath,
  labelPosition,
  sectorIndexAtPoint,
  sectorMidAngle,
} from "./wheelGeometry.ts";
import { wheelConfig, wheelDerivedConfig } from "../../config/wheel.ts";

describe("wheelGeometry", () => {
  it("matches Swift sector mid-angle convention with index 0 at top-right", () => {
    assert.equal(Number(sectorMidAngle(0, 8).toFixed(6)), -1.178097);
    assert.equal(Number(sectorMidAngle(2, 8).toFixed(6)), 0.392699);
    assert.equal(Number(sectorMidAngle(7, 8).toFixed(6)), 4.31969);
  });

  it("maps points to the same sector index convention as Swift hit testing", () => {
    const center = { x: 128, y: 128 };
    assert.equal(sectorIndexAtPoint({ x: 128, y: 40 }, center, 8, 128, 0.375), 0);
    assert.equal(sectorIndexAtPoint({ x: 216, y: 128 }, center, 8, 128, 0.375), 2);
    assert.equal(sectorIndexAtPoint({ x: 128, y: 216 }, center, 8, 128, 0.375), 4);
    assert.equal(sectorIndexAtPoint({ x: 40, y: 128 }, center, 8, 128, 0.375), 6);
    assert.equal(sectorIndexAtPoint({ x: 128, y: 128 }, center, 8, 128, 0.375), null);
    assert.equal(sectorIndexAtPoint({ x: 128, y: -1 }, center, 8, 128, 0.375), null);
  });

  it("creates an SVG annulus path with fixed expected endpoints", () => {
    const path = annulusSectorPath(0, 8, { x: 128, y: 128 }, 128, 48);
    assert.equal(
      path,
      "M 128.000 0.000 A 128 128 0 0 1 218.510 37.490 L 161.941 94.059 A 48 48 0 0 0 128.000 80.000 Z",
    );
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
    assert.equal(Number(point.x.toFixed(3)), 161.676);
    assert.equal(Number(point.y.toFixed(3)), 46.699);
  });

  it("exposes Swift-derived folder ring radii without treating thickness as radius", () => {
    assert.equal(wheelDerivedConfig.overlayInnerRadius, 48);
    assert.equal(wheelDerivedConfig.folderRingInnerRadius, 136);
    assert.equal(wheelDerivedConfig.folderRingOuterRadius, 196);
    assert.equal(wheelDerivedConfig.folderRingMidRadius, 166);
  });

  it("rejects invalid geometry inputs before emitting NaN paths", () => {
    assert.throws(() => sectorMidAngle(0, 0), /sectorCount/);
    assert.throws(() => sectorMidAngle(8, 8), /sector index/);
    assert.throws(() => annulusSectorPath(0, 8, { x: 128, y: 128 }, 48, 128), /innerRadius/);
    assert.throws(() => labelPosition(0, 8, { x: 128, y: 128 }, 128, 1), /innerDeadZoneRatio/);
  });
});
