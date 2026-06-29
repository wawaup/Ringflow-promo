import { AbsoluteFill } from "remotion";

type PromoBackgroundProps = {
  mode?: "light" | "dark";
};

export const PromoBackground = ({ mode = "light" }: PromoBackgroundProps) => {
  const dark = mode === "dark";
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: dark
          ? "linear-gradient(135deg, #07111f 0%, #142238 48%, #26364e 100%)"
          : "linear-gradient(135deg, #f8fbff 0%, #edf7ff 46%, #ffffff 100%)",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <radialGradient id={`background-wash-${mode}`} cx="46%" cy="30%" r="64%">
            <stop offset="0%" stopColor={dark ? "rgba(80,128,194,0.22)" : "rgba(115,180,245,0.24)"} />
            <stop offset="62%" stopColor={dark ? "rgba(80,128,194,0.05)" : "rgba(115,180,245,0.07)"} />
            <stop offset="100%" stopColor="rgba(115,180,245,0)" />
          </radialGradient>
          <linearGradient id={`background-ribbon-${mode}`} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.82)"} />
            <stop offset="100%" stopColor={dark ? "rgba(87,126,185,0.05)" : "rgba(207,233,255,0.24)"} />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill={`url(#background-wash-${mode})`} />
        <path
          d="M-120 845 C310 690 545 730 900 565 C1236 409 1515 293 2045 366 L2045 1120 L-120 1120 Z"
          fill={`url(#background-ribbon-${mode})`}
          opacity={dark ? 0.28 : 0.62}
        />
        <circle cx="1578" cy="164" r="310" fill={dark ? "rgba(72,109,166,0.10)" : "rgba(199,229,255,0.44)"} />
        <circle cx="266" cy="914" r="260" fill={dark ? "rgba(48,86,143,0.12)" : "rgba(232,244,255,0.68)"} />
      </svg>
    </AbsoluteFill>
  );
};
