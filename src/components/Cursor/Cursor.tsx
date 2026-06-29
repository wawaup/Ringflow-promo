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
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs>
          <filter id="cursor-shadow" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="rgba(15,23,42,0.26)" />
          </filter>
        </defs>
        {trail.map((point, index) => (
          <circle
            key={`${point.x}-${point.y}-${index}`}
            cx={point.x}
            cy={point.y}
            r={Math.max(3, 12 - index * 2)}
            fill={`rgba(47,127,211,${point.opacity})`}
          />
        ))}
        <g
          transform={`translate(${x} ${y})`}
          filter="url(#cursor-shadow)"
          opacity={pressed ? 0.96 : 1}
        >
          <g transform={`scale(${pressed ? 0.94 : 1})`}>
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
        </g>
      </svg>
    </div>
  );
};
