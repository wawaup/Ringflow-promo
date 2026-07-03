import { useId } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme as promoTheme } from "../../config/theme";
import { wheelConfig, wheelDerivedConfig, type WheelSegmentId } from "../../config/wheel";
import { annulusSectorPath, sectorMidAngle, type Point } from "./wheelGeometry";
import {
  FOLDER_SLOTS,
  MAIN_SLOTS,
  SITE_WHEEL_ICON_PATHS,
  wheelSegmentToFolderIndex,
  wheelSegmentToSiteIndex,
  type SiteWheelSlot,
} from "./siteWheelModel";

type RingflowWheelProps = {
  mode?: "light" | "dark";
  theme?: "light" | "dark";
  themeMode?: "light" | "dark";
  activeSegment?: WheelSegmentId;
  runningSegment?: WheelSegmentId;
  centerLabel?: string;
  appLabel?: string;
  mini?: boolean;
  revealProgress?: number;
  revealFrame?: number;
  releaseProgress?: number;
  segmentStaggerFrames?: number;
  pulseFrame?: number;
  showSegmentStagger?: boolean;
  showOuterRing?: boolean;
  showCursorReveal?: boolean;
  showGlowPulse?: boolean;
  showDragTrail?: boolean;
  showSegmentLabels?: boolean;
  glowProgress?: number;
  highlightIndex?: number | null;
  folderHighlightIndex?: number | null;
  folderProgress?: number;
  folderRotation?: number;
  /** Override the 8 main sectors (defaults to the app's real default wheel). */
  mainSlots?: readonly SiteWheelSlot[];
  /** Override the outer folder ring sectors. */
  folderSlots?: readonly (SiteWheelSlot | null)[];
};

const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

const folderRadii = () => ({
  inner: wheelDerivedConfig.folderRingInnerRadius,
  outer: wheelDerivedConfig.folderRingOuterRadius,
});

const centerGlassDiameter = (outerRadius: number): number =>
  outerRadius * wheelConfig.overlayInnerDeadZoneRatio * 2 * wheelConfig.overlayCenterGlassRatio;

const fanCollapseRotation = (index: number, count: number): number => {
  const mid = sectorMidAngle(index, count);
  return -Math.PI / 2 - mid;
};

const ringPath = (center: Point, innerRadius: number, outerRadius: number): string =>
  [
    `M ${center.x + outerRadius} ${center.y}`,
    `A ${outerRadius} ${outerRadius} 0 1 1 ${center.x - outerRadius} ${center.y}`,
    `A ${outerRadius} ${outerRadius} 0 1 1 ${center.x + outerRadius} ${center.y}`,
    `M ${center.x + innerRadius} ${center.y}`,
    `A ${innerRadius} ${innerRadius} 0 1 0 ${center.x - innerRadius} ${center.y}`,
    `A ${innerRadius} ${innerRadius} 0 1 0 ${center.x + innerRadius} ${center.y}`,
  ].join(" ");

const polarPoint = (center: Point, radius: number, angle: number): Point => ({
  x: center.x + Math.cos(angle) * radius,
  y: center.y + Math.sin(angle) * radius,
});

const siteLabelPosition = (
  index: number,
  count: number,
  center: Point,
  outerRadius: number,
  innerRatio: number,
  ringInnerRadius?: number,
): Point => {
  const radius = ringInnerRadius ? (outerRadius + ringInnerRadius) / 2 : (outerRadius * (1 + innerRatio)) / 2;
  return polarPoint(center, radius, sectorMidAngle(index, count));
};

const splitCenterLabel = (label: string): { presetName: string; appName: string } => {
  const trimmed = label.trim();
  if (!trimmed) return { presetName: "默认", appName: "全局" };
  if (trimmed === "Ringflow") return { presetName: "默认", appName: "全局" };
  if (trimmed === "App") return { presetName: "应用", appName: "专属" };
  if (trimmed.length <= 6) return { presetName: trimmed, appName: "Ringflow" };
  return { presetName: trimmed.slice(0, 4), appName: trimmed.slice(4, 10) || "Ringflow" };
};

type SitePalette = {
  primaryText: string;
  secondaryText: string;
  accent: string;
  selectedFill: string;
  runningFill: string;
  hoverFill: string;
  divider: string;
  ringOutline: string;
  glassRingFill: string;
  glassRingStroke: string;
  folderGlassOpacity: number;
  centerBase: string;
  centerStroke: string;
  centerShadow: string;
  textMuted: string;
  trail: string;
  cursorFill: string;
  cursorStroke: string;
};

const paletteForMode = (dark: boolean): SitePalette =>
  dark
    ? {
        // Matched to real Ringflow mac app dark live overlay summoned style (WheelStyle.swift)
        primaryText: "rgb(230, 238, 248)",
        secondaryText: "rgba(163, 172, 189, 0.78)",
        accent: "rgb(115, 173, 242)",
        selectedFill: "rgba(71, 122, 194, 0.34)",
        runningFill: "rgba(245, 158, 11, 0.34)",
        hoverFill: "rgba(61, 66, 77, 0.24)",
        divider: "rgba(255, 255, 255, 0.12)",
        ringOutline: "rgba(255, 255, 255, 0.16)",
        glassRingFill: "rgba(26, 30, 38, 0.58)",
        glassRingStroke: "rgba(255, 255, 255, 0.10)",
        folderGlassOpacity: 0.82,
        centerBase: "rgba(26, 30, 38, 0.72)",
        centerStroke: "rgba(255, 255, 255, 0.14)",
        centerShadow: "rgba(2, 6, 23, 0.28)",
        textMuted: "rgba(163, 172, 189, 0.72)",
        trail: "rgba(115,173,242,0.34)",
        cursorFill: "rgba(255,255,255,0.96)",
        cursorStroke: "rgba(10,18,32,0.72)",
      }
    : {
        primaryText: "rgb(28, 38, 51)",
        secondaryText: "rgba(102, 112, 133, 0.82)",
        accent: "rgb(51, 122, 209)",
        selectedFill: "rgba(204, 232, 255, 0.24)",
        runningFill: "rgba(255, 197, 100, 0.28)",
        hoverFill: "rgba(245, 251, 255, 0.12)",
        divider: "rgba(255, 255, 255, 0.46)",
        ringOutline: "rgba(255, 255, 255, 0.46)",
        glassRingFill: "rgba(255, 255, 255, 0.78)",
        glassRingStroke: "rgba(255, 255, 255, 0.38)",
        folderGlassOpacity: 0.96,
        centerBase: "rgba(255, 255, 255, 0.88)",
        centerStroke: "rgba(255, 255, 255, 0.64)",
        centerShadow: "rgba(51, 122, 209, 0.05)",
        textMuted: "rgba(102, 112, 133, 0.82)",
        trail: "rgba(51,122,209,0.30)",
        cursorFill: "rgba(255,255,255,0.98)",
        cursorStroke: "rgba(15,23,42,0.70)",
      };

const iconMarkup = (slot: SiteWheelSlot, iconSize: number, highlighted: boolean, palette: SitePalette): string => {
  const path = SITE_WHEEL_ICON_PATHS[slot.icon] ?? SITE_WHEEL_ICON_PATHS["text.bubble.fill"];
  const color = highlighted ? palette.accent : palette.primaryText;
  return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" aria-hidden="true" style="display:block;color:${color};flex:none;scale:${highlighted ? 1.045 : 1}">${path}</svg>`;
};

const renderForeignLabel = ({
  slot,
  index,
  center,
  outerRadius,
  innerRatio,
  highlighted,
  compact,
  ringInnerRadius,
  palette,
  showText,
}: {
  slot: SiteWheelSlot;
  index: number;
  center: Point;
  outerRadius: number;
  innerRatio: number;
  highlighted: boolean;
  compact: boolean;
  ringInnerRadius?: number;
  palette: SitePalette;
  showText: boolean;
}) => {
  const pos = siteLabelPosition(index, wheelConfig.sectorCount, center, outerRadius, innerRatio, ringInnerRadius);
  const maxW = compact ? 42 : 56;
  const boxH = compact ? 28 : 40;
  const iconSize = compact ? 14 : 20;
  const fontSize = compact ? 7.5 : 10;
  const labelColor = highlighted ? palette.primaryText : palette.textMuted;

  return (
    <foreignObject
      key={`${slot.label}-${index}`}
      x={pos.x - maxW / 2}
      y={pos.y - (compact ? 14 : 18)}
      width={maxW}
      height={boxH}
      style={{ overflow: "visible" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: compact ? 1 : 2,
          width: "100%",
          height: "100%",
          textAlign: "center",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <span
          style={{ display: "block", width: iconSize, height: iconSize }}
          dangerouslySetInnerHTML={{ __html: iconMarkup(slot, iconSize, highlighted, palette) }}
        />
        {showText ? (
          <span
            style={{
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: labelColor,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro SC", "PingFang SC", system-ui, sans-serif',
              fontSize,
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: 0,
            }}
          >
            {slot.label}
          </span>
        ) : null}
      </div>
    </foreignObject>
  );
};

export const RingflowWheel = ({
  mode = "light",
  theme,
  themeMode,
  activeSegment,
  runningSegment,
  centerLabel = "Ringflow",
  appLabel,
  mini = false,
  revealProgress,
  revealFrame = 0,
  releaseProgress = 0,
  segmentStaggerFrames,
  pulseFrame = 0,
  showSegmentStagger = true,
  showOuterRing = false,
  showCursorReveal = false,
  showGlowPulse = true,
  showDragTrail = false,
  showSegmentLabels,
  glowProgress,
  highlightIndex,
  folderHighlightIndex,
  folderProgress,
  folderRotation = 0,
  mainSlots = MAIN_SLOTS,
  folderSlots = FOLDER_SLOTS,
}: RingflowWheelProps) => {
  const rawId = useId();
  const idPrefix = `ringflow-wheel-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolvedMode = theme ?? themeMode ?? mode;
  const dark = resolvedMode === "dark";
  const palette = paletteForMode(dark);
  const outer = wheelConfig.overlayOuterRadius;
  const inner = wheelDerivedConfig.overlayInnerRadius;
  const { inner: folderInner, outer: folderOuter } = folderRadii();
  const withFolder = showOuterRing;
  const ringRadius = withFolder ? folderOuter : outer;
  const padding = mini ? 10 : 18;
  const size = ringRadius * 2 + padding * 2;
  const center = { x: size / 2, y: size / 2 };
  const visualScale = mini ? 0.58 : 1;
  const dimension = Math.round(size * visualScale);
  const stagger = segmentStaggerFrames ?? Math.max(1, Math.round(wheelConfig.fanPresentStaggerSeconds * fps));
  const computedReveal = revealProgress ?? spring({
    frame: Math.max(0, frame - revealFrame),
    fps,
    config: { damping: 18, stiffness: 210, mass: 0.82 },
    durationInFrames: 22,
  });
  const reveal = clamp01(computedReveal);
  const release = clamp01(releaseProgress);
  const pulse = showGlowPulse
    ? glowProgress ?? interpolate(frame - pulseFrame, [0, 16, 34], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      })
    : 0;
  const outerRingProgress = clamp01(folderProgress ?? (withFolder ? reveal : 0));
  const activeMainIndex = highlightIndex ?? wheelSegmentToSiteIndex(activeSegment) ?? wheelSegmentToSiteIndex(runningSegment);
  const activeFolderIndex =
    folderHighlightIndex ??
    (withFolder ? (wheelSegmentToFolderIndex(activeSegment) ?? wheelSegmentToFolderIndex(runningSegment)) : null);
  const runningMainIndex = wheelSegmentToSiteIndex(runningSegment);
  const showText = showSegmentLabels ?? true;
  const { presetName, appName } = splitCenterLabel(centerLabel);
  const centerAppName = appLabel ?? appName;
  const glowId = `${idPrefix}-glow`;
  const centerGlowId = `${idPrefix}-center-glow`;
  const shadowId = `${idPrefix}-shadow`;

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        opacity: reveal * (1 - release * 0.45),
        scale: (0.9 + reveal * 0.1) * (1 - release * 0.1),
        filter: `drop-shadow(${promoTheme.shadow.wheel})`,
        transformOrigin: "center",
        lineHeight: 0,
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        role="img"
        aria-label="Ringflow action wheel"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <linearGradient id={glowId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={dark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.34)"} />
            <stop offset="52%" stopColor={dark ? "rgba(83,151,231,0.18)" : "rgba(204,232,255,0.20)"} />
            <stop offset="100%" stopColor={dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.12)"} />
          </linearGradient>
          <radialGradient id={centerGlowId} cx="50%" cy="34%" r="72%">
            <stop offset="0%" stopColor={dark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.96)"} />
            <stop offset="100%" stopColor={palette.centerBase} />
          </radialGradient>
          {/* Dark live glass wash gradient to better match real summoned style */}
          {dark && (
            <linearGradient id={`${idPrefix}-darkWash`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(26,30,38,0.42)" />
              <stop offset="40%" stopColor="rgba(32,38,48,0.22)" />
              <stop offset="100%" stopColor="rgba(10,12,16,0.35)" />
            </linearGradient>
          )}
          <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="rgba(10,11,13,0.045)" />
            <feDropShadow dx="0" dy="0" stdDeviation="7.5" floodColor="rgba(51,122,209,0.055)" />
          </filter>
        </defs>

        <circle
          cx={center.x}
          cy={center.y}
          r={outer + 18 + pulse * 9}
          fill={dark ? "rgba(83,151,231,0.12)" : "rgba(88,158,235,0.10)"}
          opacity={0.45 + pulse * 0.22}
        />

        {showDragTrail ? (
          <path
            d={`M ${center.x - 58} ${center.y + 64} C ${center.x - 18} ${center.y + 28}, ${center.x + 34} ${center.y - 12}, ${center.x + 82} ${center.y - 72}`}
            fill="none"
            stroke={palette.trail}
            strokeLinecap="round"
            strokeWidth={mini ? 7 : 9}
            opacity={0.7 * reveal * (1 - release)}
          />
        ) : null}

        <g filter={`url(#${shadowId})`}>
          {withFolder ? (
            <g
              opacity={interpolate(outerRingProgress, [0, 1], [0, reveal], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}
              style={{
                rotate: `${folderRotation}deg`,
                scale: interpolate(outerRingProgress, [0, 1], [0.88, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
                transformOrigin: `${center.x}px ${center.y}px`,
              }}
            >
              <path
                d={ringPath(center, folderInner, folderOuter)}
                fillRule="evenodd"
                fill={dark ? `url(#${idPrefix}-darkWash)` : palette.glassRingFill}
                stroke={palette.glassRingStroke}
                strokeWidth={0.8}
                opacity={dark ? 0.75 : palette.folderGlassOpacity}
              />
              {folderSlots.map((slot, index) => {
                if (!slot) return null;
                const itemReveal = showSegmentStagger
                  ? interpolate(outerRingProgress, [0, Math.min(1, 0.48 + index * 0.065), 1], [0, 0.35, reveal], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    })
                  : outerRingProgress * reveal;
                const highlighted = activeFolderIndex === index;
                const path = annulusSectorPath(index, wheelConfig.sectorCount, center, folderOuter, folderInner);
                return (
                  <g
                    key={slot.label}
                    opacity={itemReveal}
                    style={{
                      rotate: `${fanCollapseRotation(index, wheelConfig.sectorCount) * (1 - itemReveal)}rad`,
                      scale: 0.9 + itemReveal * 0.1,
                      transformOrigin: `${center.x}px ${center.y}px`,
                    }}
                  >
                    <path d={path} fill={highlighted ? palette.selectedFill : palette.hoverFill} />
                    {renderForeignLabel({
                      slot,
                      index,
                      center,
                      outerRadius: folderOuter,
                      innerRatio: folderInner / folderOuter,
                      highlighted,
                      compact: true,
                      ringInnerRadius: folderInner,
                      palette,
                      showText,
                    })}
                  </g>
                );
              })}
            </g>
          ) : null}

          <g
            opacity={reveal}
            style={{
              scale: 0.9 + reveal * 0.1,
              transformOrigin: `${center.x}px ${center.y}px`,
            }}
          >
            <path
              d={ringPath(center, inner, outer)}
              fillRule="evenodd"
              fill={dark ? `url(#${idPrefix}-darkWash)` : palette.glassRingFill}
              stroke={palette.glassRingStroke}
              strokeWidth={0.8}
              opacity={dark ? 0.85 : 1}
            />
          </g>

          {mainSlots.map((slot, index) => {
            const itemReveal = showSegmentStagger
              ? interpolate(frame, [revealFrame + index * stagger, revealFrame + index * stagger + 12], [0, reveal], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })
              : reveal;
            const highlighted = activeMainIndex === index;
            const running = runningMainIndex === index;
            const path = annulusSectorPath(index, wheelConfig.sectorCount, center, outer, inner);
            return (
              <g
                key={slot.label}
                opacity={itemReveal}
                style={{
                  rotate: `${fanCollapseRotation(index, wheelConfig.sectorCount) * (1 - itemReveal)}rad`,
                  scale: 0.9 + itemReveal * 0.1,
                  transformOrigin: `${center.x}px ${center.y}px`,
                }}
              >
                <path d={path} fill={running ? palette.runningFill : highlighted ? palette.selectedFill : palette.hoverFill} />
                {highlighted || running ? (
                  <path
                    d={path}
                    fill={`url(#${glowId})`}
                    stroke={running ? promoTheme.colors.runningOrange : palette.accent}
                    strokeWidth={1.1}
                    opacity={running ? 0.74 : 0.82}
                    style={{ filter: "blur(0.7px)" }}
                  />
                ) : null}
                {renderForeignLabel({
                  slot,
                  index,
                  center,
                  outerRadius: outer,
                  innerRatio: wheelConfig.overlayInnerDeadZoneRatio,
                  highlighted: highlighted || running,
                  compact: false,
                  palette,
                  showText,
                })}
              </g>
            );
          })}

          <g opacity={reveal}>
            <circle cx={center.x} cy={center.y} r={outer} fill="none" stroke={palette.ringOutline} strokeWidth={1} />
            <circle cx={center.x} cy={center.y} r={inner} fill="none" stroke={palette.ringOutline} strokeWidth={1} />
            {mainSlots.map((slot, index) => {
              const angle = -Math.PI / 2 + ((2 * Math.PI) / wheelConfig.sectorCount) * index;
              const innerPoint = polarPoint(center, inner, angle);
              const outerPoint = polarPoint(center, outer, angle);
              return (
                <line
                  key={`${slot.label}-divider`}
                  x1={innerPoint.x}
                  y1={innerPoint.y}
                  x2={outerPoint.x}
                  y2={outerPoint.y}
                  stroke={palette.divider}
                  strokeWidth={1}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          <g opacity={reveal}>
            <circle
              cx={center.x}
              cy={center.y}
              r={centerGlassDiameter(outer) / 2}
              fill={dark ? `url(#${idPrefix}-darkWash)` : `url(#${centerGlowId})`}
              stroke={palette.centerStroke}
              strokeWidth={1.15}
              opacity={dark ? 0.85 : 1}
              style={{
                filter: `drop-shadow(0 1px ${activeMainIndex == null ? 12 : 7}px ${palette.centerShadow}) drop-shadow(0 2px 7px rgba(10, 11, 13, 0.07))`,
              }}
            />
            <foreignObject
              x={center.x - (centerGlassDiameter(outer) / 2) * 0.78}
              y={center.y - (centerGlassDiameter(outer) / 2) * 0.42}
              width={(centerGlassDiameter(outer) / 2) * 1.56}
              height={(centerGlassDiameter(outer) / 2) * 0.84}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  pointerEvents: "none",
                }}
              >
                <strong
                  style={{
                    color: palette.primaryText,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro SC", "PingFang SC", system-ui, sans-serif',
                    fontSize: 11.25,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    letterSpacing: 0,
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {presetName}
                </strong>
                <span
                  style={{
                    color: palette.secondaryText,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro SC", "PingFang SC", system-ui, sans-serif',
                    fontSize: 9.15,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    letterSpacing: 0,
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {centerAppName}
                </span>
              </div>
            </foreignObject>
          </g>
        </g>

        {showCursorReveal ? (
          <g
            transform={`translate(${center.x + outer * 0.66} ${center.y - outer * 0.62}) scale(${mini ? 0.74 : 0.86})`}
            opacity={0.92 * reveal * (1 - release)}
          >
            <path
              d="M0 0 L0 42 L12 30 L20 51 L31 46 L22 27 L39 27 Z"
              fill={palette.cursorFill}
              stroke={palette.cursorStroke}
              strokeLinejoin="round"
              strokeWidth={2.2}
            />
          </g>
        ) : null}
      </svg>
    </div>
  );
};
