import { interpolate, useCurrentFrame } from "remotion";
import { GlassCard } from "../Promo/GlassCard";
import { RingflowWheel } from "../Wheel/RingflowWheel";
import { MAIN_SLOTS, SITE_WHEEL_ICON_PATHS, type SiteWheelIconName } from "../Wheel/siteWheelModel";
import { sectorMidAngle } from "../Wheel/wheelGeometry";
import { LAYOUT, getWheelWrapperStyle } from "../../config/layout";
import { EASE_TRAVEL, ease01 } from "../../config/motion";
import { theme } from "../../config/theme";
import { FONT_STACK } from "../Text/PromoText";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const STAGE_WIDTH = 1180;
export const STAGE_HEIGHT = 460;

/** The 快捷键 category panel: concrete shortcuts, not sibling categories. */
const SHORTCUT_ROWS = [
  { keys: "⌘C", label: "复制", icon: "doc.on.doc" },
  { keys: "⌘V", label: "粘贴", icon: "doc.on.clipboard" },
  { keys: "⌘S", label: "保存", icon: "square.and.arrow.down" },
  { keys: "⌘Z", label: "撤销", icon: "arrow.uturn.backward" },
] as const satisfies readonly { keys: string; label: string; icon: SiteWheelIconName }[];

/** 第四项 ⌘Z 撤销 is the one dragged in. */
const TARGET_ROW = 3;
/** …and it lands in the wheel's 撤销 sector (MAIN_SLOTS index 2). */
const TARGET_SECTOR = 2;

const ROW_H = 58;
const ROW_GAP = 10;
const PANEL_WIDTH = 264;
/** RingflowWheel intrinsic wrapper box (main ring + padding). */
const WHEEL_BOX = 292;

const iconSvg = (icon: SiteWheelIconName, size: number) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="display:block">${SITE_WHEEL_ICON_PATHS[icon]}</svg>`;

const KeyChip = ({ keys, small = false }: { keys: string; small?: boolean }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: small ? 44 : 52,
      padding: small ? "3px 8px" : "4px 10px",
      borderRadius: 8,
      border: "1px solid rgba(10,11,13,0.14)",
      background: "rgba(255,255,255,0.85)",
      boxShadow: "0 1.5px 0 rgba(10,11,13,0.10)",
      fontSize: small ? 17 : 19,
      fontWeight: 650,
      color: theme.colors.ink,
      fontFamily: FONT_STACK,
      letterSpacing: "0.02em",
    }}
  >
    {keys}
  </span>
);

type ActionListDragProps = {
  visualStartFrame: number;
  actionStartFrame: number;
  dragStartFrame: number;
  dropFrame: number;
};

/**
 * Shot 5 ("umbrella") interaction: a 快捷键 category panel lists concrete
 * shortcuts (⌘C/⌘V/⌘S/⌘Z). The fourth row (⌘Z 撤销) lifts out and drags into
 * the wheel. The destination sector stays EMPTY until the drop lands — only
 * then does its icon+label appear, making the "action goes in, wheel gains
 * it" loop visibly complete.
 */
export const ActionListDrag = ({ visualStartFrame, actionStartFrame, dragStartFrame, dropFrame }: ActionListDragProps) => {
  const frame = useCurrentFrame();

  const wheelCenter = { x: STAGE_WIDTH - 300, y: STAGE_HEIGHT / 2 };
  const wheelRadius = LAYOUT.wheel.standard / 2;
  const targetAngle = sectorMidAngle(TARGET_SECTOR, 8);
  const dropPoint = {
    x: wheelCenter.x + Math.cos(targetAngle) * wheelRadius * 0.7,
    y: wheelCenter.y + Math.sin(targetAngle) * wheelRadius * 0.7,
  };

  const panelLeft = 60;
  const panelTop = STAGE_HEIGHT / 2 - (ROW_H * SHORTCUT_ROWS.length + ROW_GAP * (SHORTCUT_ROWS.length - 1) + 66) / 2;

  const selected = frame >= actionStartFrame;
  const dropped = frame >= dropFrame;
  const dragProgress = interpolate(frame, [dragStartFrame, dropFrame], [0, 1], { ...CLAMP, easing: EASE_TRAVEL });

  // The destination sector is blank until the drop lands, then 撤销 appears.
  const wheelSlots = MAIN_SLOTS.map((slot, index) => (index === TARGET_SECTOR && !dropped ? null : slot));

  const chipStart = {
    x: panelLeft + PANEL_WIDTH / 2,
    y: panelTop + 66 + TARGET_ROW * (ROW_H + ROW_GAP) + ROW_H / 2,
  };
  const chipPos = {
    x: interpolate(dragProgress, [0, 1], [chipStart.x, dropPoint.x]),
    y: interpolate(dragProgress, [0, 1], [chipStart.y, dropPoint.y]),
  };
  const chipOpacity = interpolate(frame, [dragStartFrame, dragStartFrame + 10, dropFrame, dropFrame + 12], [0, 1, 1, 0], CLAMP);
  const chipScale = interpolate(dragProgress, [0, 0.12, 1], [1, 1.06, 1.06]);

  const glow = interpolate(frame, [dragStartFrame, dropFrame - 8], [0, 1], CLAMP);
  // Landed sector settles with a soft pulse right as its content appears.
  const landPulse = interpolate(frame, [dropFrame, dropFrame + 10, dropFrame + 24], [0, 1, 0.55], CLAMP);

  return (
    <div style={{ position: "relative", width: STAGE_WIDTH, height: STAGE_HEIGHT, fontFamily: FONT_STACK }}>
      {/* 快捷键 category panel */}
      <div style={{ position: "absolute", left: panelLeft, top: panelTop }}>
        <GlassCard padding="18px 18px 16px" radius={20} style={{ width: PANEL_WIDTH, boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, opacity: ease01(frame, visualStartFrame, 20) }}>
            <span
              style={{ width: 24, height: 24, color: theme.colors.accent }}
              dangerouslySetInnerHTML={{ __html: iconSvg("keyboard", 24) }}
            />
            <span style={{ fontSize: 24, fontWeight: 720, color: theme.colors.ink }}>快捷键</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ROW_GAP }}>
            {SHORTCUT_ROWS.map((row, index) => {
              const rowIn = ease01(frame, visualStartFrame + 6 + index * 6, 20);
              const isTarget = index === TARGET_ROW;
              const highlightStyle =
                isTarget && selected && !dropped
                  ? { border: `1.5px solid ${theme.colors.accent}`, boxShadow: "0 0 0 4px rgba(47,107,255,0.14)" }
                  : { border: "1px solid rgba(10,11,13,0.07)" };
              return (
                <div
                  key={row.keys}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    height: ROW_H,
                    boxSizing: "border-box",
                    padding: "0 14px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.55)",
                    opacity: rowIn,
                    transform: `translateX(${(1 - rowIn) * -20}px)`,
                    ...highlightStyle,
                  }}
                >
                  <KeyChip keys={row.keys} />
                  <span
                    style={{ width: 20, height: 20, color: theme.colors.ink, opacity: 0.85 }}
                    dangerouslySetInnerHTML={{ __html: iconSvg(row.icon, 20) }}
                  />
                  <span style={{ fontSize: 21, fontWeight: 600, color: theme.colors.ink }}>{row.label}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Wrapper box is 292px intrinsic — offset by half of THAT so the wheel's
          visual center sits exactly on wheelCenter (vertically aligned with the panel). */}
      <div
        style={{
          position: "absolute",
          left: wheelCenter.x - WHEEL_BOX / 2,
          top: wheelCenter.y - WHEEL_BOX / 2,
          ...getWheelWrapperStyle("standard"),
        }}
      >
        <RingflowWheel
          revealFrame={visualStartFrame}
          mainSlots={wheelSlots}
          highlightIndex={selected ? TARGET_SECTOR : null}
          glowProgress={dropped ? Math.max(landPulse, 0.55) : glow}
          centerLabel="Ringflow"
          showSegmentStagger={false}
        />
      </div>

      {chipOpacity > 0 ? (
        <div
          style={{
            position: "absolute",
            left: chipPos.x,
            top: chipPos.y,
            transform: `translate(-50%, -50%) scale(${chipScale})`,
            opacity: chipOpacity,
            pointerEvents: "none",
          }}
        >
          <GlassCard padding="10px 16px" radius={14} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <KeyChip keys="⌘Z" small />
            <span style={{ fontSize: 18, fontWeight: 600, color: theme.colors.ink }}>撤销</span>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
};
