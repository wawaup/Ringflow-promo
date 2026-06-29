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

// ─── QuickInputWorkspace (distinct from WritingWorkspace) ─────────────────────
export const QuickInputWorkspace = () => {
  const frame = useCurrentFrame();

  // Typing cursor blink at ~1Hz
  const cursorBlink = Math.floor(frame / 18) % 2 === 0;

  // Characters typed progressively
  const totalChars = 24;
  const typedCount = Math.min(
    totalChars,
    Math.floor(
      interpolate(frame, [10, 50], [0, totalChars], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    ),
  );
  const fullText = "请帮我总结以上内容的关键决策点";
  const typedText = fullText.slice(0, typedCount);

  // Prompt card flash in
  const promptFlash = interpolate(frame, [52, 66], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const windowReveal = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "relative",
        width: 850,
        opacity: windowReveal,
        transform: `translateY(${(1 - windowReveal) * 20}px)`,
      }}
    >
      <div
        style={{
          ...panel("light"),
          width: 780,
          minHeight: 480,
          borderRadius: 26,
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 54,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 24px",
            borderBottom: "1px solid rgba(148,163,184,0.16)",
            color: "#64748b",
            fontSize: 17,
            fontWeight: 650,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f57" }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ffbd2e" }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28c840" }} />
          <span style={{ marginLeft: 14 }}>项目复盘文档.md</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 230px", height: 426 }}>
          {/* Text area */}
          <div style={{ padding: "30px 36px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 26, lineHeight: 1.52, fontWeight: 680, color: "#334155", flex: 1 }}>
              本次迭代覆盖了三个核心模块，包括用户鉴权、数据同步和离线缓存策略……
            </div>

            {/* Live typing input bar */}
            <div
              style={{
                height: 60,
                borderRadius: 14,
                background: "rgba(241,245,249,0.9)",
                border: "1.5px solid rgba(47,127,211,0.22)",
                display: "flex",
                alignItems: "center",
                padding: "0 18px",
                fontSize: 22,
                color: "#1e3a5f",
                fontWeight: 600,
                gap: 4,
              }}
            >
              <span>{typedText}</span>
              {typedCount < totalChars && cursorBlink && (
                <span
                  style={{
                    width: 2,
                    height: 26,
                    background: "#2f7fd3",
                    borderRadius: 1,
                    display: "inline-block",
                  }}
                />
              )}
            </div>

            {/* Ringflow inserted prompt card */}
            {promptFlash > 0.05 && (
              <div
                style={{
                  opacity: promptFlash,
                  transform: `translateY(${(1 - promptFlash) * 12}px)`,
                  height: 62,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(218,238,255,0.98), rgba(248,251,255,0.96))",
                  border: "1px solid rgba(47,127,211,0.20)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 18px",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: "#2f7fd3",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 19, fontWeight: 720, color: "#1e4d8c" }}>
                  Ringflow 已输入：总结提炼 Prompt · 剪贴板已恢复
                </span>
              </div>
            )}
          </div>

          {/* Prompt sidebar */}
          <div
            style={{
              borderLeft: "1px solid rgba(148,163,184,0.14)",
              padding: "24px 20px",
              background: "rgba(248, 251, 255, 0.72)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 760, color: "#64748b", marginBottom: 14 }}>快捷输入</div>
            {["总结提炼", "润色改写", "分步说明", "对比分析"].map((item, index) => (
              <AnimatedItem key={item} index={index} stagger={6}>
                <div
                  style={{
                    height: 50,
                    borderRadius: 12,
                    marginBottom: 10,
                    padding: "0 14px",
                    display: "flex",
                    alignItems: "center",
                    background: index === 0 ? "rgba(223, 239, 255, 0.96)" : "rgba(255,255,255,0.78)",
                    color: index === 0 ? "#1f5f9f" : "#475569",
                    fontSize: 18,
                    fontWeight: index === 0 ? 760 : 600,
                    border: index === 0 ? "1.5px solid rgba(47,127,211,0.22)" : "1px solid rgba(226,232,240,0.78)",
                    boxShadow: index === 0 ? "0 2px 12px rgba(47,127,211,0.10)" : "none",
                  }}
                >
                  {item}
                  {index === 0 && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 13,
                        color: "#2f7fd3",
                        fontWeight: 700,
                        background: "rgba(47,127,211,0.10)",
                        borderRadius: 6,
                        padding: "2px 8px",
                      }}
                    >
                      已选
                    </span>
                  )}
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", right: -4, bottom: -34 }}>
        <RingflowWheel mini activeSegment="quick-input" centerLabel="文本" revealFrame={6} />
      </div>
    </div>
  );
};

// ─── FrictionStack ────────────────────────────────────────────────────────────
export const FrictionStack = () => {
  const frame = useCurrentFrame();

  const cards = [
    { title: "菜单栏", items: ["编辑", "服务", "替换"], x: 40, y: 30 },
    { title: "二级菜单", items: ["转换", "朗读", "打开方式"], x: 190, y: 112 },
    { title: "窗口切换", items: ["Notes", "Finder", "Terminal"], x: 330, y: 198 },
  ];

  return (
    <div style={{ position: "relative", width: 650, height: 430 }}>
      {cards.map((card, index) => {
        const cardReveal = interpolate(frame, [index * 10, index * 10 + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div
            key={card.title}
            style={{
              ...panel("light"),
              position: "absolute",
              left: card.x,
              top: card.y,
              width: 270,
              borderRadius: 18,
              padding: 14,
              opacity: cardReveal * (1 - index * 0.04),
              transform: `translateY(${(1 - cardReveal) * 18}px)`,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 780, color: "#334155", margin: "4px 8px 12px" }}>{card.title}</div>
            {card.items.map((item, itemIndex) => (
              <div
                key={item}
                style={{
                  height: 42,
                  borderRadius: 11,
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 17,
                  color: "#475569",
                  background: itemIndex === 2 ? "rgba(232,244,255,0.9)" : "transparent",
                  fontWeight: itemIndex === 2 ? 740 : 590,
                }}
              >
                {item}
                {itemIndex < 2 ? <span style={{ color: "#94a3b8" }}>⌘</span> : null}
              </div>
            ))}
          </div>
        );
      })}
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

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 160px)", gap: 18, justifyContent: "center" }}>
      {["Terminal", "Code", "Finder", "Notes", "Shortcuts"].map((name, index) => {
        const glyph = appGlyph[name];
        const t = interpolate(frame, [index * 7, index * 7 + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const highlighted = index === 1;
        return (
          <div
            key={name}
            style={{
              ...panel("light"),
              width: 160,
              height: 160,
              borderRadius: 24,
              display: "grid",
              placeItems: "center",
              gap: 10,
              padding: 18,
              outline: highlighted ? "3px solid rgba(47,127,211,0.28)" : "none",
              boxShadow: highlighted
                ? "0 0 0 6px rgba(47,127,211,0.08), 0 24px 80px rgba(30,45,70,0.16)"
                : theme.shadow.panel,
              opacity: t,
              transform: `translateY(${(1 - t) * 20}px) scale(${0.94 + t * 0.06})`,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 17,
                background: glyph.color,
                color: "white",
                display: "grid",
                placeItems: "center",
                fontSize: name === "Terminal" ? 17 : 24,
                fontWeight: 820,
                boxShadow: `0 4px 16px ${glyph.color}44`,
              }}
            >
              {glyph.glyph}
            </div>
            <div style={{ fontSize: 19, fontWeight: 720, color: "#334155" }}>{name}</div>
          </div>
        );
      })}
      <div style={{ gridColumn: "1 / -1", justifySelf: "center", marginTop: 4 }}>
        <RingflowWheel mini activeSegment="quick-open" centerLabel="打开" revealFrame={14} />
      </div>
    </div>
  );
};

// ─── MacroTimeline ────────────────────────────────────────────────────────────
export const MacroTimeline = () => {
  const frame = useCurrentFrame();

  const steps = ["复制选区", "切换到目标 App", "粘贴并保存", "恢复剪贴板"];

  return (
    <div style={{ width: 610, display: "grid", gap: 18 }}>
      {steps.map((step, index) => {
        const t = interpolate(frame, [index * 10, index * 10 + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const done = index < 3;
        return (
          <div
            key={step}
            style={{
              ...panel("dark"),
              height: 74,
              borderRadius: 18,
              padding: "0 22px",
              display: "grid",
              gridTemplateColumns: "44px 1fr auto",
              alignItems: "center",
              gap: 16,
              opacity: t,
              transform: `translateX(${(1 - t) * -18}px)`,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: done ? "rgba(47,127,211,0.95)" : "rgba(148,163,184,0.28)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontSize: 18,
                fontWeight: 820,
                boxShadow: done ? "0 2px 10px rgba(47,127,211,0.32)" : "none",
              }}
            >
              {index + 1}
            </div>
            <div style={{ fontSize: 24, fontWeight: 760, color: theme.colors.darkInk }}>{step}</div>
            <div style={{ fontSize: 18, color: done ? "#8bd69a" : theme.colors.darkMuted, fontWeight: 700 }}>
              {done ? "完成" : "等待"}
            </div>
          </div>
        );
      })}
      <div style={{ justifySelf: "center", marginTop: 8 }}>
        <RingflowWheel mini mode="dark" runningSegment="macro" centerLabel="运行中" revealFrame={20} />
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
    { label: "网络", value: "42M", raw: 0.45, color: "#34d399" },
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
        <RingflowWheel mini mode="dark" activeSegment="monitor" centerLabel="状态" revealFrame={16} />
      </div>
    </div>
  );
};

// ─── AppConfigurationScreenshot ───────────────────────────────────────────────
export const AppConfigurationScreenshot = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        width: 900,
        borderRadius: 26,
        overflow: "hidden",
        boxShadow: "0 30px 90px rgba(25, 47, 80, 0.20), 0 2px 16px rgba(25, 47, 80, 0.12)",
        border: "1px solid rgba(255,255,255,0.74)",
        opacity: t,
        transform: `scale(${0.96 + t * 0.04}) translateY(${(1 - t) * 20}px)`,
      }}
    >
      <Img src={staticFile(assets.brand.appScreenshot)} style={{ width: "100%", display: "block" }} />
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
    { title: "AI 写作助手", desc: "动作库 + 轮盘布局 + 分组外环" },
    { title: "开发者工作流", desc: "Shell + 宏序列 + 快捷指令" },
    { title: "会议记录整理", desc: "便签 + 文本输入 + 总结模板" },
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
        <Img
          src={staticFile(assets.brand.wheelSingle)}
          style={{
            width: "100%",
            display: "block",
            filter: "drop-shadow(0 18px 45px rgba(47, 127, 211, 0.18))",
          }}
        />
      </div>
    </div>
  );
};
