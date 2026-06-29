import { useId } from "react";

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
};

export const Cursor = ({ x, y, pressed = false, trail = [] }: CursorProps) => {
  const rawId = useId();
  const shadowId = `cursor-shadow-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {trail.map((point, index) => (
        <div
          key={`${point.x}-${point.y}-${index}`}
          style={{
            position: "absolute",
            left: point.x,
            top: point.y,
            width: Math.max(6, 24 - index * 4),
            height: Math.max(6, 24 - index * 4),
            translate: "-50% -50%",
            borderRadius: 999,
            background: `rgba(47,127,211,${point.opacity})`,
          }}
        />
      ))}
      <svg
        width={48}
        height={58}
        viewBox="-4 -4 48 58"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: x,
          top: y,
          opacity: pressed ? 0.96 : 1,
          scale: pressed ? 0.94 : 1,
          transformOrigin: "0 0",
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
