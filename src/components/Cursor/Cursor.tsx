import { useId } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

type TrailPoint = {
  x: number;
  y: number;
  opacity: number;
};

type CursorProps = {
  x: number;
  y: number;
  pressed?: boolean;
  trail?: TrailPoint[];
  /** Scale the cursor (1.0 = default macOS cursor size) */
  scale?: number;
};

type MiddleClickCursorProps = {
  x: number;
  y: number;
  /** 0 = up, 1 = fully pressed */
  pressProgress?: number;
  /** 0 = hidden, 1 = fully visible */
  revealProgress?: number;
  /** Direction of swipe: angle in degrees */
  swipeAngle?: number;
  /** 0 = no swipe indicator, 1 = full arrow */
  swipeProgress?: number;
  trail?: TrailPoint[];
};

/** Standard macOS arrow cursor */
export const Cursor = ({ x, y, pressed = false, trail = [], scale = 1 }: CursorProps) => {
  const rawId = useId();
  const shadowId = `cursor-shadow-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const cursorScale = (pressed ? 0.92 : 1) * scale;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {trail.map((point, index) => (
        <div
          key={`${point.x}-${point.y}-${index}`}
          style={{
            position: "absolute",
            left: point.x,
            top: point.y,
            width: Math.max(5, 20 - index * 4),
            height: Math.max(5, 20 - index * 4),
            translate: "-50% -50%",
            borderRadius: 999,
            background: `rgba(47,127,211,${point.opacity})`,
          }}
        />
      ))}
      <svg
        width={48 * scale}
        height={58 * scale}
        viewBox="-4 -4 48 58"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: x,
          top: y,
          opacity: pressed ? 0.96 : 1,
          transform: `scale(${cursorScale})`,
          transformOrigin: "0 0",
          transition: "none",
        }}
      >
        <defs>
          <filter id={shadowId} x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="rgba(15,23,42,0.26)" />
          </filter>
        </defs>
        <g filter={`url(#${shadowId})`}>
          <path
            d="M0 0 L0 39 L10.8 28.3 L18.7 47.2 L29.4 42.8 L21.2 24.6 L36.8 24.6 Z"
            fill="rgba(255,255,255,0.98)"
            stroke="rgba(15,23,42,0.78)"
            strokeLinejoin="round"
            strokeWidth={2.2}
          />
          <path
            d="M4.8 8.4 L4.8 27.9 L10.5 22.2 L15.5 34.4"
            fill="none"
            stroke="rgba(255,255,255,0.60)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.3}
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * Middle-click cursor: shows a macOS-style scroll wheel cursor with press state,
 * and an animated rightward swipe trail to demonstrate the Ringflow gesture.
 */
export const MiddleClickCursor = ({
  x,
  y,
  pressProgress = 0,
  revealProgress = 1,
  swipeAngle = 0,
  swipeProgress = 0,
  trail = [],
}: MiddleClickCursorProps) => {
  const rawId = useId();
  const shadowId = `mc-cursor-shadow-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const glowId = `mc-cursor-glow-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Scroll wheel button glow intensity
  const wheelGlow = pressProgress;
  // Cursor body squish on press
  const bodyScaleY = 1 - pressProgress * 0.06;
  // Swipe arrow alpha
  const arrowAlpha = swipeProgress;

  // Swipe direction arrow (radians)
  const swipeRad = (swipeAngle * Math.PI) / 180;
  const arrowDx = Math.cos(swipeRad) * 28;
  const arrowDy = Math.sin(swipeRad) * 28;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Trail dots */}
      {trail.map((point, index) => (
        <div
          key={`${point.x}-${point.y}-${index}`}
          style={{
            position: "absolute",
            left: point.x,
            top: point.y,
            width: Math.max(4, 16 - index * 3),
            height: Math.max(4, 16 - index * 3),
            translate: "-50% -50%",
            borderRadius: 999,
            background: `rgba(47,127,211,${point.opacity * swipeProgress})`,
          }}
        />
      ))}

      <svg
        width={56}
        height={80}
        viewBox="0 0 56 80"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: x - 28,
          top: y - 20,
          opacity: revealProgress,
          transform: `scaleY(${bodyScaleY})`,
          transformOrigin: "28px 30px",
        }}
      >
        <defs>
          <filter id={shadowId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="rgba(15,23,42,0.30)" />
          </filter>
          <radialGradient id={glowId} cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor={`rgba(47,127,211,${0.6 + wheelGlow * 0.4})`} />
            <stop offset="100%" stopColor={`rgba(20,60,140,${0.3 + wheelGlow * 0.4})`} />
          </radialGradient>
        </defs>

        <g filter={`url(#${shadowId})`}>
          {/* Cursor body */}
          <rect
            x={10}
            y={2}
            width={36}
            height={52}
            rx={18}
            fill="rgba(255,255,255,0.96)"
            stroke="rgba(15,23,42,0.55)"
            strokeWidth={1.5}
          />
          {/* Center divider line */}
          <line
            x1={28}
            y1={2}
            x2={28}
            y2={32}
            stroke="rgba(15,23,42,0.22)"
            strokeWidth={1}
          />
          {/* Scroll wheel */}
          <rect
            x={22}
            y={10}
            width={12}
            height={20}
            rx={6}
            fill={`url(#${glowId})`}
            stroke={`rgba(47,127,211,${0.4 + wheelGlow * 0.5})`}
            strokeWidth={1.2}
          />
          {/* Wheel highlight when pressed */}
          {pressProgress > 0.1 ? (
            <rect
              x={22}
              y={10}
              width={12}
              height={20}
              rx={6}
              fill={`rgba(120,180,255,${pressProgress * 0.35})`}
            />
          ) : null}

          {/* Left button */}
          <path
            d="M10 20 Q10 2 28 2 L28 32 Q18 32 10 28 Z"
            fill="rgba(0,0,0,0.03)"
          />
          {/* Right button */}
          <path
            d="M46 20 Q46 2 28 2 L28 32 Q38 32 46 28 Z"
            fill="rgba(0,0,0,0.03)"
          />
        </g>

        {/* Swipe direction arrow */}
        {arrowAlpha > 0.05 ? (
          <g opacity={arrowAlpha} transform={`translate(28, 68)`}>
            <line
              x1={0}
              y1={0}
              x2={arrowDx}
              y2={arrowDy}
              stroke="rgba(47,127,211,0.82)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <polygon
              points={`${arrowDx},${arrowDy} ${arrowDx - 6},${arrowDy - 3} ${arrowDx - 3},${arrowDy + 4}`}
              fill="rgba(47,127,211,0.82)"
            />
          </g>
        ) : null}
      </svg>
    </div>
  );
};
