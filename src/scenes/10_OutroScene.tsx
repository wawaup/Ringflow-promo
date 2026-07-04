import { interpolate, useCurrentFrame } from "remotion";
import { AppLogoMark } from "../components/Brand/AppLogoMark";
import { EndCard } from "../components/Promo/EndCard";
import { FONT_STACK } from "../components/Text/PromoText";
import { ease01 } from "../config/motion";
import { sceneCopy } from "../config/copy";
import { theme } from "../config/theme";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "outro")!;

/**
 * Shot 10 — 收尾。
 * Clean brand card on the plain ambience: the mantra 「唤出 · 选择 · 执行」,
 * the gradient wordmark, the CTA, and the website address.
 */
export const OutroScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const mantra = sceneCopy.outro.headline[0];

  const mantraIn = ease01(frame, c.textStartFrame, 26);
  const brandIn = ease01(frame, c.actionStartFrame + 34, 28);
  const urlIn = ease01(frame, (c.ctaFrame ?? 150) + 22, 24);

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

        {/* Website address */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 580,
            letterSpacing: "0.04em",
            color: theme.colors.accent,
            opacity: urlIn,
            transform: `translateY(${(1 - urlIn) * 16}px)`,
          }}
        >
          ringflow.emio.cn
        </div>
      </div>
    </SceneShell>
  );
};
