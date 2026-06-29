import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../config/theme";
import { wheelConfig, wheelSegments, type WheelSegmentId } from "../../config/wheel";
import { annulusSectorPath, labelPosition } from "./wheelGeometry";

type RingflowWheelProps = {
  mode?: "light" | "dark";
  activeSegment?: WheelSegmentId;
  runningSegment?: WheelSegmentId;
  centerLabel?: string;
  mini?: boolean;
  revealProgress?: number;
  revealFrame?: number;
  segmentStaggerFrames?: number;
  pulseFrame?: number;
  showSegmentStagger?: boolean;
  showOuterRing?: boolean;
  glowProgress?: number;
};

const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

export const RingflowWheel = ({
  mode = "light",
  activeSegment,
  runningSegment,
  centerLabel = "Ringflow",
  mini = false,
  revealProgress,
  revealFrame = 0,
  segmentStaggerFrames,
  pulseFrame = 0,
  showSegmentStagger = true,
  showOuterRing = false,
  glowProgress,
}: RingflowWheelProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = mode === "dark";
  const visualScale = mini ? 0.58 : 1;
  const outer = wheelConfig.overlayOuterRadius;
  const inner = outer * wheelConfig.overlayInnerDeadZoneRatio;
  const ringRadius = showOuterRing
    ? outer + wheelConfig.folderRingGap + wheelConfig.folderRingThickness
    : outer;
  const padding = mini ? 14 : 20;
  const size = ringRadius * 2 + padding * 2;
  const center = { x: size / 2, y: size / 2 };
  const stagger = segmentStaggerFrames ?? Math.max(1, Math.round(wheelConfig.fanPresentStaggerSeconds * fps));
  const computedReveal = revealProgress ?? interpolate(frame, [revealFrame, revealFrame + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const reveal = clamp01(computedReveal);
  const pulse = glowProgress ?? interpolate(frame - pulseFrame, [0, 16, 34], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dimension = Math.round(size * visualScale);
  const labelFont = mini ? 18 : 21;
  const centerFont = mini ? 17 : 24;
  const gradientId = `ringflow-wheel-glass-${mode}-${mini ? "mini" : "full"}`;
  const glowId = `ringflow-wheel-glow-${mode}-${mini ? "mini" : "full"}`;

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        opacity: reveal,
        scale: 0.9 + reveal * 0.1,
        filter: `drop-shadow(${theme.shadow.wheel})`,
        transformOrigin: "center",
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        role="img"
        aria-label="Ringflow action wheel"
      >
        <defs>
          <radialGradient id={gradientId} cx="30%" cy="22%" r="84%">
            <stop offset="0%" stopColor={dark ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.96)"} />
            <stop offset="48%" stopColor={dark ? "rgba(54,76,108,0.76)" : "rgba(232,244,255,0.66)"} />
            <stop offset="100%" stopColor={dark ? "rgba(9,15,28,0.80)" : "rgba(255,255,255,0.78)"} />
          </radialGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="58%">
            <stop offset="0%" stopColor={dark ? "rgba(85,151,231,0.24)" : "rgba(88,158,235,0.26)"} />
            <stop offset="72%" stopColor={dark ? "rgba(85,151,231,0.10)" : "rgba(88,158,235,0.08)"} />
            <stop offset="100%" stopColor="rgba(88,158,235,0)" />
          </radialGradient>
          <filter id="ringflow-wheel-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="rgba(22, 44, 78, 0.22)" />
          </filter>
        </defs>

        <circle
          cx={center.x}
          cy={center.y}
          r={outer + 18 + pulse * 9}
          fill={`url(#${glowId})`}
          opacity={0.72 + pulse * 0.24}
        />

        {showOuterRing ? (
          <circle
            cx={center.x}
            cy={center.y}
            r={outer + wheelConfig.folderRingGap + wheelConfig.folderRingThickness / 2}
            fill="none"
            stroke={dark ? "rgba(119,155,210,0.24)" : "rgba(96,153,218,0.20)"}
            strokeWidth={wheelConfig.folderRingThickness}
            opacity={0.72}
          />
        ) : null}

        <circle
          cx={center.x}
          cy={center.y}
          r={outer}
          fill={`url(#${gradientId})`}
          stroke={dark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.86)"}
          strokeWidth={1.5}
          filter="url(#ringflow-wheel-soft-shadow)"
        />

        {wheelSegments.map((segment, index) => {
          const itemReveal = showSegmentStagger
            ? interpolate(frame, [revealFrame + index * stagger, revealFrame + index * stagger + 9], [0, reveal], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })
            : reveal;
          const isActive = activeSegment === segment.id;
          const isRunning = runningSegment === segment.id;
          const label = labelPosition(index, wheelConfig.sectorCount, center, outer, wheelConfig.overlayInnerDeadZoneRatio);

          return (
            <g key={segment.id} opacity={itemReveal}>
              <path
                d={annulusSectorPath(index, wheelConfig.sectorCount, center, outer, inner)}
                fill={
                  isRunning
                    ? "rgba(245,158,11,0.48)"
                    : isActive
                      ? "rgba(82,157,236,0.42)"
                      : dark
                        ? "rgba(255,255,255,0.060)"
                        : "rgba(255,255,255,0.22)"
                }
                stroke={dark ? "rgba(255,255,255,0.095)" : "rgba(255,255,255,0.58)"}
                strokeWidth={isActive || isRunning ? 1.7 : 1}
              />
              {(isActive || isRunning) && (
                <path
                  d={annulusSectorPath(index, wheelConfig.sectorCount, center, outer - 1.5, inner + 1.5)}
                  fill="none"
                  stroke={isRunning ? theme.colors.runningOrange : theme.colors.accentBlue}
                  strokeWidth={2.5}
                  opacity={0.78}
                />
              )}
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={dark ? theme.colors.darkInk : theme.colors.ink}
                fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif'
                fontSize={labelFont}
                fontWeight={700}
                letterSpacing={0}
              >
                {segment.label}
              </text>
            </g>
          );
        })}

        <circle cx={center.x} cy={center.y} r={inner} fill={dark ? "rgba(6,11,20,0.58)" : "rgba(255,255,255,0.54)"} />
        <circle
          cx={center.x}
          cy={center.y}
          r={inner * wheelConfig.overlayCenterGlassRatio}
          fill={dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.82)"}
          stroke={dark ? "rgba(255,255,255,0.17)" : "rgba(255,255,255,0.90)"}
          strokeWidth={1.2}
        />
        <text
          x={center.x}
          y={center.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={dark ? theme.colors.darkInk : theme.colors.ink}
          fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif'
          fontSize={centerFont}
          fontWeight={800}
          letterSpacing={0}
        >
          {centerLabel}
        </text>
      </svg>
    </div>
  );
};
