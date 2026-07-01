import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Img, staticFile } from "remotion";
import { assets } from "../../config/assets";
import { theme } from "../../config/theme";
import { RingflowWheel } from "../Wheel/RingflowWheel";

type Mode = "light" | "dark";

const panel = (mode: Mode = "light") => {
  const dark = mode === "dark";
  return {
    background: dark ? "rgba(20, 29, 44, 0.82)" : "rgba(255, 255, 255, 0.78)",
    border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.78)",
    color: dark ? theme.colors.darkInk : theme.colors.ink,
    boxShadow: dark
      ? "0 24px 70px rgba(0, 0, 0, 0.28), 0 2px 12px rgba(0, 0, 0, 0.18)"
      : theme.shadow.panel,
    backdropFilter: "blur(26px)",
  } as const;
};

const reveal = (frame: number, start: number, duration = 22) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const sceneWindowVisibility = (frame: number, start: number, end: number, fade = 18) => {
  const enter = reveal(frame, start, fade);
  const exit = interpolate(frame, [end - fade, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return Math.min(enter, exit);
};

const KeyCombo = ({
  combo,
  visible,
  x,
  y,
}: {
  combo: string[];
  visible: number;
  x: number;
  y: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      display: "flex",
      gap: 10,
      alignItems: "center",
      opacity: visible,
      transform: `translateY(${(1 - visible) * 10}px)`,
      filter: "drop-shadow(0 10px 24px rgba(30,45,70,0.16))",
    }}
  >
    {combo.map((key, index) => (
      <div
        key={`${key}-${index}`}
        style={{
          minWidth: key.length > 1 ? 92 : 54,
          height: 48,
          padding: "0 16px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(148,163,184,0.30)",
          display: "grid",
          placeItems: "center",
          color: "#243044",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif',
          fontSize: 23,
          fontWeight: 780,
          letterSpacing: 0,
        }}
      >
        {key}
      </div>
    ))}
  </div>
);

const DockIcon = ({
  label,
  active,
  x,
  y,
}: {
  label: string;
  active: number;
  x: number;
  y: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 78,
      display: "grid",
      justifyItems: "center",
      gap: 8,
      opacity: 0.92,
      transform: `translateY(${-active * 9}px) scale(${1 + active * 0.08})`,
    }}
  >
    <div
      style={{
        width: 58,
        height: 58,
        borderRadius: 16,
        background:
          label === "便签"
            ? "linear-gradient(180deg, #fff6bf, #f7d865)"
            : "linear-gradient(180deg, #f8fbff, #dce9f7)",
        border: "1px solid rgba(255,255,255,0.75)",
        boxShadow: active > 0.1 ? "0 18px 36px rgba(47,127,211,0.24)" : "0 10px 28px rgba(30,45,70,0.13)",
        display: "grid",
        placeItems: "center",
        color: "#344155",
        fontSize: 26,
        fontWeight: 860,
      }}
    >
      {label === "便签" ? "纪" : "提"}
    </div>
    <div style={{ fontSize: 15, fontWeight: 700, color: "#64748b" }}>{label}</div>
  </div>
);

export const InterruptedWorkflowWorkspace = ({
  choreography,
}: {
  choreography: {
    pageStartFrame?: number;
    pageReadyFrame?: number;
    codexInputStartFrame?: number;
    codexMainStartFrame?: number;
    noteStartFrame?: number;
    stickyOpenFrame?: number;
    noteCopyFrame?: number;
    notePasteFrame?: number;
    promptOpenFrame?: number;
    promptCopyFrame?: number;
    promptPasteFrame?: number;
    holdStartFrame?: number;
  };
}) => {
  const frame = useCurrentFrame();

  const realPrompts = [
    {
      title: "总结提炼",
      content: "请阅读以上内容，提炼核心信息，用清晰有条理的方式总结，并列出最重要的几个要点。",
    },
    {
      title: "润色改写",
      content: "请帮我润色这段文字，让表达更清晰、自然，保持原意不变，适合日常阅读和使用。",
    },
    {
      title: "分步说明",
      content: "请把这个问题拆分成若干步骤，逐步说明该怎么做，并在关键步骤注明需要注意的地方。",
    },
    {
      title: "对比分析",
      content: "请从多个角度对比分析这些选项的优劣，说明各自适用场景，并给出你的建议和理由。",
    },
  ];

  const selectedPrompt = realPrompts.find((p) => p.title === "总结提炼")!;
  const page = reveal(frame, choreography.pageStartFrame ?? 0, 58);
  const pageSweep = interpolate(frame, [choreography.pageStartFrame ?? 0, choreography.pageReadyFrame ?? 56], [-18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const codexInput = reveal(frame, choreography.codexInputStartFrame ?? 0, 22);
  const stickyOpen = reveal(frame, choreography.stickyOpenFrame ?? 0, 18);
  const noteCopy = reveal(frame, choreography.noteCopyFrame ?? 0, 10);
  const notePaste = reveal(frame, choreography.notePasteFrame ?? 0, 14);
  const promptCopy = reveal(frame, choreography.promptCopyFrame ?? 0, 10);
  const promptPaste = reveal(frame, choreography.promptPasteFrame ?? 0, 14);
  const codeWindow = sceneWindowVisibility(
    frame,
    choreography.codexMainStartFrame ?? 0,
    (choreography.noteStartFrame ?? 0) - 2,
    20,
  );
  const noteWindow = sceneWindowVisibility(
    frame,
    choreography.noteStartFrame ?? 0,
    (choreography.promptOpenFrame ?? 0) - 10,
    18,
  );
  const promptOpen = sceneWindowVisibility(
    frame,
    choreography.promptOpenFrame ?? 0,
    (choreography.holdStartFrame ?? 626) + 44,
    18,
  );
  const noteSelection = interpolate(frame, [
    (choreography.noteCopyFrame ?? 0) - 18,
    choreography.noteCopyFrame ?? 0,
    (choreography.notePasteFrame ?? 0) + 8,
  ], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const promptSelection = interpolate(frame, [
    (choreography.promptCopyFrame ?? 0) - 18,
    choreography.promptCopyFrame ?? 0,
    (choreography.promptPasteFrame ?? 0) + 8,
  ], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const copyKeys = Math.max(
    interpolate(frame, [choreography.noteCopyFrame ?? 0, (choreography.noteCopyFrame ?? 0) + 18, (choreography.notePasteFrame ?? 0) - 6], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(frame, [choreography.promptCopyFrame ?? 0, (choreography.promptCopyFrame ?? 0) + 18, (choreography.promptPasteFrame ?? 0) - 6], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const pasteKeys = Math.max(
    interpolate(frame, [choreography.notePasteFrame ?? 0, (choreography.notePasteFrame ?? 0) + 18, (choreography.notePasteFrame ?? 0) + 40], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(frame, [choreography.promptPasteFrame ?? 0, (choreography.promptPasteFrame ?? 0) + 18, (choreography.promptPasteFrame ?? 0) + 46], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <div
      style={{
        position: "relative",
        width: 940,
        height: 640,
        opacity: page,
        transform: `translateY(${(1 - page) * 34}px) scale(${0.92 + page * 0.08})`,
        filter: `blur(${(1 - page) * 10}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -60,
          right: -40,
          top: 28,
          height: 560,
          borderRadius: 36,
          background: "linear-gradient(115deg, rgba(255,255,255,0.04), rgba(255,255,255,0.42), rgba(214,235,255,0.10))",
          opacity: page * 0.62,
          transform: `translateX(${pageSweep * 20}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "22px 26px",
          borderRadius: 30,
          background: "rgba(255,255,255,0.38)",
          border: "1px solid rgba(255,255,255,0.46)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
        }}
      />

      {/* Top stage: code, notes, and prompt windows take turns instead of coexisting. */}
      <div style={{ position: "absolute", left: 170, top: 46, opacity: codeWindow, transform: `translateY(${(1 - codeWindow) * 18}px) scale(${0.97 + codeWindow * 0.03})` }}>
        <div style={{ ...panel("light"), width: 600, height: 268, borderRadius: 22, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Title bar */}
          <div style={{ height: 42, padding: "0 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(148,163,184,0.13)", background: "rgba(248,250,253,0.92)", flexShrink: 0 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ff5f57" }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ffbd2e" }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28c840" }} />
            <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 700, color: "#64748b" }}>useSubscription.ts</span>
          </div>
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* File tree sidebar */}
            <div style={{ width: 148, borderRight: "1px solid rgba(148,163,184,0.13)", padding: "14px 0", background: "rgba(245,248,252,0.88)" }}>
              {[
                { name: "src", indent: 0, isFolder: true },
                { name: "hooks", indent: 1, isFolder: true },
                { name: "useSubscription.ts", indent: 2, active: true },
                { name: "useDevice.ts", indent: 2 },
                { name: "components", indent: 1, isFolder: true },
                { name: "PresetImport.tsx", indent: 2 },
              ].map((item) => (
                <div
                  key={item.name}
                  style={{
                    padding: `5px 12px 5px ${12 + item.indent * 14}px`,
                    fontSize: 12,
                    fontWeight: item.active ? 760 : 560,
                    color: item.active ? "#2563a9" : item.isFolder ? "#334155" : "#64748b",
                    background: item.active ? "rgba(47,127,211,0.10)" : "transparent",
                    borderRadius: item.active ? "0 8px 8px 0" : 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: "Menlo, Monaco, Consolas, monospace",
                  }}
                >
                  {item.isFolder ? "▸ " : ""}{item.name}
                </div>
              ))}
            </div>
            {/* Code area */}
            <div style={{ flex: 1, padding: "16px 18px", fontFamily: "Menlo, Monaco, Consolas, monospace", fontSize: 13, lineHeight: 1.7, color: "#334155", overflow: "hidden" }}>
              <div style={{ color: "#94a3b8" }}>{"// 订阅状态刷新 + 预设导入验证"}</div>
              <div><span style={{ color: "#7c3aed" }}>export function</span> <span style={{ color: "#1d4ed8" }}>useSubscription</span>{"() {"}</div>
              <div style={{ paddingLeft: 18 }}><span style={{ color: "#7c3aed" }}>const</span> [status, setStatus] = <span style={{ color: "#1d4ed8" }}>useState</span>{"<"}<span style={{ color: "#0891b2" }}>Status</span>{">(null)"}</div>
              <div style={{ paddingLeft: 18 }}></div>
              <div style={{ paddingLeft: 18 }}><span style={{ color: "#7c3aed" }}>useEffect</span>{"(() => {"}</div>
              <div style={{ paddingLeft: 36, color: "#64748b" }}>{"// TODO: 对照会议纪要补充边界"}</div>
              <div style={{ paddingLeft: 36 }}><span style={{ color: "#1d4ed8" }}>fetchStatus</span>{"().then(setStatus)"}</div>
              <div style={{ paddingLeft: 18 }}>{"}, [deps])"}</div>
              <div>{"}"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat is the steady destination for pasted context. */}
      <div style={{ position: "absolute", left: 210, top: 354, opacity: codexInput, transform: `translateY(${(1 - codexInput) * 18}px) scale(${0.96 + codexInput * 0.04})` }}>
        <div style={{ ...panel("light"), width: 520, height: 238, borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ height: 48, padding: "0 18px", display: "flex", alignItems: "center", gap: 9, borderBottom: "1px solid rgba(148,163,184,0.13)", background: "rgba(248,250,253,0.94)", flexShrink: 0 }}>
            <span style={{ width: 28, height: 28, borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#2563ab)", display: "grid", placeItems: "center" }}>
              <span style={{ color: "white", fontSize: 13, fontWeight: 860 }}>AI</span>
            </span>
            <span style={{ fontSize: 16, fontWeight: 780, color: "#334155" }}>AI Chat</span>
          </div>
          <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
            {/* User bubble first */}
            <div style={{ alignSelf: "flex-end", maxWidth: "85%", background: "rgba(47,127,211,0.12)", border: "1px solid rgba(47,127,211,0.18)", borderRadius: "15px 15px 5px 15px", padding: "8px 10px", fontSize: 12, color: "#1e3a5f", lineHeight: 1.4, fontWeight: 640 }}>
              帮我补充 useSubscription 的边界处理
            </div>
            {/* AI bubble below */}
            <div style={{ alignSelf: "flex-start", maxWidth: "85%", background: "rgba(248,250,253,0.96)", border: "1px solid rgba(148,163,184,0.18)", borderRadius: "15px 15px 15px 5px", padding: "8px 10px", fontSize: 12, color: "#334155", lineHeight: 1.4, fontWeight: 580 }}>
              好的，你需要处理三种情况：loading、error 和 expired…
            </div>
            {/* Input area */}
            <div style={{ marginTop: "auto", height: 58, borderRadius: 12, background: "rgba(241,245,249,0.92)", border: "1.5px solid rgba(47,127,211,0.20)", padding: "8px 10px", boxSizing: "border-box", fontSize: 12, color: "#233044", fontWeight: 620, lineHeight: 1.35, whiteSpace: "pre-wrap", overflow: "hidden" }}>
              {notePaste > 0.1 ? "会议纪要：下次同步前确认三件事：订阅状态刷新点、设备解绑入口、预设导入后的默认轮盘。" : ""}
              {promptPaste > 0.1 ? "\n" + selectedPrompt.content : ""}
              <span style={{ display: "inline-block", width: 6, height: 12, marginLeft: 2, background: "#2f7fd3", opacity: Math.floor(frame / 18) % 2 ? 0.22 : 0.78, verticalAlign: -2 }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 256, top: 66, opacity: noteWindow, transform: `translateY(${(1 - noteWindow) * 18}px) scale(${0.97 + noteWindow * 0.03})` }}>
        <div style={{ ...panel("light"), width: 428, height: 218, borderRadius: 22, overflow: "hidden" }}>
          <div style={{ height: 38, padding: "0 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(148,163,184,0.14)", color: "#7a6b21", fontSize: 13, fontWeight: 760, background: "rgba(255,247,199,0.82)" }}>
            <span style={{ fontSize: 15 }}>🗒</span> 会议纪要
          </div>
          <div style={{ padding: "18px 20px", fontSize: 17, lineHeight: 1.58, fontWeight: 620, color: "#3e4858", position: "relative" }}>
            {noteSelection > 0.1 ? <div style={{ position: "absolute", inset: "10px 10px 12px", borderRadius: 10, background: `rgba(47,127,211,${0.11 * noteSelection})` }} /> : null}
            <div style={{ position: "relative" }}>
              下次同步前确认三件事：<br />
              订阅状态刷新点、设备解绑入口、预设导入后的默认轮盘。
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 316, top: 66, opacity: promptOpen, transform: `translateY(${(1 - promptOpen) * 18}px) scale(${0.97 + promptOpen * 0.03})` }}>
        <div style={{ ...panel("light"), width: 308, height: 218, borderRadius: 22, overflow: "hidden" }}>
          <div style={{ height: 34, display: "flex", alignItems: "center", padding: "0 12px", borderBottom: "1px solid rgba(148,163,184,0.14)", background: "rgba(248,251,255,0.82)", color: "#64748b", fontSize: 12, fontWeight: 780 }}>
            常用 Prompt
          </div>
          <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
            {realPrompts.map((p) => {
              const selected = p.title === "总结提炼";
              return (
                <div
                  key={p.title}
                  style={{
                    minHeight: 38,
                    borderRadius: 7,
                    padding: "3px 8px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: selected ? `rgba(223,239,255,${0.7 + promptSelection * 0.25})` : "rgba(248,250,252,0.80)",
                    border: selected ? "1px solid rgba(47,127,211,0.22)" : "1px solid rgba(226,232,240,0.65)",
                    color: selected ? "#1f5f9f" : "#566477",
                    fontSize: 11,
                    fontWeight: selected ? 650 : 520,
                    transform: selected ? `scale(${1 + promptSelection * 0.01})` : "none",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: selected ? 700 : 580, lineHeight: 1.1 }}>{p.title}</div>
                  <div style={{ fontSize: 9, lineHeight: 1.15, color: selected ? "#1f5f9f" : "#6b7a8f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <KeyCombo combo={["Control", "C"]} visible={copyKeys} x={642} y={278} />
      <KeyCombo combo={["Control", "V"]} visible={pasteKeys} x={642} y={278} />
    </div>
  );
};

/** Eased fade-in for staggered list items */
const useItemReveal = (index: number, staggerFrames = 8, durationFrames = 18) => {
  const frame = useCurrentFrame();
  const start = index * staggerFrames;
  return interpolate(frame, [start, start + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

// ─── WritingWorkspace ──────────────────────────────────────────────────────────
export const WritingWorkspace = () => {
  const frame = useCurrentFrame();

  const windowReveal = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const listItems = [
    "目标用户反馈需要收敛为三类。",
    "上线前检查订阅、设备和预设导入。",
    "把开发任务拆成可验证的小步骤。",
  ];

  return (
    <div style={{ position: "relative", width: 850, opacity: windowReveal, transform: `translateY(${(1 - windowReveal) * 24}px)` }}>
      <div
        style={{
          ...panel("light"),
          width: 780,
          minHeight: 500,
          borderRadius: 26,
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 58,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 24px",
            borderBottom: "1px solid rgba(148,163,184,0.18)",
            color: "#64748b",
            fontSize: 18,
            fontWeight: 650,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f57" }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ffbd2e" }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28c840" }} />
          <span style={{ marginLeft: 14 }}>会议纪要.md</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 250px", height: 442 }}>
          {/* Main content */}
          <div style={{ padding: "34px 38px", display: "grid", alignContent: "start", gap: 22 }}>
            <AnimatedItem index={0} stagger={6}>
              <div style={{ fontSize: 30, lineHeight: 1.42, fontWeight: 720, color: "#263244" }}>
                下次同步前确认三件事，并把讨论结论整理成可执行列表。
              </div>
            </AnimatedItem>
            {listItems.map((line, i) => (
              <AnimatedItem key={line} index={i + 1} stagger={7}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontSize: 22,
                    color: "#475569",
                    lineHeight: 1.35,
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: "#2f7fd3", flexShrink: 0 }} />
                  {line}
                </div>
              </AnimatedItem>
            ))}
            <AnimatedItem index={5} stagger={7}>
              <div
                style={{
                  marginTop: 10,
                  height: 68,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(234,245,255,0.96), rgba(248,251,255,0.94))",
                  border: "1px solid rgba(47,127,211,0.16)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 20px",
                  color: "#2563a9",
                  fontSize: 21,
                  fontWeight: 690,
                }}
              >
                Ringflow 已插入：总结提炼 Prompt
              </div>
            </AnimatedItem>
          </div>

          {/* Sidebar */}
          <div
            style={{
              borderLeft: "1px solid rgba(148,163,184,0.14)",
              padding: 24,
              background: "rgba(248, 251, 255, 0.72)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 760, color: "#64748b", marginBottom: 16 }}>常用提示词</div>
            {["总结提炼", "润色改写", "分步说明", "对比分析"].map((item, index) => (
              <AnimatedItem key={item} index={index} stagger={5}>
                <div
                  style={{
                    height: 54,
                    borderRadius: 14,
                    marginBottom: 12,
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                    background: index === 0 ? "rgba(223, 239, 255, 0.96)" : "rgba(255,255,255,0.78)",
                    color: index === 0 ? "#1f5f9f" : "#475569",
                    fontSize: 20,
                    fontWeight: 700,
                    border: index === 0 ? "1px solid rgba(47,127,211,0.18)" : "1px solid rgba(226,232,240,0.78)",
                  }}
                >
                  {item}
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", right: -4, bottom: -34 }}>
        <RingflowWheel mini activeSegment="quick-input" centerLabel="文本" revealFrame={8} />
      </div>
    </div>
  );
};

// ─── AnimatedItem helper ───────────────────────────────────────────────────────
const AnimatedItem = ({
  children,
  index,
  stagger = 8,
}: {
  children: React.ReactNode;
  index: number;
  stagger?: number;
}) => {
  const frame = useCurrentFrame();
  const start = index * stagger;
  const t = interpolate(frame, [start, start + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * 14}px)`,
      }}
    >
      {children}
    </div>
  );
};

// ─── QuickInputWorkspace — operational semantic demo (like Intro) ─────────────
export const QuickInputWorkspace = ({
  choreography,
}: {
  choreography?: { visualStartFrame?: number; actionStartFrame?: number; holdStartFrame?: number };
} = {}) => {
  const frame = useCurrentFrame();

  const c = choreography || {};
  const visualStart = c.visualStartFrame ?? 0;
  const actionStart = c.actionStartFrame ?? 78;
  const holdStart = c.holdStartFrame ?? 136;

  const windowReveal = interpolate(frame, [visualStart, visualStart + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Wheel appears after the workspace
  const wheelReveal = interpolate(frame, [actionStart - 12, actionStart + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Simulate the "润色改写" action result (timed text insertion)
  const actionComplete = interpolate(frame, [actionStart + 26, actionStart + 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const cursorBlink = Math.floor(frame / 18) % 2 === 0;

  // Show the result prompt once action fires
  const showResult = actionComplete > 0.15;

  return (
    <div style={{ position: "relative", width: 920, opacity: windowReveal, transform: `translateY(${(1 - windowReveal) * 22}px)` }}>
      {/* Header to clarify it's an AI app context */}
      <div style={{ textAlign: "center", marginBottom: 6, fontSize: 13, color: "#64748b", fontWeight: 620, letterSpacing: 0.3 }}>
        Codex · AI 应用
      </div>
      <div style={{ ...panel("light"), width: 920, height: 510, borderRadius: 26, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Title bar */}
        <div style={{ height: 50, display: "flex", alignItems: "center", gap: 10, padding: "0 22px", borderBottom: "1px solid rgba(148,163,184,0.15)", background: "rgba(248,250,253,0.94)", flexShrink: 0 }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f57" }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ffbd2e" }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28c840" }} />
          <div style={{ marginLeft: 16, fontSize: 15, fontWeight: 680, color: "#64748b" }}>迭代复盘.md</div>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Main document area */}
          <div style={{ flex: 1, padding: "24px 30px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 23, fontWeight: 750, color: "#1e293b" }}>本次迭代复盘</div>
            <div style={{ fontSize: 16, lineHeight: 1.65, color: "#475569" }}>
              覆盖用户鉴权、数据同步与离线缓存。验收标准需在发布前对齐。
            </div>

            {/* Prominent large AI input area - like desktop AI Agent (Cursor / Codex style) */}
            <div style={{ marginTop: "auto", flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 650, color: "#64748b", marginBottom: 8 }}>向 AI 提问</div>
              <div
                style={{
                  height: 110,
                  borderRadius: 16,
                  background: "rgba(241,245,249,0.95)",
                  border: "2px solid rgba(47,127,211,0.22)",
                  display: "flex",
                  flexDirection: "column",
                  padding: "14px 20px",
                  fontSize: 19,
                  color: "#1e3a5f",
                  fontWeight: 560,
                  lineHeight: 1.35,
                }}
              >
                <div style={{ flex: 1 }}>
                  {showResult ? "请帮我润色这段文字，让表达更清晰、自然..." : "输入你的问题或选择 Prompt..."}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#7c3aed,#2563ab)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <span style={{ color: "white", fontSize: 11, fontWeight: 860 }}>AI</span>
                  </span>
                  {showResult && <span style={{ fontSize: 15, color: "#1e4d8c" }}>Ringflow 已输入：润色改写 · 剪贴板已恢复</span>}
                  {!showResult && cursorBlink && <span style={{ width: 2, height: 22, background: "#2f7fd3", marginLeft: 2, alignSelf: "center" }} />}
                </div>
              </div>

              {/* Result feedback — more visible */}
              {showResult && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 16px",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, rgba(218,238,255,0.98), rgba(248,251,255,0.96))",
                    border: "1px solid rgba(47,127,211,0.22)",
                    color: "#1e4d8c",
                    fontSize: 15,
                    fontWeight: 680,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: "#2f7fd3", flexShrink: 0 }} />
                  剪贴板已恢复
                </div>
              )}
            </div>
          </div>

          {/* Prompt list sidebar + mini wheel */}
          <div style={{ width: 208, borderLeft: "1px solid rgba(148,163,184,0.13)", padding: "18px 14px", background: "rgba(248,251,255,0.78)", flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 720, color: "#64748b", marginBottom: 10 }}>快捷 Prompt</div>
            {["总结提炼", "润色改写", "分步说明", "对比分析"].map((item, index) => {
              const isActive = item === "润色改写" && showResult;
              return (
                <div
                  key={item}
                  style={{
                    height: 42,
                    borderRadius: 10,
                    marginBottom: 8,
                    padding: "0 13px",
                    display: "flex",
                    alignItems: "center",
                    background: isActive ? "rgba(223,239,255,0.96)" : "rgba(255,255,255,0.82)",
                    color: isActive ? "#1f5f9f" : "#475569",
                    fontSize: 15,
                    fontWeight: isActive ? 720 : 560,
                    border: isActive ? "1.5px solid rgba(47,127,211,0.24)" : "1px solid rgba(226,232,240,0.7)",
                  }}
                >
                  {item}
                  {isActive && <span style={{ marginLeft: "auto", fontSize: 11, color: "#2f7fd3", fontWeight: 700 }}>已选</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ringflow wheel positioned as the action trigger */}
      <div
        style={{
          position: "absolute",
          right: 8,
          bottom: -28,
          opacity: wheelReveal,
          transform: `scale(${0.86 + wheelReveal * 0.14})`,
        }}
      >
        <RingflowWheel mini activeSegment="quick-input" centerLabel="文本" revealProgress={wheelReveal} />
      </div>
    </div>
  );
};

// ─── FrictionWorkflow — semantic "操作绕远" like Intro's timed narrative ─────
export const FrictionWorkflow = ({
  choreography,
}: {
  choreography?: { visualStartFrame?: number; actionStartFrame?: number };
} = {}) => {
  const frame = useCurrentFrame();
  const c = choreography || {};
  const visual = c.visualStartFrame ?? 42;
  const action = c.actionStartFrame ?? 76;

  // Three stages of friction: menu → submenu → window switch
  const menuStage = interpolate(frame, [visual, visual + 26, action + 10], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subStage = interpolate(frame, [action - 6, action + 18, action + 44], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const switchStage = interpolate(frame, [action + 38, action + 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: 720, height: 440 }}>
      {/* Context: the thing the user actually wants to do */}
      <div
        style={{
          ...panel("light"),
          position: "absolute",
          left: 80,
          top: 60,
          width: 520,
          height: 160,
          borderRadius: 20,
          padding: "18px 24px",
          opacity: 0.95,
        }}
      >
        <div style={{ fontSize: 15, color: "#64748b", marginBottom: 8 }}>当前文档 · 迭代计划</div>
        <div style={{ fontSize: 20, fontWeight: 680, color: "#263244" }}>添加订阅状态刷新逻辑</div>
        <div style={{ marginTop: 12, fontSize: 15, color: "#475569" }}>需要把会议纪要里的三件事同步到代码注释里…</div>
      </div>

      {/* Stage 1: Menu bar friction */}
      <div style={{ position: "absolute", left: 110, top: 240, opacity: menuStage, transform: `translateY(${(1 - menuStage) * 12}px)` }}>
        <div style={{ ...panel("light"), width: 240, borderRadius: 16, padding: "10px 8px", fontSize: 16 }}>
          <div style={{ padding: "4px 12px", color: "#334155", fontWeight: 650 }}>编辑</div>
          <div style={{ padding: "4px 12px", color: "#334155", fontWeight: 650 }}>服务</div>
          <div style={{ padding: "4px 12px", background: "rgba(232,244,255,0.8)", borderRadius: 8, color: "#1f5f9f" }}>替换…</div>
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, textAlign: "center" }}>菜单栏</div>
      </div>

      {/* Stage 2: Submenu — deeper navigation */}
      <div style={{ position: "absolute", left: 260, top: 290, opacity: subStage, transform: `translateY(${(1 - subStage) * 14}px)` }}>
        <div style={{ ...panel("light"), width: 210, borderRadius: 16, padding: "10px 8px", fontSize: 16 }}>
          <div style={{ padding: "4px 12px", color: "#475569" }}>转换文本</div>
          <div style={{ padding: "4px 12px", color: "#475569" }}>朗读</div>
          <div style={{ padding: "4px 12px", background: "rgba(232,244,255,0.8)", borderRadius: 8 }}>打开方式</div>
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, textAlign: "center" }}>二级菜单</div>
      </div>

      {/* Stage 3: Window / app switching cost */}
      <div style={{ position: "absolute", left: 410, top: 200, opacity: switchStage }}>
        <div style={{ ...panel("light"), width: 220, borderRadius: 16, padding: "12px 14px", fontSize: 15 }}>
          <div style={{ marginBottom: 6, fontWeight: 640 }}>窗口切换</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Notes", "Finder", "Terminal"].map((w, i) => (
              <div key={i} style={{ background: i === 1 ? "rgba(223,239,255,0.9)" : "rgba(248,250,252,0.8)", padding: "3px 10px", borderRadius: 8, fontSize: 14 }}>{w}</div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, textAlign: "center" }}>来回切换</div>
      </div>
    </div>
  );
};

// ─── QuickOpenTargets ─────────────────────────────────────────────────────────
const appGlyph: Record<string, { color: string; glyph: string }> = {
  Finder: { color: "#4aa3ff", glyph: "F" },
  Terminal: { color: "#111827", glyph: ">_" },
  Code: { color: "#147ef5", glyph: "<>" },
  Notes: { color: "#ffd24a", glyph: "N" },
  Shortcuts: { color: "#8b5cf6", glyph: "S" },
};

export const QuickOpenTargets = () => {
  const frame = useCurrentFrame();

  const targets = [
    { name: "Terminal", icon: ">_ ", color: "#111827" },
    { name: "Finder", icon: "📁", color: "#4aa3ff" },
    { name: "Project", icon: "📄", color: "#147ef5" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 160px)", gap: 18, justifyContent: "center" }}>
      {targets.map((t, index) => {
        const tt = interpolate(frame, [index * 7, index * 7 + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const highlighted = index === 0;
        return (
          <div
            key={index}
            style={{
              ...panel("light"),
              width: 160,
              height: 160,
              borderRadius: 24,
              display: "grid",
              placeItems: "center",
              gap: 8,
              padding: 18,
              outline: highlighted ? "3px solid rgba(47,127,211,0.28)" : "none",
              boxShadow: highlighted
                ? "0 0 0 6px rgba(47,127,211,0.08), 0 24px 80px rgba(30,45,70,0.16)"
                : theme.shadow.panel,
              opacity: tt,
              transform: `translateY(${(1 - tt) * 20}px) scale(${0.94 + tt * 0.06})`,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 14,
                background: t.color,
                color: "white",
                display: "grid",
                placeItems: "center",
                fontSize: 22,
                fontWeight: 820,
                boxShadow: `0 4px 14px ${t.color}55`,
              }}
            >
              {t.icon}
            </div>
            <div style={{ fontSize: 17, fontWeight: 680, color: "#334155" }}>{t.name}</div>
          </div>
        );
      })}
      <div style={{ gridColumn: "1 / -1", justifySelf: "center", marginTop: 4 }}>
        <RingflowWheel mini activeSegment="quick-open" centerLabel="快捷打开" revealFrame={14} />
      </div>
    </div>
  );
};

// ─── MacroExecution — timed multi-step semantic flow ─────────────────────────
export const MacroExecution = ({
  choreography,
}: {
  choreography?: { visualStartFrame?: number; actionStartFrame?: number };
} = {}) => {
  const frame = useCurrentFrame();
  const c = choreography || {};
  const visual = c.visualStartFrame ?? 48;
  const action = c.actionStartFrame ?? 88;

  const steps = ["复制", "切换应用", "粘贴", "保存"];

  return (
    <div style={{ width: 640, display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
      {steps.map((step, index) => {
        const start = visual + index * 18;
        const t = interpolate(frame, [start, start + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const isDone = index < 3 || (index === 3 && frame > action + 50);

        return (
          <div
            key={index}
            style={{
              ...panel("dark"),
              width: "100%",
              height: 72,
              borderRadius: 18,
              padding: "0 26px",
              display: "grid",
              gridTemplateColumns: "42px 1fr auto",
              alignItems: "center",
              gap: 18,
              opacity: t,
              transform: `translateX(${(1 - t) * -16}px)`,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: isDone ? "rgba(47,127,211,0.92)" : "rgba(148,163,184,0.25)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontSize: 17,
                fontWeight: 800,
              }}
            >
              {index + 1}
            </div>
            <div style={{ fontSize: 23, fontWeight: 720, color: theme.colors.darkInk }}>{step}</div>
            <div style={{ fontSize: 17, color: isDone ? "#86d69a" : theme.colors.darkMuted, fontWeight: 650 }}>
              {isDone ? "完成" : "等待"}
            </div>
          </div>
        );
      })}

      {/* Running wheel indicator */}
      <div style={{ marginTop: 6, opacity: interpolate(frame, [action - 4, action + 12], [0, 1], { extrapolateLeft: "clamp" }) }}>
        <RingflowWheel mini mode="dark" runningSegment="shell" centerLabel="运行中" revealFrame={action - 10} />
      </div>
    </div>
  );
};

// ─── MonitorDashboard ─────────────────────────────────────────────────────────
export const MonitorDashboard = () => {
  const frame = useCurrentFrame();

  const metrics = [
    { label: "CPU", value: "18%", raw: 0.18, color: "#4aa3ff" },
    { label: "内存", value: "62%", raw: 0.62, color: "#8b73f0" },
    { label: "网速", value: "42M", raw: 0.45, color: "#34d399" },
    { label: "电池", value: "86%", raw: 0.86, color: "#fbbf24" },
  ];

  return (
    <div style={{ width: 560, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
      {metrics.map(({ label, value, raw, color }, index) => {
        const tCard = interpolate(frame, [index * 8, index * 8 + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        // Bar fills after card appears
        const barStart = index * 8 + 16;
        const barFill = interpolate(frame, [barStart, barStart + 26], [0, raw], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });

        return (
          <div
            key={label}
            style={{
              ...panel("dark"),
              borderRadius: 20,
              padding: 20,
              minHeight: 142,
              opacity: tCard,
              transform: `translateY(${(1 - tCard) * 16}px)`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: theme.colors.darkMuted, fontSize: 20 }}>
              <span>{label}</span>
              <span style={{ color: theme.colors.darkInk, fontWeight: 720 }}>{value}</span>
            </div>
            <div
              style={{
                height: 10,
                borderRadius: 999,
                background: "rgba(255,255,255,0.10)",
                marginTop: 28,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${barFill * 100}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${color}cc, ${color})`,
                  boxShadow: `0 0 8px ${color}66`,
                  transition: "none",
                }}
              />
            </div>
          </div>
        );
      })}
      <div style={{ gridColumn: "1 / -1", justifySelf: "center", marginTop: 10 }}>
        <RingflowWheel mini mode="dark" activeSegment="monitor" centerLabel="监视器" revealFrame={16} />
      </div>
    </div>
  );
};

// ─── AppConfigurationScreenshot ───────────────────────────────────────────────
const PROFILES = [
  {
    role: "写作",
    app: "Notion",
    color: "#1a1a1a",
    bg: "rgba(255,255,255,0.92)",
    actions: ["润色改写", "总结提炼", "快捷输入"],
    accent: "#64748b",
  },
  {
    role: "开发",
    app: "Cursor",
    color: "#7c3aed",
    bg: "rgba(245,242,255,0.92)",
    actions: ["新脚本", "复制", "监视器", "粘贴"],
    accent: "#7c3aed",
  },
  {
    role: "会议",
    app: "Zoom",
    color: "#2563ab",
    bg: "rgba(240,246,255,0.92)",
    actions: ["新便签", "快捷指令", "总结提炼"],
    accent: "#2563ab",
  },
];

export const AppConfigurationScreenshot = () => {
  const frame = useCurrentFrame();
  const panelReveal = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        width: 860,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 18,
        opacity: panelReveal,
        transform: `translateY(${(1 - panelReveal) * 22}px)`,
      }}
    >
      {PROFILES.map((profile, pi) => {
        const cardReveal = interpolate(frame, [pi * 10, pi * 10 + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div
            key={profile.role}
            style={{
              ...panel("light"),
              borderRadius: 22,
              overflow: "hidden",
              opacity: cardReveal,
              transform: `translateY(${(1 - cardReveal) * 16}px)`,
              outline: pi === 1 ? "2px solid rgba(124,58,237,0.28)" : "none",
              boxShadow: pi === 1 ? "0 0 0 5px rgba(124,58,237,0.07), 0 24px 64px rgba(30,45,70,0.14)" : theme.shadow.panel,
            }}
          >
            {/* Profile header */}
            <div
              style={{
                padding: "16px 18px 14px",
                borderBottom: "1px solid rgba(148,163,184,0.13)",
                background: profile.bg,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: profile.color,
                    display: "grid",
                    placeItems: "center",
                    boxShadow: `0 2px 8px ${profile.color}44`,
                  }}
                >
                  <span style={{ color: "white", fontSize: 13, fontWeight: 860 }}>
                    {profile.app[0]}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1e293b" }}>{profile.role}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 580 }}>{profile.app}</div>
                </div>
              </div>
            </div>

            {/* Action list */}
            <div style={{ padding: "12px 14px", display: "grid", gap: 7 }}>
              {profile.actions.map((action, ai) => {
                const itemReveal = interpolate(frame, [pi * 10 + ai * 5 + 14, pi * 10 + ai * 5 + 28], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                });
                return (
                  <div
                    key={action}
                    style={{
                      height: 34,
                      borderRadius: 10,
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: ai === 0 ? `${profile.accent}14` : "rgba(248,250,252,0.88)",
                      border: ai === 0 ? `1px solid ${profile.accent}28` : "1px solid rgba(226,232,240,0.70)",
                      color: ai === 0 ? profile.accent : "#475569",
                      fontSize: 13,
                      fontWeight: ai === 0 ? 760 : 560,
                      opacity: itemReveal,
                      transform: `translateX(${(1 - itemReveal) * -8}px)`,
                    }}
                  >
                    <span>{action}</span>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        background: ai === 0 ? profile.accent : "rgba(148,163,184,0.30)",
                        flexShrink: 0,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── PresetLibraryShowcase ────────────────────────────────────────────────────
export const PresetLibraryShowcase = () => {
  const frame = useCurrentFrame();

  const panelReveal = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const presets = [
    { title: "AI 写作助手", desc: "提示词 + 便签 + 总结" },
    { title: "开发者工作流", desc: "Shell + 监视器 + 快捷键" },
    { title: "会议记录整理", desc: "便签 + 总结提炼 + 快捷指令" },
  ];

  return (
    <div style={{ position: "relative", width: 760, height: 430 }}>
      <div
        style={{
          ...panel("light"),
          position: "absolute",
          inset: "20px 70px 0 0",
          borderRadius: 28,
          padding: 28,
          opacity: panelReveal,
          transform: `translateY(${(1 - panelReveal) * 18}px)`,
        }}
      >
        <div style={{ fontSize: 24, color: "#64748b", fontWeight: 720, marginBottom: 22 }}>预设库</div>
        {presets.map((preset, index) => {
          const t = interpolate(frame, [10 + index * 10, 10 + index * 10 + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={preset.title}
              style={{
                height: 82,
                borderRadius: 18,
                padding: "0 22px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                marginBottom: 14,
                background: index === 0 ? "rgba(232,244,255,0.92)" : "rgba(248,250,252,0.88)",
                border: index === 0 ? "1.5px solid rgba(47,127,211,0.20)" : "1px solid rgba(226,232,240,0.84)",
                opacity: t,
                transform: `translateX(${(1 - t) * -14}px)`,
              }}
            >
              <div>
                <div style={{ fontSize: 24, fontWeight: 780, color: "#263244" }}>{preset.title}</div>
                <div style={{ marginTop: 5, fontSize: 16, color: "#64748b" }}>{preset.desc}</div>
              </div>
              <div style={{ color: "#2f7fd3", fontSize: 18, fontWeight: 760 }}>
                {index === 0 ? "应用中" : "导入"}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 0, bottom: 4, width: 260 }}>
        <RingflowWheel mini activeSegment="prompt-folder" centerLabel="默认" revealFrame={20} />
      </div>
    </div>
  );
};
