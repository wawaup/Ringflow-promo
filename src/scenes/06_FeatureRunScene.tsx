import type { ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { GlassCard } from "../components/Promo/GlassCard";
import { KeyCap } from "../components/Promo/KeyCap";
import { FONT_STACK } from "../components/Text/PromoText";
import { RingflowWheel } from "../components/Wheel/RingflowWheel";
import { SHOWCASE_SLOTS } from "../components/Wheel/siteWheelModel";
import { FEATURE_BEATS } from "../config/copy";
import { getWheelWrapperStyle } from "../config/layout";
import { ease01, fadeOut } from "../config/motion";
import {
  MONITOR_METRICS,
  QUICK_INPUT_EXAMPLE,
  QUICK_OPEN_TARGETS,
  SHELL_EXAMPLE,
  SHORTCUTS_EXAMPLE,
  STICKY_NOTE_EXAMPLE,
  TEXT_ACTION_PROMPTS,
} from "../config/productSemantics";
import { theme } from "../config/theme";
import { FEATURE_BEAT_FRAMES, scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "feature-run")!;

const STAGE_WIDTH = 1500;
const STAGE_HEIGHT = 660;
const WHEEL_BOX = 292;
const CARD_WIDTH = 640;

/**
 * Shot 6 — 功能节拍（Apple-style feature run）。
 * The showcase wheel stays planted on the left; its highlight sweeps
 * clockwise, one sector per beat, and each beat's result materializes on the
 * right: key caps, a pasted prompt, opened targets, a sticky note, a shell
 * run, a Shortcut, live monitors. Uniform 2.1s beats = rhythm.
 */
export const FeatureRunScene = () => {
  const frame = useCurrentFrame();
  const beatLen = scene.choreography.beatDurationFrames ?? FEATURE_BEAT_FRAMES;
  const beatIndex = Math.min(FEATURE_BEATS.length - 1, Math.max(0, Math.floor(frame / beatLen)));
  const beat = FEATURE_BEATS[beatIndex];
  const fb = frame - beatIndex * beatLen; // beat-local frame
  const isLastBeat = beatIndex === FEATURE_BEATS.length - 1;

  // Per-beat entries/exits (last beat holds through the scene's cross-dissolve)
  const headIn = ease01(fb, 8, 20);
  const cardIn = ease01(fb, 26, 24);
  const beatOut = isLastBeat ? 1 : fadeOut(fb, beatLen - 16, 14);

  // Sector highlight leads the result: pulse at each beat start
  const glow = interpolate(fb, [4, 18, beatLen - 20], [0, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wheelCenter = { x: 330, y: STAGE_HEIGHT / 2 };

  return (
    <SceneShell scene={scene} hideText stageWidth={STAGE_WIDTH} stageHeight={STAGE_HEIGHT} pushIn={0.016}>
      <div style={{ position: "relative", width: STAGE_WIDTH, height: STAGE_HEIGHT, fontFamily: FONT_STACK }}>
        {/* The wheel never moves — only its highlight travels */}
        <div
          style={{
            position: "absolute",
            left: wheelCenter.x - WHEEL_BOX / 2,
            top: wheelCenter.y - WHEEL_BOX / 2,
            ...getWheelWrapperStyle("hero"),
          }}
        >
          <RingflowWheel
            revealFrame={scene.choreography.visualStartFrame}
            mainSlots={SHOWCASE_SLOTS}
            highlightIndex={beat.wheelIndex}
            glowProgress={glow}
            centerLabel={SHOWCASE_SLOTS[beat.wheelIndex].label}
            appLabel="Ringflow"
          />
        </div>

        {/* Right: beat headline + sub + result */}
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 0,
            width: STAGE_WIDTH - 700,
            height: STAGE_HEIGHT,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 26,
            opacity: beatOut,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 76,
                fontWeight: 760,
                letterSpacing: "-0.01em",
                color: theme.colors.ink,
                opacity: headIn,
                transform: `translateY(${(1 - headIn) * 26}px)`,
              }}
            >
              {beat.headline}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 34,
                fontWeight: 540,
                color: theme.colors.muted,
                opacity: ease01(fb, 16, 20),
                transform: `translateY(${(1 - ease01(fb, 16, 22)) * 18}px)`,
              }}
            >
              {beat.sub}
            </div>
          </div>

          <div
            style={{
              minHeight: 260,
              display: "flex",
              alignItems: "flex-start",
              opacity: cardIn,
              transform: `translateY(${(1 - cardIn) * 30}px)`,
            }}
          >
            <BeatResult beatId={beat.id} fb={fb} />
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

// ─── Per-beat result surfaces ────────────────────────────────────────────────

const BeatResult = ({ beatId, fb }: { beatId: string; fb: number }): ReactNode => {
  switch (beatId) {
    case "hotkey":
      return <HotkeyResult fb={fb} />;
    case "quick-input":
      return <QuickInputResult fb={fb} />;
    case "quick-open":
      return <QuickOpenResult fb={fb} />;
    case "sticky-note":
      return <StickyResult />;
    case "shell":
      return <ShellResult fb={fb} />;
    case "shortcuts":
      return <ShortcutResult fb={fb} />;
    case "monitor":
      return <MonitorResult fb={fb} />;
    default:
      return null;
  }
};

const HotkeyResult = ({ fb }: { fb: number }) => (
  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
    {["⌘C", "⌘V", "⌘S"].map((key, index) => {
      const pressAt = 44 + index * 20;
      const press = interpolate(fb, [pressAt, pressAt + 6, pressAt + 14], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return (
        <KeyCap key={key} label={key} size={92} press={press} active={fb >= pressAt && fb < pressAt + 20} />
      );
    })}
  </div>
);

const QuickInputResult = ({ fb }: { fb: number }) => {
  const prompt = TEXT_ACTION_PROMPTS[QUICK_INPUT_EXAMPLE.action];
  const shown = Math.round(interpolate(fb, [40, 96], [0, prompt.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  return (
    <GlassCard style={{ width: CARD_WIDTH }}>
      <div style={{ fontSize: 22, fontWeight: 620, color: theme.colors.accent, marginBottom: 10 }}>
        {QUICK_INPUT_EXAMPLE.action}
      </div>
      <div style={{ fontSize: 24, lineHeight: 1.6, color: theme.colors.ink, minHeight: 120 }}>
        {prompt.slice(0, shown)}
        <span style={{ opacity: fb % 24 < 12 ? 0.9 : 0, color: theme.colors.accent }}>|</span>
      </div>
    </GlassCard>
  );
};

const QuickOpenResult = ({ fb }: { fb: number }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: CARD_WIDTH }}>
    {QUICK_OPEN_TARGETS.map((target, index) => {
      const inAt = 36 + index * 16;
      const t = ease01(fb, inAt, 18);
      return (
        <GlassCard
          key={target.label}
          padding="16px 22px"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: t,
            transform: `translateX(${(1 - t) * 34}px)`,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: theme.gradients.accent,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 19,
              fontWeight: 700,
              flex: "none",
            }}
          >
            {target.label.slice(0, 1)}
          </div>
          <div style={{ fontSize: 26, fontWeight: 620, color: theme.colors.ink }}>{target.label}</div>
          <div style={{ marginLeft: "auto", fontSize: 20, color: theme.colors.muted }}>{target.desc}</div>
        </GlassCard>
      );
    })}
  </div>
);

const StickyResult = () => (
  <GlassCard
    style={{
      width: 460,
      background: "linear-gradient(180deg, #fff9e3, #fff3c4)",
      border: "1px solid rgba(214, 178, 66, 0.35)",
    }}
  >
    <div style={{ fontSize: 24, fontWeight: 700, color: "#7a5a12", marginBottom: 12 }}>
      {STICKY_NOTE_EXAMPLE.title}
    </div>
    {STICKY_NOTE_EXAMPLE.items.map((item) => (
      <div key={item} style={{ fontSize: 23, lineHeight: 1.75, color: "#5f4a14" }}>
        • {item}
      </div>
    ))}
  </GlassCard>
);

const ShellResult = ({ fb }: { fb: number }) => {
  const doneIn = ease01(fb, 66, 16);
  return (
    <GlassCard mode="dark" style={{ width: CARD_WIDTH, fontFamily: "SF Mono, Menlo, monospace" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
          <div key={color} style={{ width: 12, height: 12, borderRadius: 999, background: color }} />
        ))}
      </div>
      <div style={{ fontSize: 24, color: "#9ef2b4" }}>
        <span style={{ color: "#7f8ea8" }}>$ </span>
        {SHELL_EXAMPLE.command}
      </div>
      <div style={{ fontSize: 24, color: "#e6eef8", marginTop: 12, opacity: doneIn }}>
        ✓ {SHELL_EXAMPLE.result}
      </div>
    </GlassCard>
  );
};

const ShortcutResult = ({ fb }: { fb: number }) => {
  const done = ease01(fb, 60, 18);
  return (
    <GlassCard style={{ width: 520, display: "flex", alignItems: "center", gap: 18 }} padding="20px 26px">
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
          display: "grid",
          placeItems: "center",
          color: "#fff",
          fontSize: 26,
          flex: "none",
        }}
      >
        ⚡
      </div>
      <div>
        <div style={{ fontSize: 27, fontWeight: 650, color: theme.colors.ink }}>{SHORTCUTS_EXAMPLE.action}</div>
        <div style={{ fontSize: 21, color: theme.colors.muted, marginTop: 4, opacity: done }}>
          ✓ {SHORTCUTS_EXAMPLE.result}
        </div>
      </div>
    </GlassCard>
  );
};

const MonitorResult = ({ fb }: { fb: number }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: CARD_WIDTH }}>
    {MONITOR_METRICS.map((metric, index) => {
      const t = ease01(fb, 34 + index * 10, 20);
      const fill = interpolate(fb, [40 + index * 10, 84 + index * 10], [0, metric.raw], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return (
        <GlassCard key={metric.label} padding="16px 20px" style={{ opacity: t, transform: `translateY(${(1 - t) * 20}px)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 21, color: theme.colors.muted }}>{metric.label}</span>
            <span style={{ fontSize: 27, fontWeight: 700, color: theme.colors.ink }}>{metric.value}</span>
          </div>
          <div style={{ marginTop: 10, height: 7, borderRadius: 999, background: "rgba(10,11,13,0.07)" }}>
            <div
              style={{
                width: `${fill * 100}%`,
                height: "100%",
                borderRadius: 999,
                background: theme.gradients.accent,
              }}
            />
          </div>
        </GlassCard>
      );
    })}
  </div>
);
