import { interpolate, useCurrentFrame } from "remotion";
import { GlassCard } from "../components/Promo/GlassCard";
import { FONT_STACK } from "../components/Text/PromoText";
import { ease01 } from "../config/motion";
import { PRESETS, PRESET_FLOW_STEPS } from "../config/productSemantics";
import { theme } from "../config/theme";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "preset-library")!;

const STAGE_WIDTH = 1240;
const STAGE_HEIGHT = 480;

/**
 * Shot 9 — 预设库。
 * 「不想从零编排？预设库，一键导入。」 Three scenario presets; the first one
 * downloads, imports, and is ready — three chips tick off the flow.
 */
export const PresetLibraryScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const steps = c.stepFrames ?? [48, 116, 176];

  return (
    <SceneShell scene={scene} stageWidth={STAGE_WIDTH} stageHeight={STAGE_HEIGHT} pushIn={0.02}>
      <div
        style={{
          width: STAGE_WIDTH,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
          fontFamily: FONT_STACK,
        }}
      >
        {/* Preset cards */}
        <div style={{ display: "flex", gap: 26 }}>
          {PRESETS.map((preset, index) => {
            const inT = ease01(frame, c.visualStartFrame + index * 10, 22);
            const featured = index === 0;
            const progress = featured
              ? interpolate(frame, [steps[0], steps[1]], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;
            const imported = featured ? ease01(frame, steps[1] + 8, 18) : 0;
            return (
              <GlassCard
                key={preset.name}
                padding="26px 30px"
                style={{
                  width: 340,
                  opacity: inT * (featured ? 1 : 0.78),
                  transform: `translateY(${(1 - inT) * 30}px) scale(${featured ? 1.02 : 0.99})`,
                  border: featured ? "1.5px solid rgba(47,107,255,0.35)" : "1px solid rgba(255,255,255,0.9)",
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 700, color: theme.colors.ink }}>{preset.name}</div>
                <div style={{ fontSize: 21, color: theme.colors.muted, marginTop: 8 }}>{preset.desc}</div>
                <div style={{ marginTop: 22, height: 44, display: "flex", alignItems: "center" }}>
                  {featured ? (
                    imported > 0.05 ? (
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 650,
                          color: theme.colors.accent,
                          opacity: imported,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        ✓ 已导入 · 轮盘就绪
                      </div>
                    ) : (
                      <div style={{ width: "100%", height: 8, borderRadius: 999, background: "rgba(10,11,13,0.07)" }}>
                        <div
                          style={{
                            width: `${progress * 100}%`,
                            height: "100%",
                            borderRadius: 999,
                            background: theme.gradients.accent,
                          }}
                        />
                      </div>
                    )
                  ) : (
                    <div
                      style={{
                        fontSize: 21,
                        fontWeight: 600,
                        color: theme.colors.accent,
                        padding: "8px 20px",
                        borderRadius: 999,
                        background: "rgba(47,107,255,0.08)",
                      }}
                    >
                      下载
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Three-step flow chips */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {PRESET_FLOW_STEPS.map((step, index) => {
            const at = steps[index];
            const active = ease01(frame, at, 16);
            return (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {index > 0 ? (
                  <div style={{ width: 44, height: 2, background: "rgba(10,11,13,0.14)", borderRadius: 2 }} />
                ) : null}
                <div
                  style={{
                    padding: "12px 26px",
                    borderRadius: 999,
                    fontSize: 24,
                    fontWeight: 620,
                    color: active > 0.5 ? "#ffffff" : theme.colors.muted,
                    background: active > 0.5 ? theme.gradients.accent : "rgba(10,11,13,0.05)",
                    boxShadow: active > 0.5 ? "0 12px 30px rgba(47,107,255,0.28)" : "none",
                    transform: `scale(${0.97 + active * 0.03})`,
                  }}
                >
                  {step}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};
