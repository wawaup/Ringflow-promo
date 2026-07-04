import type { CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { MacDesktopWallpaper } from "../Background/MacDesktopWallpaper";
import { MacContextMenu } from "../MacUI/MacContextMenu";
import { MacMenuBar, menuTabLeft } from "../MacUI/MacMenuBar";
import { FONT_STACK, PromoText } from "../Text/PromoText";
import { sceneCopy } from "../../config/copy";
import { EASE } from "../../config/motion";
import { theme } from "../../config/theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** ——— Stage geometry: two overlapping windows the task ping-pongs between ——— */
const ED = { x: 280, y: 140, w: 980, h: 600 };
const TM = { x: 660, y: 320, w: 980, h: 600 };
const HEADER_H = 40;

const EDIT_MENUS = ["文件", "编辑", "格式", "窗口"];
const EDIT_INDEX = EDIT_MENUS.indexOf("编辑");
const DROP_LEFT = ED.x + menuTabLeft(EDIT_INDEX, true) - 8;
const DROP_TOP = ED.y + HEADER_H + 4;
const DROP_W = 220;
const MENU_ROW = 28;
/** 查找 row (4th) in the dropdown — the cascade branches from here. */
const FIND_Y = DROP_TOP + 5 + 3 * MENU_ROW + MENU_ROW / 2;
const SUB_LEFT = DROP_LEFT + DROP_W - 6;
const SUB_TOP = FIND_Y - MENU_ROW / 2 - 5;
const SUB_W = 190;
const REPLACE_Y = SUB_TOP + 5 + 2 * MENU_ROW + MENU_ROW / 2;

const INPUT_H = 52;
const INPUT_TOP = TM.y + TM.h - 22 - INPUT_H;
const TERM_CLICK = { x: TM.x + 130, y: INPUT_TOP + INPUT_H / 2 };
const CTX_H = 5 + 2 * MENU_ROW + 5;
const CTX_LEFT = TERM_CLICK.x;
const CTX_TOP = TERM_CLICK.y - CTX_H - 10;
const CTX_W = 150;
const PASTE_ITEM = { x: CTX_LEFT + 60, y: CTX_TOP + 5 + MENU_ROW + MENU_ROW / 2 };

const NOTE_LINES = ["1. 订阅到期自动提醒", "2. 支持预设分组导出", "3. 批量导出配置项"];
const PASTE_TEXT = "2. 支持预设分组导出";

/** Reveal a string progressively, character by character (a paste/type effect). */
const revealText = (full: string, progress: number) => {
  const n = Math.max(0, Math.min(full.length, Math.floor(full.length * progress)));
  return full.slice(0, n);
};

/**
 * ——— Loop machinery ———
 * The SAME chore plays three times: once at normal speed so it reads, then
 * twice more, each faster — the repetition itself is the pain. The last round
 * freezes right on the paste click.
 */
const SPEEDS = [1, 1.7, 2.6] as const;
const LOOP_V = 190;
/** Last round stops mid-loop, frozen on the paste click. */
const ROUND_V = [LOOP_V, LOOP_V, 140] as const;
const ROUND_DURATIONS = ROUND_V.map((v, i) => Math.round(v / SPEEDS[i]));

/** Beat times inside one loop, in VIRTUAL frames (t). */
const V = {
  menuClick: 14, // click 编辑 → dropdown opens
  subOpen: 40, // hover 查找 → cascading submenu
  itemClick: 56, // click 替换…
  menusOut: 58,
  switchOut: 66, // editor recedes, terminal comes forward
  switchDur: 24,
  rightClick: 112, // right-click the terminal input
  pasteClick: 136, // click 粘贴
  typeStart: 138,
  typeDur: 18,
  switchBack: 158, // back to the editor for the next lap
  homeClick: 170,
} as const;

const MENU_CLICK_V = [V.menuClick, V.itemClick, V.rightClick, V.pasteClick];
const SWITCH_V = [70, 162];
const CLICK_V = [...MENU_CLICK_V, V.homeClick];

const FREEZE_HOLD = 12;
const OVERLAY_DUR = 16;

const headerRowStyle = (dark: boolean): CSSProperties => ({
  height: HEADER_H,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "0 18px",
  borderBottom: dark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(148,163,184,0.18)",
  background: dark ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.30)",
});

const TrafficDots = () => (
  <>
    <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f57" }} />
    <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ffbd2e" }} />
    <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28c840" }} />
  </>
);

/** A mac-style arrow pointer with a ripple pulse on click. */
const Cursor = ({ x, y, clickPulse }: { x: number; y: number; clickPulse: number }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 60, pointerEvents: "none" }}>
    {clickPulse > 0 ? (
      <div
        style={{
          position: "absolute",
          left: -12,
          top: -12,
          width: 24,
          height: 24,
          borderRadius: 999,
          border: "2px solid rgba(47,127,211,0.75)",
          opacity: 1 - clickPulse,
          transform: `scale(${0.6 + clickPulse * 1.2})`,
        }}
      />
    ) : null}
    <svg width="22" height="22" viewBox="0 0 20 20" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.45))" }}>
      <path d="M2 1 L2 15.5 L5.8 12.2 L8.3 18 L10.6 17 L8.2 11.3 L13.5 11.3 Z" fill="#ffffff" stroke="#111318" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  </div>
);

/** HUD counter segment: label + ×N with a pop on each increment. */
const HudCounter = ({ label, count, scale }: { label: string; count: number; scale: number }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
    <span style={{ fontSize: 24, fontWeight: 550, color: "rgba(255,255,255,0.72)" }}>{label}</span>
    <span
      style={{
        fontSize: 32,
        fontWeight: 760,
        color: "#ffffff",
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: "center",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      ×{count}
    </span>
  </div>
);

/**
 * FrictionWorkflow — the opening montage, rebuilt as a REPETITION machine:
 * one legible lap of the chore (menu dive with cascading submenu → window
 * switch → right-click paste → switch back), then the exact same lap replayed
 * twice, each faster. From lap two a HUD tallies 菜单点击 / 窗口切换 in real
 * time. The last lap freezes mid-click, the desktop dims, and the scene's own
 * lines land: 找菜单。切窗口。一遍又一遍。
 */
export const FrictionWorkflow = ({
  choreography,
}: {
  choreography?: { actionStartFrame?: number };
} = {}) => {
  const frame = useCurrentFrame();
  const action = choreography?.actionStartFrame ?? 40;

  const roundStart = [
    action,
    action + ROUND_DURATIONS[0],
    action + ROUND_DURATIONS[0] + ROUND_DURATIONS[1],
  ];
  const montageEnd = roundStart[2] + ROUND_DURATIONS[2];
  const overlayStart = montageEnd + FREEZE_HOLD;
  const textStart = overlayStart + OVERLAY_DUR;
  const handyStart = textStart + 92;

  // Which lap are we in, and where inside the (virtual) loop?
  const round = frame < roundStart[1] ? 0 : frame < roundStart[2] ? 1 : 2;
  const t = Math.min(ROUND_V[round], Math.max(0, (frame - roundStart[round]) * SPEEDS[round]));

  const windowsIn = interpolate(frame, [action - 20, action - 4], [0, 1], { ...CLAMP, easing: EASE });

  // Focus swap: editor ⇄ terminal (the 切窗口 beat, twice per lap).
  const sw1 = interpolate(t, [V.switchOut, V.switchOut + V.switchDur], [0, 1], { ...CLAMP, easing: EASE });
  const sw2 = interpolate(t, [V.switchBack, V.switchBack + V.switchDur], [0, 1], { ...CLAMP, easing: EASE });
  const editorFocus = Math.min(1, Math.max(0, 1 - sw1 + sw2));
  const terminalFocus = 1 - editorFocus;

  // Menu choreography inside the lap.
  const menusOutP = interpolate(t, [V.menusOut, V.menusOut + 8], [1, 0], CLAMP);
  const dropOpacity = interpolate(t, [V.menuClick, V.menuClick + 8], [0, 1], CLAMP) * menusOutP;
  const subOpacity = interpolate(t, [V.subOpen, V.subOpen + 7], [0, 1], CLAMP) * menusOutP;
  const findActive = t >= V.subOpen - 6 && menusOutP > 0.2;
  const replaceSelected = t >= V.itemClick;
  const ctxOutP = interpolate(t, [V.typeStart + 2, V.typeStart + 10], [1, 0], CLAMP);
  const ctxOpacity = interpolate(t, [V.rightClick, V.rightClick + 8], [0, 1], CLAMP) * ctxOutP;
  const pasteSelected = t >= V.pasteClick;

  const typeP = interpolate(t, [V.typeStart, V.typeStart + V.typeDur], [0, 1], CLAMP);
  const inputText = revealText(PASTE_TEXT, typeP);
  const caretOn = Math.floor(frame / 15) % 2 === 0;

  // Cursor path through the lap (virtual waypoints; faster laps = faster cursor).
  const TAB = { x: ED.x + menuTabLeft(EDIT_INDEX, true) + 22, y: ED.y + 20 };
  const FIND = { x: DROP_LEFT + 100, y: FIND_Y };
  const REPL = { x: SUB_LEFT + 80, y: REPLACE_Y };
  const HOME = { x: ED.x + 150, y: ED.y + 96 };
  const wpT = [0, 12, 22, 38, 42, 52, 60, 96, 116, 130, 146, 168, LOOP_V];
  const wpP = [HOME, TAB, TAB, FIND, FIND, REPL, REPL, TERM_CLICK, TERM_CLICK, PASTE_ITEM, PASTE_ITEM, HOME, HOME];
  const cursorX = interpolate(t, wpT, wpP.map((p) => p.x), CLAMP);
  const cursorY = interpolate(t, wpT, wpP.map((p) => p.y), CLAMP);
  const clickPulse = Math.max(
    ...CLICK_V.map((cv) => interpolate(t, [cv - 0.01, cv, cv + 9], [0, 1, 0], CLAMP)),
  );
  const cursorVisible = windowsIn > 0.9 && frame < overlayStart;

  // ——— HUD tallies (from lap 2): every menu click and window switch, mapped to global frames ———
  const menuEvents: number[] = [];
  const switchEvents: number[] = [];
  ROUND_V.forEach((rv, r) => {
    for (const v of MENU_CLICK_V) if (v <= rv) menuEvents.push(roundStart[r] + v / SPEEDS[r]);
    for (const v of SWITCH_V) if (v <= rv) switchEvents.push(roundStart[r] + v / SPEEDS[r]);
  });
  const countPast = (events: number[]) => events.filter((g) => frame >= g).length;
  const popScale = (events: number[]) => {
    let p = 0;
    for (const g of events) p = Math.max(p, interpolate(frame, [g - 0.01, g + 1, g + 14], [0, 1, 0], CLAMP));
    return 1 + p * 0.25;
  };
  const hudOpacity =
    interpolate(frame, [roundStart[1], roundStart[1] + 12], [0, 1], CLAMP) *
    (1 - interpolate(frame, [overlayStart, overlayStart + 12], [0, 1], CLAMP));

  // Closing beat — freeze, dim, land the lines.
  const overlayOpacity = interpolate(frame, [overlayStart, overlayStart + OVERLAY_DUR], [0, 0.88], CLAMP);

  const windowBase = (rect: { x: number; y: number; w: number; h: number }, focus: number): CSSProperties => ({
    position: "absolute",
    left: rect.x,
    top: rect.y,
    width: rect.w,
    height: rect.h,
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: focus > 0.5 ? theme.shadow.panel : "0 18px 40px rgba(10,20,45,0.16)",
    border: "1px solid rgba(255,255,255,0.76)",
    background: theme.colors.glassLight,
    backdropFilter: "blur(28px)",
    opacity: windowsIn,
    transform: `scale(${0.965 + focus * 0.035}) translateY(${(1 - focus) * 6}px)`,
    transformOrigin: "center",
    zIndex: focus > 0.5 ? 30 : 20,
  });

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", fontFamily: FONT_STACK }}>
      <MacDesktopWallpaper />

      {/* Text editor — the lap always starts (and restarts) here */}
      <div style={windowBase(ED, editorFocus)}>
        <MacMenuBar
          appName="文本编辑"
          menus={EDIT_MENUS}
          activeMenu={dropOpacity > 0.4 ? "编辑" : undefined}
          width={ED.w}
          embedded
          trafficLights
        />
        <div style={{ height: ED.h - HEADER_H, padding: "28px 44px", boxSizing: "border-box" }}>
          <div style={{ fontFamily: "SF Mono, Menlo, monospace", fontSize: 20, color: "#334155", lineHeight: "36px" }}>
            {NOTE_LINES.map((line) => (
              <div key={line} style={{ whiteSpace: "pre" }}>{line}</div>
            ))}
          </div>
        </div>
        {/* Unfocused veil */}
        <div style={{ position: "absolute", inset: 0, background: `rgba(20,28,44,${(1 - editorFocus) * 0.12})`, pointerEvents: "none" }} />
      </div>

      {/* Terminal — where every lap's paste lands */}
      <div
        style={{
          ...windowBase(TM, terminalFocus),
          background: "rgba(20, 24, 34, 0.96)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div style={headerRowStyle(true)}>
          <TrafficDots />
          <span style={{ marginLeft: 14, fontSize: 15, fontWeight: 600, color: theme.colors.darkMuted }}>Claude Code — 项目文档</span>
        </div>
        <div style={{ height: TM.h - HEADER_H, padding: "20px 26px", boxSizing: "border-box", position: "relative", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 12,
              padding: "16px 22px",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, color: "#e0a3ff" }}>✳</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#f4f6fb" }}>Claude Code</span>
            </div>
            <span style={{ fontSize: 13, color: theme.colors.darkMuted, fontFamily: "SF Mono, Menlo, monospace" }}>~/项目文档 · 准备就绪</span>
          </div>

          {/* Scrollback: every previous lap left the SAME line behind — 一遍又一遍 */}
          <div style={{ flex: 1, padding: "18px 4px", fontFamily: "SF Mono, Menlo, monospace", fontSize: 15, color: "rgba(201,209,217,0.72)", display: "flex", flexDirection: "column", gap: 10 }}>
            {Array.from({ length: round }, (_, i) => (
              <span key={i}>
                <span style={{ color: "#7ee787" }}>❯ </span>
                {PASTE_TEXT}
              </span>
            ))}
          </div>

          {/* Input box — the paste target */}
          <div
            style={{
              position: "absolute",
              left: 26,
              right: 26,
              top: INPUT_TOP - TM.y - HEADER_H,
              height: INPUT_H,
              boxSizing: "border-box",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 12,
              padding: "0 18px",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "SF Mono, Menlo, monospace",
              fontSize: 16,
            }}
          >
            <span style={{ color: "#7ee787" }}>❯</span>
            <span style={{ color: "#e8ecf3" }}>
              {inputText}
              {caretOn ? <span style={{ color: "#e8ecf3" }}>▏</span> : null}
            </span>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: `rgba(8,10,16,${(1 - terminalFocus) * 0.2})`, pointerEvents: "none" }} />
      </div>

      {/* Dropdown from 编辑 + cascading 查找 submenu */}
      <div style={{ position: "absolute", left: DROP_LEFT, top: DROP_TOP, opacity: dropOpacity, zIndex: 40, transform: `translateY(${(1 - dropOpacity) * 6}px)` }}>
        <MacContextMenu
          width={DROP_W}
          items={[
            { label: "剪切", shortcut: "⌘X" },
            { label: "拷贝", shortcut: "⌘C" },
            { label: "粘贴", shortcut: "⌘V" },
            { label: "查找", hasSubmenu: true, selected: findActive },
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: SUB_LEFT, top: SUB_TOP, opacity: subOpacity, zIndex: 41, transform: `translateX(${(1 - subOpacity) * -6}px)` }}>
        <MacContextMenu
          width={SUB_W}
          items={[
            { label: "查找…", shortcut: "⌘F" },
            { label: "查找下一个" },
            { label: "替换…", selected: replaceSelected },
          ]}
        />
      </div>

      {/* Right-click menu over the terminal input */}
      <div style={{ position: "absolute", left: CTX_LEFT, top: CTX_TOP, opacity: ctxOpacity, zIndex: 40 }}>
        <MacContextMenu
          width={CTX_W}
          mode="dark"
          items={[
            { label: "拷贝", shortcut: "⌘C" },
            { label: "粘贴", shortcut: "⌘V", selected: pasteSelected },
          ]}
        />
      </div>

      {/* HUD tallies — appear once the replay speeds up (lap 2+) */}
      <div
        style={{
          position: "absolute",
          top: 54,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 55,
          display: "flex",
          alignItems: "baseline",
          gap: 26,
          padding: "12px 34px",
          borderRadius: 999,
          background: "rgba(12,16,26,0.55)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(18px)",
          opacity: hudOpacity,
        }}
      >
        <HudCounter label="菜单点击" count={countPast(menuEvents)} scale={popScale(menuEvents)} />
        <span style={{ fontSize: 22, color: "rgba(255,255,255,0.35)" }}>·</span>
        <HudCounter label="窗口切换" count={countPast(switchEvents)} scale={popScale(switchEvents)} />
      </div>

      {cursorVisible ? <Cursor x={cursorX} y={cursorY} clickPulse={clickPulse} /> : null}

      {/* Freeze → dim → the lines land */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(6,8,14,1)", opacity: overlayOpacity, pointerEvents: "none", zIndex: 70 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
          zIndex: 80,
        }}
      >
        {/* 三行痛点，按时间顺序逐行落地（每行间隔 30 帧） */}
        <PromoText
          lines={sceneCopy.friction.headline}
          mode="dark"
          align="center"
          size={92}
          startFrame={textStart}
          lineStagger={30}
        />
        {/* 结论句：与上方同字号，单行 + 品牌渐变，作为整镜的落点强调 */}
        <PromoText
          lines={["常用的操作，应该就在手边。"]}
          mode="dark"
          align="center"
          size={92}
          gradient
          maxWidth={1680}
          startFrame={handyStart}
        />
      </div>
    </div>
  );
};
