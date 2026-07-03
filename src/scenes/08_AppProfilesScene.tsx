import { interpolate, useCurrentFrame } from "remotion";
import { GlassCard } from "../components/Promo/GlassCard";
import { FONT_STACK } from "../components/Text/PromoText";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { PROFILE_WHEELS } from "../components/Wheel/siteWheelModel";
import { getWheelWrapperStyle } from "../config/layout";
import { ease01 } from "../config/motion";
import { theme } from "../config/theme";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "app-profiles")!;

const STAGE_WIDTH = 1240;
const STAGE_HEIGHT = 560;
const WHEEL_BOX = 292;

const APP_BADGES: Record<string, { bg: string; glyph: string }> = {
  Notion: { bg: "linear-gradient(135deg, #37352f, #191919)", glyph: "N" },
  Cursor: { bg: "linear-gradient(135deg, #4f7cf7, #1e4fd6)", glyph: "⌘" },
  Zoom: { bg: "linear-gradient(135deg, #4a8cff, #2d8cff)", glyph: "Z" },
};

/**
 * Shot 8 — 应用配置。
 * The foreground app switches Notion → Cursor → Zoom; the wheel morphs its
 * sectors to each app's own preset automatically. 「不同应用，自动换轮盘。」
 */
export const AppProfilesScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const switches = c.appSwitchFrames ?? [44, 112, 180];

  const activeIndex = switches.reduce((acc, at, index) => (frame >= at ? index : acc), 0);

  return (
    <SceneShell scene={scene} stageWidth={STAGE_WIDTH} stageHeight={STAGE_HEIGHT} pushIn={0.02}>
      <div
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 110,
          fontFamily: FONT_STACK,
        }}
      >
        {/* App switcher rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {PROFILE_WHEELS.map((profile, index) => {
            const active = index === activeIndex;
            const badge = APP_BADGES[profile.app];
            const activeT = ease01(frame, switches[index], 16);
            const emphasis = active ? activeT : 0;
            return (
              <GlassCard
                key={profile.app}
                padding="16px 24px"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  width: 330,
                  opacity: 0.55 + emphasis * 0.45,
                  transform: `scale(${0.97 + emphasis * 0.05})`,
                  border: active
                    ? `1.5px solid rgba(47,107,255,${0.25 + emphasis * 0.4})`
                    : "1px solid rgba(255,255,255,0.9)",
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 14,
                    background: badge.bg,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 25,
                    fontWeight: 700,
                    flex: "none",
                  }}
                >
                  {badge.glyph}
                </div>
                <div>
                  <div style={{ fontSize: 27, fontWeight: 650, color: theme.colors.ink }}>{profile.app}</div>
                  <div style={{ fontSize: 20, color: theme.colors.muted, marginTop: 2 }}>
                    {profile.role}轮盘 · 自动匹配
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Morphing wheel — three stacked wheels crossfade per switch */}
        <div style={{ position: "relative", width: 470, height: 500 }}>
          {PROFILE_WHEELS.map((profile, index) => {
            const inAt = switches[index];
            const outAt = index < switches.length - 1 ? switches[index + 1] : Number.MAX_SAFE_INTEGER;
            const opacity = interpolate(frame, [inAt, inAt + 14, outAt, outAt + 14], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (opacity <= 0.001) return null;
            const settle = ease01(frame, inAt, 22);
            return (
              <div
                key={profile.app}
                style={{
                  position: "absolute",
                  left: (470 - WHEEL_BOX) / 2,
                  top: (500 - WHEEL_BOX) / 2,
                  opacity,
                  transform: `scale(${0.96 + settle * 0.04}) rotate(${(1 - settle) * -7}deg)`,
                  transformOrigin: "center",
                }}
              >
                <div style={getWheelWrapperStyle("hero")}>
                  <RingflowWheel
                    revealProgress={1}
                    mainSlots={profile.slots}
                    centerLabel={profile.presetName}
                    appLabel={profile.app}
                    pulseFrame={inAt + 6}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};
