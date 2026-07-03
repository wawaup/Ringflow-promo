import { interpolate, useCurrentFrame } from "remotion";
import { AppLogoMark } from "../components/Brand/AppLogoMark";
import { EndCard } from "../components/Promo/EndCard";
import { FONT_STACK } from "../components/Text/PromoText";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { getWheelWrapperStyle } from "../config/layout";
import { ease01 } from "../config/motion";
import { sceneCopy } from "../config/copy";
import { theme } from "../config/theme";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "outro")!;

/**
 * Shot 10 — 收尾。
 * A ghosted wheel breathes behind the mantra 「唤出 · 选择 · 执行」,
 * the gradient wordmark lands, then the CTA: 免费下载 · 浏览轮盘预设.
 */
export const OutroScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const mantra = sceneCopy.outro.headline[0];

  const wheelIn = ease01(frame, c.visualStartFrame, 40);
  const breathe = 1 + Math.sin(frame / 34) * 0.012;
  const mantraIn = ease01(frame, c.textStartFrame, 26);
  const brandIn = ease01(frame, c.actionStartFrame + 34, 28);

  return (
    <SceneShell scene={scene} hideText ambience={0.9} pushIn={0.018} stageWidth={1400} stageHeight={820}>
      <div
        style={{
          position: "relative",
          width: 1400,
          height: 820,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          fontFamily: FONT_STACK,
        }}
      >
        {/* Ghosted wheel halo behind everything */}
        <div
          style={{
            position: "absolute",
            left: 1400 / 2 - 146,
            top: 820 / 2 - 146 - 60,
            opacity: wheelIn * 0.16,
            transform: `scale(${breathe})`,
            transformOrigin: "center",
          }}
        >
          <div style={getWheelWrapperStyle("hero")}>
            <RingflowWheel revealProgress={1} showSegmentLabels={false} showGlowPulse={false} />
          </div>
        </div>

        <div
          style={{
            fontSize: 46,
            fontWeight: 560,
            letterSpacing: "0.14em",
            color: theme.colors.muted,
            opacity: mantraIn,
            transform: `translateY(${(1 - mantraIn) * 22}px)`,
          }}
        >
          {mantra}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            opacity: brandIn,
            transform: `translateY(${(1 - brandIn) * 26}px) scale(${0.985 + brandIn * 0.015})`,
          }}
        >
          <AppLogoMark size={128} />
          <div
            style={{
              fontSize: 148,
              fontWeight: 780,
              letterSpacing: "-0.015em",
              backgroundImage: theme.gradients.headlineLight,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              lineHeight: 1.05,
              paddingBottom: "0.06em",
            }}
          >
            Ringflow
          </div>
        </div>

        <div
          style={{
            fontSize: 34,
            fontWeight: 540,
            color: theme.colors.muted,
            opacity: interpolate(brandIn, [0, 1], [0, 0.9]),
          }}
        >
          围绕光标的快捷操作轮盘
        </div>

        <EndCard startFrame={c.ctaFrame ?? 150} />
      </div>
    </SceneShell>
  );
};
