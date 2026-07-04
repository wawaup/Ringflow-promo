import type { CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { MacContextMenu } from "../MacUI/MacContextMenu";
import { MacMenuBar, menuTabLeft } from "../MacUI/MacMenuBar";
import { MacDesktopWallpaper } from "../Background/MacDesktopWallpaper";
import { PromoText } from "../Text/PromoText";
import { theme } from "../../config/theme";
import { sceneCopy } from "../../config/copy";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Shared window slot — Finder, the editor, and Terminal all take over this one spot in turn. */
const WIN_LEFT = 360;
const WIN_TOP = 130;
const WIN_W = 1200;
const WIN_H = 780;
/** One merged header row height, shared by every window: traffic lights + title/menu live on it together. */
const HEADER_H = 40;
const CONTENT_TOP = WIN_TOP + HEADER_H;
const CONTENT_LEFT = WIN_LEFT + 46;
const CONTENT_PAD_TOP = 30;

/** Persistent terminal input box — fixed coordinates so the right-click/paste can target it directly. */
const INPUT_BOX_H = 56;
const INPUT_BOX_BOTTOM_PAD = 24;
const INPUT_BOX_TOP = WIN_TOP + WIN_H - INPUT_BOX_BOTTOM_PAD - INPUT_BOX_H;
const INPUT_BOX_CENTER_Y = INPUT_BOX_TOP + INPUT_BOX_H / 2;
/** ctx2 (paste) menu height: MacContextMenu = 5px padding + 2×28px rows + 5px padding, no separator. */
const CTX2_MENU_HEIGHT = 66;

const EDIT_MENUS = ["文件", "编辑", "格式", "窗口"];
const EDIT_INDEX = EDIT_MENUS.indexOf("编辑");
const DROPDOWN_LEFT = WIN_LEFT + menuTabLeft(EDIT_INDEX, true) - 8;
const DROPDOWN_TOP = WIN_TOP + HEADER_H + 4;
const DROPDOWN_WIDTH = 220;

/** Center of the yellow traffic-light dot — the minimize "genie" scales toward this point. */
const MINIMIZE_DOT = { x: WIN_LEFT + 46, y: WIN_TOP + HEADER_H / 2 };

const ICON_FOLDER = { x: 1780, y: 170 };
const ICON_TERMINAL = { x: 1780, y: 320 };

const NOTE_LINES = ["1. 订阅到期自动提醒", "2. 支持预设分组导出", "3. 批量导出配置项"];
const NOTE_FONT_SIZE = 20;
const LINE_HEIGHT = 36;
const SELECT_LINE_INDEX = 1; // "2. 支持预设分组导出" — the single source of truth for copy/paste text.
const SELECTED_LINE_TEXT = NOTE_LINES[SELECT_LINE_INDEX];

/** Reveal a multi-line string progressively, character by character (a typing / paste effect). */
const revealText = (full: string, progress: number) => {
  const n = Math.max(0, Math.min(full.length, Math.floor(full.length * progress)));
  return full.slice(0, n);
};

/** Reveal several lines together (as one continuous typing pass), returning each line's own partial text. */
const revealLines = (lines: string[], progress: number) => {
  const total = lines.reduce((sum, l) => sum + l.length + 1, 0) - 1;
  const revealedChars = Math.max(0, Math.min(total, Math.floor(total * progress)));
  let consumed = 0;
  let activeIndex = lines.length - 1;
  const shown = lines.map((line, i) => {
    const remaining = revealedChars - consumed;
    const clipped = line.slice(0, Math.max(0, Math.min(line.length, remaining)));
    if (remaining < line.length && activeIndex === lines.length - 1) activeIndex = i;
    consumed += line.length + 1;
    return clipped;
  });
  return { shown, activeIndex };
};

/** Rough on-screen width of mixed CJK/ASCII text at a given font size — good enough to steer a cursor or menu, not to paint a pixel-exact highlight (the real highlight is painted directly behind the rendered text). */
const estimateTextWidth = (text: string, fontSize: number) => {
  let w = 0;
  for (const ch of text) {
    w += /[　-〿㐀-鿿＀-￯]/.test(ch) ? fontSize * 1.02 : fontSize * 0.6;
  }
  return w;
};

const SELECT_LINE_Y = CONTENT_TOP + CONTENT_PAD_TOP + SELECT_LINE_INDEX * LINE_HEIGHT;
const SELECT_WIDTH_EST = estimateTextWidth(SELECTED_LINE_TEXT, NOTE_FONT_SIZE);

/** Ordered (name, durationInFrames) pairs — the whole friction montage, one step at a time. */
const STAGE_DURATIONS: Array<[string, number]> = [
  ["iconBounce", 16],
  ["finderOpen", 28],
  ["finderHold", 16],
  ["fileBounce", 16],
  ["crossfade", 22],
  ["typing", 46],
  ["postTypeHold", 8],
  ["dropdownOpen", 18],
  ["dropdownHold", 8],
  ["saveClick", 10],
  ["dropdownClose", 16],
  ["preSelectHold", 8],
  ["dragSelect", 20],
  ["postSelectHold", 8],
  ["ctx1Open", 14],
  ["ctx1Hold", 8],
  ["copyClick", 10],
  ["ctx1Close", 14],
  ["preMinHold", 8],
  ["minClick", 8],
  ["minShrink", 18],
  ["desktopHold", 6],
  ["termIconBounce", 14],
  ["termOpen", 20],
  ["termHold", 8],
  ["ctx2Open", 14],
  ["ctx2Hold", 8],
  ["pasteClick", 10],
  ["ctx2Close", 12],
  ["pasteReveal", 20],
  ["postPasteHold", 6],
  ["overlayFade", 18],
  ["textReveal", 36],
  ["textHold", 52],
  ["handyReveal", 40],
  ["finalHold", 60],
];

type Stage = { start: number; end: number };

const buildStages = (base: number): Record<string, Stage> => {
  const at: Record<string, Stage> = {};
  let cursor = base;
  for (const [name, dur] of STAGE_DURATIONS) {
    at[name] = { start: cursor, end: cursor + dur };
    cursor += dur;
  }
  return at;
};

/** Total frame span consumed from `action` to the end of the montage — drives timeline.ts duration. */
export const FRICTION_ACTION_SPAN = STAGE_DURATIONS.reduce((sum, [, dur]) => sum + dur, 0);

const DesktopIcon = ({
  x,
  y,
  label,
  kind,
  selected,
  scale = 1,
  opacity = 1,
}: {
  x: number;
  y: number;
  label: string;
  kind: "folder" | "terminal";
  selected: boolean;
  scale?: number;
  opacity?: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 120,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      opacity,
      transform: `translate(-50%, -50%) scale(${scale})`,
    }}
  >
    {kind === "folder" ? (
      <div style={{ fontSize: 56, lineHeight: 1 }}>📁</div>
    ) : (
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 13,
          background: "linear-gradient(160deg, #2b2f38 0%, #14161c 100%)",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 6px 14px rgba(10,15,25,0.28)",
        }}
      >
        <span style={{ color: "#7ee787", fontFamily: "SF Mono, Menlo, monospace", fontSize: 19, fontWeight: 700 }}>&gt;_</span>
      </div>
    )}
    <span
      style={{
        fontSize: 14,
        fontWeight: 600,
        color: "#ffffff",
        textShadow: "0 1px 3px rgba(0,0,0,0.55)",
        padding: "1px 8px",
        borderRadius: 4,
        background: selected ? "rgba(47,127,211,0.85)" : "transparent",
      }}
    >
      {label}
    </span>
  </div>
);

/** A mac-style arrow pointer that travels between click targets, with a ripple pulse on click. */
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

const windowChromeStyle: CSSProperties = {
  position: "absolute",
  left: WIN_LEFT,
  top: WIN_TOP,
  width: WIN_W,
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: theme.shadow.panel,
  border: "1px solid rgba(255,255,255,0.76)",
  background: theme.colors.glassLight,
  backdropFilter: "blur(28px)",
};

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

/**
 * FrictionWorkflow — the film's opening friction montage, one concrete task start to finish, at
 * full desktop scale: open a new note from Finder, type it up, save it via the menu, select and
 * copy a line, minimize, then paste it into a Claude-Code-style terminal — all through menu-hunting
 * and window-switching. Ends with the desktop dimming and the scene's own headline fading in.
 */
export const FrictionWorkflow = ({
  choreography,
}: {
  choreography?: { actionStartFrame?: number };
} = {}) => {
  const frame = useCurrentFrame();
  const action = choreography?.actionStartFrame ?? 50;
  const at = buildStages(action);

  // Desktop icons — visible until a window covers them, then revealed again after minimize.
  const folderBouncePulse = interpolate(
    frame,
    [at.iconBounce.start, at.iconBounce.start + 6, at.iconBounce.end],
    [1, 0.9, 1.06],
    CLAMP,
  );
  const folderSelected = frame >= at.iconBounce.start;
  const termIconPulse = interpolate(
    frame,
    [at.termIconBounce.start, at.termIconBounce.start + 6, at.termIconBounce.end],
    [1, 0.9, 1.06],
    CLAMP,
  );
  const termIconSelected = frame >= at.termIconBounce.start;

  // Finder — opens, holds, then hands off to the editor.
  const finderIn = interpolate(frame, [at.finderOpen.start, at.finderOpen.end], [0, 1], CLAMP);
  const finderOut = interpolate(frame, [at.crossfade.start, at.crossfade.end], [1, 0], CLAMP);
  const finderOpacity = finderIn * finderOut;
  const fileSelected = frame >= at.fileBounce.start - 6;
  const fileBouncePulse = interpolate(
    frame,
    [at.fileBounce.start - 6, at.fileBounce.start, at.fileBounce.end],
    [1, 0.94, 1.05],
    CLAMP,
  );

  // Editor — fades in as Finder hands off; blank at first, then types itself out.
  const editorIn = interpolate(frame, [at.crossfade.start, at.crossfade.end], [0, 1], CLAMP);
  const minShrink = interpolate(frame, [at.minShrink.start, at.minShrink.end], [0, 1], CLAMP);
  const editorOpacity = editorIn * (1 - minShrink);
  const minimizePulse = interpolate(frame, [at.minClick.start, at.minClick.start + 4, at.minClick.end], [0, 1, 0], CLAMP);

  const typingProgress = interpolate(frame, [at.typing.start, at.typing.end], [0, 1], CLAMP);
  const { shown: typedLines, activeIndex: typingActiveIndex } = revealLines(NOTE_LINES, typingProgress);
  const caretOn = typingProgress < 1 && Math.floor(frame / 15) % 2 === 0;

  // Menu hunt — open "编辑", land on "保存".
  const dropdownIn = interpolate(frame, [at.dropdownOpen.start, at.dropdownOpen.end], [0, 1], CLAMP);
  const dropdownOut = interpolate(frame, [at.dropdownClose.start, at.dropdownClose.end], [1, 0], CLAMP);
  const dropdownOpacity = dropdownIn * dropdownOut;
  const editMenuActive = dropdownOpacity > 0.4;
  const saveSelected = frame >= at.saveClick.start;

  // Drag-select the second line, then right-click to copy.
  const selectProgress = interpolate(frame, [at.dragSelect.start, at.dragSelect.end], [0, 1], CLAMP);
  const ctx1In = interpolate(frame, [at.ctx1Open.start, at.ctx1Open.end], [0, 1], CLAMP);
  const ctx1Out = interpolate(frame, [at.ctx1Close.start, at.ctx1Close.end], [1, 0], CLAMP);
  const ctx1Opacity = ctx1In * ctx1Out;
  const copySelected = frame >= at.copyClick.start;

  // Terminal — opens once the editor has minimized away.
  const terminalOpacity = interpolate(frame, [at.termOpen.start, at.termOpen.end], [0, 1], CLAMP);
  const ctx2In = interpolate(frame, [at.ctx2Open.start, at.ctx2Open.end], [0, 1], CLAMP);
  const ctx2Out = interpolate(frame, [at.ctx2Close.start, at.ctx2Close.end], [1, 0], CLAMP);
  const ctx2Opacity = ctx2In * ctx2Out;
  const pasteSelected = frame >= at.pasteClick.start;
  const pasteProgress = interpolate(frame, [at.pasteReveal.start, at.pasteReveal.end], [0, 1], CLAMP);
  const pastedText = revealText(SELECTED_LINE_TEXT, pasteProgress);
  const inputCaretOn = Math.floor(frame / 15) % 2 === 0;

  // Closing beat — the desktop dims and the scene's own headline fades in on top.
  const overlayOpacity = interpolate(frame, [at.overlayFade.start, at.overlayFade.end], [0, 0.74], CLAMP);

  const iconsOpacity = 1 - Math.max(finderOpacity, editorOpacity, terminalOpacity);

  // Cursor path — one waypoint per click, with a brief travel/settle beat before each.
  const ctx1Left = CONTENT_LEFT + SELECT_WIDTH_EST + 40;
  const ctx1Top = SELECT_LINE_Y + LINE_HEIGHT + 10;
  // Right-click lands on the input box itself, near the caret, so paste reads as "into the thing I'm about to use".
  const termClickX = CONTENT_LEFT + 60;
  const termClickY = INPUT_BOX_CENTER_Y;
  const ctx2Left = termClickX;
  // Menu opens upward — the click sits near the window's bottom edge, mirroring how macOS flips context menus near edges.
  const ctx2Top = termClickY - CTX2_MENU_HEIGHT - 8;
  const waypoints: Array<{ frame: number; x: number; y: number }> = [
    { frame: action - 14, x: ICON_FOLDER.x, y: ICON_FOLDER.y },
    { frame: at.iconBounce.start, x: ICON_FOLDER.x, y: ICON_FOLDER.y },
    { frame: at.finderOpen.end, x: CONTENT_LEFT + 60, y: CONTENT_TOP + 50 },
    { frame: at.fileBounce.start, x: CONTENT_LEFT + 60, y: CONTENT_TOP + 50 },
    { frame: at.dropdownOpen.start - 6, x: WIN_LEFT + menuTabLeft(EDIT_INDEX, true) + 20, y: WIN_TOP + 20 },
    { frame: at.dropdownOpen.start, x: WIN_LEFT + menuTabLeft(EDIT_INDEX, true) + 20, y: WIN_TOP + 20 },
    { frame: at.saveClick.start - 4, x: DROPDOWN_LEFT + 80, y: DROPDOWN_TOP + 130 },
    { frame: at.saveClick.start, x: DROPDOWN_LEFT + 80, y: DROPDOWN_TOP + 130 },
    { frame: at.dragSelect.start, x: CONTENT_LEFT + 4, y: SELECT_LINE_Y + 16 },
    { frame: at.dragSelect.end, x: CONTENT_LEFT + SELECT_WIDTH_EST, y: SELECT_LINE_Y + 16 },
    { frame: at.ctx1Open.start, x: CONTENT_LEFT + SELECT_WIDTH_EST, y: SELECT_LINE_Y + 16 },
    { frame: at.copyClick.start - 4, x: ctx1Left + 50, y: ctx1Top + 30 },
    { frame: at.copyClick.start, x: ctx1Left + 50, y: ctx1Top + 30 },
    { frame: at.minClick.start - 8, x: MINIMIZE_DOT.x, y: MINIMIZE_DOT.y },
    { frame: at.minClick.start, x: MINIMIZE_DOT.x, y: MINIMIZE_DOT.y },
    { frame: at.termIconBounce.start - 8, x: ICON_TERMINAL.x, y: ICON_TERMINAL.y },
    { frame: at.termIconBounce.start, x: ICON_TERMINAL.x, y: ICON_TERMINAL.y },
    { frame: at.ctx2Open.start - 8, x: termClickX, y: termClickY },
    { frame: at.ctx2Open.start, x: termClickX, y: termClickY },
    { frame: at.pasteClick.start - 4, x: ctx2Left + 50, y: ctx2Top + 30 },
    { frame: at.pasteClick.start, x: ctx2Left + 50, y: ctx2Top + 30 },
  ];
  const wpFrames = waypoints.map((w) => w.frame);
  const wpX = waypoints.map((w) => w.x);
  const wpY = waypoints.map((w) => w.y);
  const cursorX = interpolate(frame, wpFrames, wpX, CLAMP);
  const cursorY = interpolate(frame, wpFrames, wpY, CLAMP);
  const cursorPulse = Math.max(
    interpolate(frame, [at.iconBounce.start, at.iconBounce.start + 10], [1, 0], CLAMP),
    interpolate(frame, [at.fileBounce.start, at.fileBounce.start + 10], [1, 0], CLAMP),
    interpolate(frame, [at.saveClick.start, at.saveClick.start + 10], [1, 0], CLAMP),
    interpolate(frame, [at.copyClick.start, at.copyClick.start + 10], [1, 0], CLAMP),
    interpolate(frame, [at.minClick.start, at.minClick.start + 10], [1, 0], CLAMP),
    interpolate(frame, [at.termIconBounce.start, at.termIconBounce.start + 10], [1, 0], CLAMP),
    interpolate(frame, [at.pasteClick.start, at.pasteClick.start + 10], [1, 0], CLAMP),
  );
  const cursorVisible = frame >= action - 14 && frame < at.overlayFade.start;

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden" }}>
      <MacDesktopWallpaper />

      {/* Desktop — the two things this whole task bounces between. */}
      <DesktopIcon x={ICON_FOLDER.x} y={ICON_FOLDER.y} label="项目文档" kind="folder" selected={folderSelected} scale={folderBouncePulse} opacity={iconsOpacity} />
      <DesktopIcon x={ICON_TERMINAL.x} y={ICON_TERMINAL.y} label="终端" kind="terminal" selected={termIconSelected} scale={termIconPulse} opacity={iconsOpacity} />

      {/* Finder — opened by double-clicking the folder; a new markdown file waits inside. */}
      <div style={{ ...windowChromeStyle, opacity: finderOpacity }}>
        <div style={headerRowStyle(false)}>
          <TrafficDots />
          <span style={{ marginLeft: 14, fontSize: 16, fontWeight: 650, color: theme.colors.muted }}>访达 — 项目文档</span>
        </div>
        <div style={{ padding: "30px 46px", display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 8,
              transform: `scale(${fileBouncePulse})`,
              background: fileSelected ? "rgba(47,127,211,0.14)" : "transparent",
            }}
          >
            <span style={{ fontSize: 28 }}>📄</span>
            <span style={{ fontSize: 18, fontWeight: 600, color: fileSelected ? theme.colors.accentBlue : theme.colors.ink }}>新建文稿.md</span>
          </span>
        </div>
      </div>

      {/* Text editor — traffic lights and menu tabs share one merged header row. */}
      <div
        style={{
          ...windowChromeStyle,
          opacity: editorOpacity,
          transform: `scale(${1 - minShrink * 0.94})`,
          transformOrigin: `${MINIMIZE_DOT.x - WIN_LEFT}px ${MINIMIZE_DOT.y - WIN_TOP}px`,
        }}
      >
        <MacMenuBar
          appName="文本编辑"
          menus={EDIT_MENUS}
          activeMenu={editMenuActive ? "编辑" : undefined}
          width={WIN_W}
          embedded
          trafficLights
          minimizePulse={minimizePulse}
        />
        <div style={{ height: WIN_H - HEADER_H, padding: `${CONTENT_PAD_TOP}px 46px`, boxSizing: "border-box", position: "relative" }}>
          <div style={{ position: "relative", fontFamily: "SF Mono, Menlo, monospace", fontSize: NOTE_FONT_SIZE, color: "#334155", lineHeight: `${LINE_HEIGHT}px` }}>
            {NOTE_LINES.map((line, i) => (
              <div key={line} style={{ whiteSpace: "pre" }}>
                {i === SELECT_LINE_INDEX && selectProgress > 0 ? (
                  <span
                    style={{
                      display: "inline-block",
                      background: `linear-gradient(90deg, rgba(47,127,211,0.32) ${selectProgress * 100}%, transparent ${selectProgress * 100}%)`,
                      borderRadius: 2,
                    }}
                  >
                    {typedLines[i]}
                  </span>
                ) : (
                  <span>{typedLines[i]}</span>
                )}
                {i === typingActiveIndex && caretOn ? <span style={{ color: theme.colors.accentBlue }}>▏</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dropdown from "编辑" — hugs the tab directly, so it reads as opening from that button. */}
      <div style={{ position: "absolute", left: DROPDOWN_LEFT, top: DROPDOWN_TOP, opacity: dropdownOpacity, transform: `translateY(${(1 - dropdownIn) * 8}px)` }}>
        <MacContextMenu
          width={DROPDOWN_WIDTH}
          items={[
            { label: "剪切", shortcut: "⌘X" },
            { label: "拷贝", shortcut: "⌘C" },
            { label: "粘贴", shortcut: "⌘V" },
            { label: "保存", shortcut: "⌘S", separatorBefore: true, selected: saveSelected },
          ]}
        />
      </div>

      {/* Right-click menu after the drag-select — landing on "拷贝". */}
      <div style={{ position: "absolute", left: ctx1Left, top: ctx1Top, opacity: ctx1Opacity, transform: `translateY(${(1 - ctx1In) * 8}px)` }}>
        <MacContextMenu
          width={170}
          items={[
            { label: "剪切", shortcut: "⌘X" },
            { label: "拷贝", shortcut: "⌘C", selected: copySelected },
            { label: "粘贴", shortcut: "⌘V" },
          ]}
        />
      </div>

      {/* Terminal — a Claude-Code-style CLI: brand banner up top, persistent input box at the bottom. */}
      <div
        style={{
          ...windowChromeStyle,
          opacity: terminalOpacity,
          background: "rgba(20, 24, 34, 0.96)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div style={headerRowStyle(true)}>
          <TrafficDots />
          <span style={{ marginLeft: 14, fontSize: 15, fontWeight: 600, color: theme.colors.darkMuted }}>Claude Code — 项目文档</span>
        </div>
        <div style={{ height: WIN_H - HEADER_H, padding: "24px 28px", boxSizing: "border-box", position: "relative", display: "flex", flexDirection: "column" }}>
          {/* Brand banner */}
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 12,
              padding: "20px 24px",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20, color: "#e0a3ff" }}>✳</span>
              <span style={{ fontSize: 19, fontWeight: 700, color: "#f4f6fb" }}>Claude Code</span>
            </div>
            <span style={{ fontSize: 14, color: theme.colors.darkMuted, fontFamily: "SF Mono, Menlo, monospace" }}>~/项目文档 · 准备就绪</span>
          </div>

          {/* Scrollback — empty, this is the start of a fresh session. */}
          <div style={{ flex: 1, padding: "22px 4px", fontFamily: "SF Mono, Menlo, monospace", fontSize: 15, color: "rgba(201,209,217,0.55)" }}>
            右键粘贴需求，直接交给 Claude Code 处理
          </div>

          {/* Persistent input box — the paste lands here, never on a raw shell prompt. Absolutely positioned so the right-click math above stays locked to the visual. */}
          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              top: INPUT_BOX_TOP - CONTENT_TOP,
              height: INPUT_BOX_H,
              boxSizing: "border-box",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 12,
              padding: "0 20px",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "SF Mono, Menlo, monospace",
              fontSize: 17,
            }}
          >
            <span style={{ color: "#7ee787" }}>❯</span>
            <span style={{ color: "#e8ecf3" }}>
              {pastedText}
              {inputCaretOn ? <span style={{ color: "#e8ecf3" }}>▏</span> : null}
            </span>
          </div>
        </div>
      </div>

      {/* Right-click menu in the Terminal's scrollback — landing on "粘贴", which fills the input box. */}
      <div style={{ position: "absolute", left: ctx2Left, top: ctx2Top, opacity: ctx2Opacity, transform: `translateY(${(1 - ctx2In) * 8}px)` }}>
        <MacContextMenu
          width={150}
          mode="dark"
          items={[
            { label: "拷贝", shortcut: "⌘C" },
            { label: "粘贴", shortcut: "⌘V", selected: pasteSelected },
          ]}
        />
      </div>

      {cursorVisible ? <Cursor x={cursorX} y={cursorY} clickPulse={cursorPulse} /> : null}

      {/* Closing beat — dim the whole desktop, settle on the scene's own headline, then reveal
          the "turn" beat directly beneath it (folded in here instead of its own scene) before
          cutting straight to the Ringflow reveal. */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(6,8,14,1)", opacity: overlayOpacity, pointerEvents: "none" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
        }}
      >
        {/* 三行痛点，按时间顺序逐行落地（每行间隔 30 帧），而不是一次性同时出现。 */}
        <PromoText
          lines={sceneCopy.friction.headline}
          mode="dark"
          align="center"
          size={92}
          startFrame={at.textReveal.start}
          lineStagger={30}
        />
        {/* 结论句：与上方同字号，单行 + 品牌渐变，作为整镜的落点强调。 */}
        <PromoText
          lines={["常用的操作，应该就在手边。"]}
          mode="dark"
          align="center"
          size={92}
          gradient
          maxWidth={1680}
          startFrame={at.handyReveal.start}
        />
      </div>
    </div>
  );
};
