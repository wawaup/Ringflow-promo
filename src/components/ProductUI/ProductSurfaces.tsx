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

/**
 * ——— Stage: one project, four windows ———
 * The material for a single task ("预设分组导出") is scattered across three
 * source windows — a markdown bug log, a sticky note with the new
 * requirement, and a code editor whose BUILT-IN terminal shows the run error.
 * Everything has to be hunted down, copied, and carried window-by-window into
 * the Claude Code terminal.
 */
const MD = { x: 240, y: 130, w: 860, h: 540 };
const NOTE = { x: 1290, y: 150, w: 380, h: 300 };
const CODE = { x: 430, y: 330, w: 900, h: 520 };
const TM = { x: 820, y: 440, w: 940, h: 560 };
const HEADER_H = 40;

const MD_MENUS = ["文件", "编辑", "格式", "窗口"];
const FILE_TAB = { x: MD.x + menuTabLeft(0, true) + 16, y: MD.y + 20 };
const DROP1_LEFT = MD.x + menuTabLeft(0, true) - 8;
const DROP1_TOP = MD.y + HEADER_H + 4;
const MENU_ROW = 28;
/** 保存 row (3rd) in the 文件 dropdown. */
const SAVE_ITEM = { x: DROP1_LEFT + 80, y: DROP1_TOP + 5 + 2 * MENU_ROW + MENU_ROW / 2 };

const BUG_TEXT = "- 导出时丢失分组信息";
const NOTE_TEXT = "支持预设分组导出";
const ERR_LINE_1 = "Error: missing group id";
const ERR_LINE_2 = "    at exportPresets (export.ts:12)";

/** Markdown bug line geometry (selection + right-click menu hang off it). */
const SEL1 = { x0: 284, x1: 490, y: 250 };
const CTX1 = { left: 505, top: 262 };
const COPY1 = { x: CTX1.left + 60, y: CTX1.top + 5 + MENU_ROW + MENU_ROW / 2 };

/** Sticky note requirement line. */
const NOTE_SEL = { x0: 1314, x1: 1478, y: 254 };
const CTX_NOTE = { left: 1480, top: 262 };
const COPY2 = { x: CTX_NOTE.left + 50, y: CTX_NOTE.top + 5 + MENU_ROW / 2 };

/** Built-in terminal error block inside the code editor. */
const ERR_SEL = { x0: 458, y1: 535, y2: 565 };
const CTX_CODE = { left: 780, top: 585 };
const COPY3 = { x: CTX_CODE.left + 50, y: CTX_CODE.top + 5 + MENU_ROW / 2 };

/** Claude Code terminal input + its paste menu. */
const INPUT_H = 52;
const INPUT_TOP = TM.y + TM.h - 22 - INPUT_H;
const TM_CLICK = { x: TM.x + 130, y: INPUT_TOP + INPUT_H / 2 };
const CTX_TM = { left: TM_CLICK.x, top: TM_CLICK.y - (5 + 2 * MENU_ROW + 5) - 10 };
const PASTE_ITEM = { x: CTX_TM.left + 60, y: CTX_TM.top + 5 + MENU_ROW + MENU_ROW / 2 };

/**
 * ——— Beat sheet (scene-local frames, assuming actionStartFrame = 40) ———
 * Phase 1 (40–290): ONE fully legible lap — select the bug line, 文件→保存,
 * right-click 拷贝, switch to the terminal, right-click 粘贴, text types in.
 * Phase 2 (290–442): the rapid montage — note → terminal → (hunting: markdown
 * → code editor) → grab the RED ERROR from the built-in terminal → terminal —
 * switches get shorter, the HUD tallies jump, and everything freezes the
 * instant the last 粘贴 is clicked.
 */
const FRONTS = ["md", "tm", "note", "tm", "md", "code", "tm"] as const;
type WindowId = (typeof FRONTS)[number] | "note" | "code";
const SWITCH_F = [204, 290, 336, 374, 386, 418];
const SWITCH_D = [24, 16, 14, 12, 12, 12];

const MENU_CLICKS = [104, 132, 164, 190, 236, 260, 320, 326, 352, 358, 410, 414, 432, 440];
const SWITCH_EVENTS = [216, 298, 343, 380, 392, 424];

const FREEZE_AT = 442;
const FREEZE_HOLD = 12;
const OVERLAY_DUR = 16;
const TEXT_START = FREEZE_AT + FREEZE_HOLD + OVERLAY_DUR; // 470
/** Beat of silence after 「一遍又一遍。」 before the conclusion lands. */
const HANDY_START = TEXT_START + 126; // 596

/** Reveal a string progressively, character by character. */
const revealText = (full: string, progress: number) => {
  const n = Math.max(0, Math.min(full.length, Math.floor(full.length * progress)));
  return full.slice(0, n);
};

/** Progressive drag-selection highlight painted behind rendered text. */
const selectionStyle = (progress: number): CSSProperties => ({
  backgroundImage: `linear-gradient(90deg, rgba(47,127,211,0.32) ${progress * 100}%, transparent ${progress * 100}%)`,
  borderRadius: 3,
});

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
 * FrictionWorkflow — the opening montage. One task's material lives in three
 * different windows; watch it get carried piece by piece into Claude Code.
 * First lap is fully legible; then the window-hopping compresses into a rapid
 * montage with a live tally, and freezes mid-click. 找菜单。切窗口。一遍又一遍。
 */
export const FrictionWorkflow = ({
  choreography,
}: {
  choreography?: { actionStartFrame?: number };
} = {}) => {
  const frame = useCurrentFrame();
  const action = choreography?.actionStartFrame ?? 40;
  // Beat constants assume action = 40; shift if the timeline ever moves it.
  const f = frame - (action - 40);

  const windowsIn = interpolate(f, [20, 36], [0, 1], { ...CLAMP, easing: EASE });

  // ——— Focus: exactly one window in front, transitions per the switch table ———
  let seg = 0;
  while (seg < SWITCH_F.length && f >= SWITCH_F[seg]) seg += 1;
  const focusOf = (w: WindowId): number => {
    if (seg === 0) return FRONTS[0] === w ? 1 : 0;
    const i = seg - 1;
    const p = interpolate(f, [SWITCH_F[i], SWITCH_F[i] + SWITCH_D[i]], [0, 1], { ...CLAMP, easing: EASE });
    if (FRONTS[i + 1] === w) return p;
    if (FRONTS[i] === w) return 1 - p;
    return 0;
  };
  const focus = {
    md: focusOf("md"),
    note: focusOf("note"),
    code: focusOf("code"),
    tm: focusOf("tm"),
  };
  const baseZ: Record<string, number> = { md: 24, note: 26, code: 23, tm: 22 };

  const windowBase = (
    rect: { x: number; y: number; w: number; h: number },
    id: keyof typeof focus,
  ): CSSProperties => ({
    position: "absolute",
    left: rect.x,
    top: rect.y,
    width: rect.w,
    height: rect.h,
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: focus[id] > 0.5 ? theme.shadow.panel : "0 18px 40px rgba(10,20,45,0.16)",
    border: "1px solid rgba(255,255,255,0.76)",
    background: theme.colors.glassLight,
    backdropFilter: "blur(28px)",
    opacity: windowsIn,
    transform: `scale(${0.968 + focus[id] * 0.032}) translateY(${(1 - focus[id]) * 5}px)`,
    transformOrigin: "center",
    zIndex: focus[id] > 0.45 ? 40 : baseZ[id],
  });
  const veil = (id: keyof typeof focus, dark = false): CSSProperties => ({
    position: "absolute",
    inset: 0,
    background: dark ? `rgba(8,10,16,${(1 - focus[id]) * 0.2})` : `rgba(20,28,44,${(1 - focus[id]) * 0.12})`,
    pointerEvents: "none",
  });

  // ——— Selections ———
  const sel1 = interpolate(f, [48, 76], [0, 1], CLAMP);
  const noteSel = interpolate(f, [306, 316], [0, 1], CLAMP);
  const errSel = interpolate(f, [398, 408], [0, 1], CLAMP);

  // ——— Menus ———
  const menuFade = (inF: number, inD: number, outF: number, outD: number) =>
    interpolate(f, [inF, inF + inD], [0, 1], CLAMP) * interpolate(f, [outF, outF + outD], [1, 0], CLAMP);
  const drop1Opacity = menuFade(104, 8, 136, 10);
  const ctx1Opacity = menuFade(164, 8, 194, 8);
  const ctxTm1Opacity = menuFade(236, 8, 262, 10);
  const ctxNoteOpacity = menuFade(320, 6, 330, 8);
  const ctxTm2Opacity = menuFade(352, 5, 362, 10);
  const ctxCodeOpacity = menuFade(410, 4, 418, 8);
  const ctxTm3Opacity = interpolate(f, [432, 438], [0, 1], CLAMP); // stays — frozen mid-click

  // ——— Terminal input + history: three payloads arrive one by one ———
  const inputText =
    f >= 430 ? "" : f >= 360 ? NOTE_TEXT : f >= 262 ? revealText(BUG_TEXT, interpolate(f, [262, 286], [0, 1], CLAMP)) : "";
  const history: string[] = [];
  if (f >= 360) history.push(BUG_TEXT);
  if (f >= 430) history.push(NOTE_TEXT);
  const caretOn = Math.floor(frame / 15) % 2 === 0;

  // ——— Cursor: one continuous journey across all four windows ———
  const wp: Array<[number, number, number]> = [
    [40, SEL1.x0, SEL1.y],
    [48, SEL1.x0, SEL1.y],
    [76, SEL1.x1, SEL1.y],
    [84, SEL1.x1, SEL1.y],
    [100, FILE_TAB.x, FILE_TAB.y],
    [108, FILE_TAB.x, FILE_TAB.y],
    [128, SAVE_ITEM.x, SAVE_ITEM.y],
    [140, SAVE_ITEM.x, SAVE_ITEM.y],
    [160, SEL1.x1 + 10, SEL1.y + 6],
    [168, SEL1.x1 + 10, SEL1.y + 6],
    [184, COPY1.x, COPY1.y],
    [196, COPY1.x, COPY1.y],
    [230, TM_CLICK.x, TM_CLICK.y],
    [240, TM_CLICK.x, TM_CLICK.y],
    [254, PASTE_ITEM.x, PASTE_ITEM.y],
    [272, PASTE_ITEM.x, PASTE_ITEM.y],
    [302, NOTE_SEL.x0, NOTE_SEL.y],
    [306, NOTE_SEL.x0, NOTE_SEL.y],
    [316, NOTE_SEL.x1, NOTE_SEL.y],
    [320, NOTE_SEL.x1, NOTE_SEL.y],
    [324, COPY2.x, COPY2.y],
    [332, COPY2.x, COPY2.y],
    [348, TM_CLICK.x, TM_CLICK.y],
    [352, TM_CLICK.x, TM_CLICK.y],
    [357, PASTE_ITEM.x, PASTE_ITEM.y],
    [366, PASTE_ITEM.x, PASTE_ITEM.y],
    [382, 660, 380], // hunting through the markdown window…
    [396, ERR_SEL.x0, ERR_SEL.y1],
    [398, ERR_SEL.x0, ERR_SEL.y1],
    [408, 770, ERR_SEL.y2 - 5],
    [411, 770, ERR_SEL.y2 - 5],
    [414, COPY3.x, COPY3.y],
    [420, COPY3.x, COPY3.y],
    [432, TM_CLICK.x, TM_CLICK.y],
    [438, PASTE_ITEM.x, PASTE_ITEM.y],
    [10000, PASTE_ITEM.x, PASTE_ITEM.y],
  ];
  const cursorX = interpolate(f, wp.map((w) => w[0]), wp.map((w) => w[1]), CLAMP);
  const cursorY = interpolate(f, wp.map((w) => w[0]), wp.map((w) => w[2]), CLAMP);
  const clickPulse = Math.max(
    ...MENU_CLICKS.map((c) => interpolate(f, [c - 0.01, c, c + 9], [0, 1, 0], CLAMP)),
  );

  // ——— HUD tallies: fade in when the montage speeds up ———
  const countPast = (events: number[]) => events.filter((e) => f >= e).length;
  const popScale = (events: number[]) => {
    let p = 0;
    for (const e of events) p = Math.max(p, interpolate(f, [e - 0.01, e + 1, e + 14], [0, 1, 0], CLAMP));
    return 1 + p * 0.25;
  };
  const hudOpacity =
    interpolate(f, [SWITCH_F[1], SWITCH_F[1] + 12], [0, 1], CLAMP) *
    (1 - interpolate(f, [FREEZE_AT + FREEZE_HOLD, FREEZE_AT + FREEZE_HOLD + 12], [0, 1], CLAMP));

  // ——— Freeze → dim → lines ———
  const overlayOpacity = interpolate(f, [FREEZE_AT + FREEZE_HOLD, FREEZE_AT + FREEZE_HOLD + OVERLAY_DUR], [0, 0.88], CLAMP);
  const cursorVisible = windowsIn > 0.9 && f < FREEZE_AT + FREEZE_HOLD;

  const monoStyle: CSSProperties = { fontFamily: "SF Mono, Menlo, monospace" };

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", fontFamily: FONT_STACK }}>
      <MacDesktopWallpaper />

      {/* ——— Markdown bug log ——— */}
      <div style={windowBase(MD, "md")}>
        <MacMenuBar
          appName="Bug 记录.md"
          menus={MD_MENUS}
          activeMenu={drop1Opacity > 0.4 ? "文件" : undefined}
          width={MD.w}
          embedded
          trafficLights
        />
        <div style={{ padding: "26px 44px", fontSize: 20, lineHeight: "36px", color: "#334155", ...monoStyle }}>
          <div style={{ fontWeight: 700, color: "#0f172a" }}># Bug 记录</div>
          <div style={{ whiteSpace: "pre" }}>
            <span style={sel1 > 0 ? selectionStyle(sel1) : undefined}>{BUG_TEXT}</span>
          </div>
          <div>- 深色模式下预览闪烁</div>
        </div>
        <div style={veil("md")} />
      </div>

      {/* ——— Sticky note (新需求) ——— */}
      <div
        style={{
          ...windowBase(NOTE, "note"),
          background: "linear-gradient(180deg, #fdf3a4 0%, #f6e27e 100%)",
          border: "1px solid rgba(120,100,20,0.18)",
        }}
      >
        <div style={{ height: 26, background: "rgba(120,100,20,0.10)" }} />
        <div style={{ padding: "20px 24px", color: "#5b4a12" }}>
          <div style={{ fontSize: 22, fontWeight: 760, marginBottom: 14 }}>新需求</div>
          <div style={{ fontSize: 20, fontWeight: 550, lineHeight: "34px" }}>
            <span style={noteSel > 0 ? selectionStyle(noteSel) : undefined}>{NOTE_TEXT}</span>
          </div>
        </div>
        <div style={veil("note")} />
      </div>

      {/* ——— Code editor with BUILT-IN terminal showing the run error ——— */}
      <div style={windowBase(CODE, "code")}>
        <div style={headerRowStyle(false)}>
          <TrafficDots />
          <span style={{ marginLeft: 14, fontSize: 16, fontWeight: 650, color: theme.colors.muted }}>export.ts — 代码编辑器</span>
        </div>
        {/* Code (background context only) */}
        <div style={{ padding: "14px 28px", fontSize: 15, lineHeight: "26px", color: "#334155", ...monoStyle }}>
          <div><span style={{ color: "#94a3b8" }}>10  </span><span style={{ color: "#7c3aed" }}>export function</span> exportPresets(groups) {"{"}</div>
          <div><span style={{ color: "#94a3b8" }}>11  </span>{"  "}<span style={{ color: "#7c3aed" }}>const</span> payload = groups.map(toJSON);</div>
          <div><span style={{ color: "#94a3b8" }}>12  </span>{"  "}<span style={{ color: "#7c3aed" }}>return</span> save(<span style={{ color: "#16a34a" }}>"presets.json"</span>, payload);</div>
        </div>
        {/* Built-in terminal — the star of this window */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 140,
            bottom: 0,
            background: "#171b24",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            padding: "14px 28px",
            fontSize: 16,
            lineHeight: "30px",
            ...monoStyle,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 650, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", marginBottom: 8 }}>
            终端 — zsh
          </div>
          <div style={{ color: "#c9d1d9" }}>$ npm run export</div>
          <div style={{ color: "#ff6b6b", fontWeight: 700 }}>
            <span style={errSel > 0 ? selectionStyle(Math.min(1, errSel * 1.6)) : undefined}>{ERR_LINE_1}</span>
          </div>
          <div style={{ color: "#ff6b6b", opacity: 0.85, whiteSpace: "pre" }}>
            <span style={errSel > 0.5 ? selectionStyle(Math.min(1, (errSel - 0.5) * 2)) : undefined}>{ERR_LINE_2}</span>
          </div>
        </div>
        <div style={veil("code")} />
      </div>

      {/* ——— Claude Code terminal — where everything has to end up ——— */}
      <div
        style={{
          ...windowBase(TM, "tm"),
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
              padding: "14px 22px",
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
            <span style={{ fontSize: 13, color: theme.colors.darkMuted, ...monoStyle }}>~/项目文档 · 准备就绪</span>
          </div>

          {/* Collected pieces pile up here, one窗口 at a time */}
          <div style={{ flex: 1, padding: "16px 4px", fontSize: 15, color: "rgba(201,209,217,0.72)", display: "flex", flexDirection: "column", gap: 9, ...monoStyle }}>
            {history.map((line, i) => (
              <span key={i}>
                <span style={{ color: "#7ee787" }}>❯ </span>
                {line}
              </span>
            ))}
          </div>

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
              fontSize: 16,
              ...monoStyle,
            }}
          >
            <span style={{ color: "#7ee787" }}>❯</span>
            <span style={{ color: "#e8ecf3" }}>
              {inputText}
              {caretOn ? <span style={{ color: "#e8ecf3" }}>▏</span> : null}
            </span>
          </div>
        </div>
        <div style={veil("tm", true)} />
      </div>

      {/* ——— Menus (z above all windows) ——— */}
      <div style={{ position: "absolute", left: DROP1_LEFT, top: DROP1_TOP, opacity: drop1Opacity, zIndex: 46, transform: `translateY(${(1 - drop1Opacity) * 6}px)` }}>
        <MacContextMenu
          width={210}
          items={[
            { label: "新建", shortcut: "⌘N" },
            { label: "打开…", shortcut: "⌘O" },
            { label: "保存", shortcut: "⌘S", selected: f >= 132 },
            { label: "导出为 PDF…" },
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: CTX1.left, top: CTX1.top, opacity: ctx1Opacity, zIndex: 46 }}>
        <MacContextMenu
          width={170}
          items={[
            { label: "剪切", shortcut: "⌘X" },
            { label: "拷贝", shortcut: "⌘C", selected: f >= 190 },
            { label: "粘贴", shortcut: "⌘V" },
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: CTX_NOTE.left, top: CTX_NOTE.top, opacity: ctxNoteOpacity, zIndex: 46 }}>
        <MacContextMenu width={130} items={[{ label: "拷贝", shortcut: "⌘C", selected: f >= 326 }]} />
      </div>
      <div style={{ position: "absolute", left: CTX_CODE.left, top: CTX_CODE.top, opacity: ctxCodeOpacity, zIndex: 46 }}>
        <MacContextMenu width={130} mode="dark" items={[{ label: "拷贝", shortcut: "⌘C", selected: f >= 414 }]} />
      </div>
      {[
        { opacity: ctxTm1Opacity, sel: 260 },
        { opacity: ctxTm2Opacity, sel: 358 },
        { opacity: ctxTm3Opacity, sel: 440 },
      ].map(({ opacity, sel }, i) =>
        opacity > 0 ? (
          <div key={i} style={{ position: "absolute", left: CTX_TM.left, top: CTX_TM.top, opacity, zIndex: 46 }}>
            <MacContextMenu
              width={150}
              mode="dark"
              items={[
                { label: "拷贝", shortcut: "⌘C" },
                { label: "粘贴", shortcut: "⌘V", selected: f >= sel },
              ]}
            />
          </div>
        ) : null,
      )}

      {/* ——— HUD tallies — appear once the montage speeds up ——— */}
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
        <HudCounter label="菜单点击" count={countPast(MENU_CLICKS)} scale={popScale(MENU_CLICKS)} />
        <span style={{ fontSize: 22, color: "rgba(255,255,255,0.35)" }}>·</span>
        <HudCounter label="窗口切换" count={countPast(SWITCH_EVENTS)} scale={popScale(SWITCH_EVENTS)} />
      </div>

      {cursorVisible ? <Cursor x={cursorX} y={cursorY} clickPulse={clickPulse} /> : null}

      {/* ——— Freeze → dim → the lines land ——— */}
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
          startFrame={TEXT_START + (action - 40)}
          lineStagger={30}
        />
        {/* 结论句：与上方同字号，单行 + 品牌渐变 */}
        <PromoText
          lines={["常用的操作，应该就在手边。"]}
          mode="dark"
          align="center"
          size={92}
          gradient
          maxWidth={1680}
          startFrame={HANDY_START + (action - 40)}
        />
      </div>
    </div>
  );
};
