export type Point = {
  x: number;
  y: number;
};

const polarPoint = (center: Point, radius: number, angle: number): Point => ({
  x: center.x + Math.cos(angle) * radius,
  y: center.y + Math.sin(angle) * radius,
});

const assertPositiveSectorCount = (sectorCount: number): void => {
  if (!Number.isInteger(sectorCount) || sectorCount <= 0) {
    throw new RangeError(`sectorCount must be a positive integer, received ${sectorCount}`);
  }
};

const assertValidSectorIndex = (index: number, sectorCount: number): void => {
  if (!Number.isInteger(index) || index < 0 || index >= sectorCount) {
    throw new RangeError(`sector index must be between 0 and ${sectorCount - 1}, received ${index}`);
  }
};

const assertValidRadius = (radius: number, name: string): void => {
  if (!Number.isFinite(radius) || radius <= 0) {
    throw new RangeError(`${name} must be a positive finite number, received ${radius}`);
  }
};

export const sectorMidAngle = (index: number, sectorCount: number): number => {
  assertPositiveSectorCount(sectorCount);
  assertValidSectorIndex(index, sectorCount);
  const sectorAngle = (2 * Math.PI) / sectorCount;
  return -Math.PI / 2 + sectorAngle * (index + 0.5);
};

export const annulusMidRadius = (outerRadius: number, innerDeadZoneRatio: number): number => {
  assertValidRadius(outerRadius, "outerRadius");
  if (!Number.isFinite(innerDeadZoneRatio) || innerDeadZoneRatio < 0 || innerDeadZoneRatio >= 1) {
    throw new RangeError(`innerDeadZoneRatio must be in [0, 1), received ${innerDeadZoneRatio}`);
  }
  return (outerRadius * (1 + innerDeadZoneRatio)) / 2;
};

export const labelPosition = (
  index: number,
  sectorCount: number,
  center: Point,
  outerRadius: number,
  innerDeadZoneRatio: number,
): Point => {
  assertPositiveSectorCount(sectorCount);
  assertValidSectorIndex(index, sectorCount);
  const angle = sectorMidAngle(index, sectorCount);
  return polarPoint(center, annulusMidRadius(outerRadius, innerDeadZoneRatio), angle);
};

export const annulusSectorPath = (
  index: number,
  sectorCount: number,
  center: Point,
  outerRadius: number,
  innerRadius: number,
): string => {
  assertPositiveSectorCount(sectorCount);
  assertValidSectorIndex(index, sectorCount);
  assertValidRadius(outerRadius, "outerRadius");
  assertValidRadius(innerRadius, "innerRadius");
  if (innerRadius >= outerRadius) {
    throw new RangeError(`innerRadius must be smaller than outerRadius, received ${innerRadius} >= ${outerRadius}`);
  }

  const sectorAngle = (2 * Math.PI) / sectorCount;
  const start = -Math.PI / 2 + sectorAngle * index;
  const end = start + sectorAngle;
  const largeArcFlag = sectorAngle > Math.PI ? 1 : 0;
  const outerStart = polarPoint(center, outerRadius, start);
  const outerEnd = polarPoint(center, outerRadius, end);
  const innerEnd = polarPoint(center, innerRadius, end);
  const innerStart = polarPoint(center, innerRadius, start);

  return [
    `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
    `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    "Z",
  ].join(" ");
};

export const sectorIndexAtPoint = (
  point: Point,
  center: Point,
  sectorCount: number,
  outerRadius: number,
  innerDeadZoneRatio: number,
): number | null => {
  assertPositiveSectorCount(sectorCount);
  assertValidRadius(outerRadius, "outerRadius");
  if (!Number.isFinite(innerDeadZoneRatio) || innerDeadZoneRatio < 0 || innerDeadZoneRatio >= 1) {
    throw new RangeError(`innerDeadZoneRatio must be in [0, 1), received ${innerDeadZoneRatio}`);
  }

  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const distance = Math.hypot(dx, dy);
  const innerRadius = outerRadius * innerDeadZoneRatio;

  if (distance < innerRadius || distance > outerRadius) {
    return null;
  }

  let angle = Math.atan2(dy, dx) + Math.PI / 2;
  if (angle < 0) {
    angle += 2 * Math.PI;
  }

  const sectorAngle = (2 * Math.PI) / sectorCount;
  return Math.min(Math.max(Math.floor(angle / sectorAngle), 0), sectorCount - 1);
};
