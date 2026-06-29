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

const appGlyph: Record<string, { color: string; glyph: string }> = {
  Finder: { color: "#4aa3ff", glyph: "F" },
  Terminal: { color: "#111827", glyph: ">_" },
  Code: { color: "#147ef5", glyph: "<>" },
  Notes: { color: "#ffd24a", glyph: "N" },
  Shortcuts: { color: "#8b5cf6", glyph: "S" },
};

export const WritingWorkspace = () => (
  <div style={{ position: "relative", width: 850 }}>
    <div
      style={{
        ...panel("light"),
        width: 780,
        minHeight: 500,
        borderRadius: 26,
        overflow: "hidden",
      }}
    >
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
        <div style={{ padding: "34px 38px", display: "grid", alignContent: "start", gap: 22 }}>
          <div style={{ fontSize: 30, lineHeight: 1.42, fontWeight: 720, color: "#263244" }}>
            下次同步前确认三件事，并把讨论结论整理成可执行列表。
          </div>
          {["目标用户反馈需要收敛为三类。", "上线前检查订阅、设备和预设导入。", "把开发任务拆成可验证的小步骤。"].map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 22,
                color: "#475569",
                lineHeight: 1.35,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: 999, background: "#2f7fd3" }} />
              {line}
            </div>
          ))}
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
        </div>
        <div
          style={{
            borderLeft: "1px solid rgba(148,163,184,0.14)",
            padding: 24,
            background: "rgba(248, 251, 255, 0.72)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 760, color: "#64748b", marginBottom: 16 }}>常用提示词</div>
          {["总结提炼", "润色改写", "分步说明", "对比分析"].map((item, index) => (
            <div
              key={item}
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
          ))}
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", right: -4, bottom: -34 }}>
      <RingflowWheel mini activeSegment="quick-input" centerLabel="文本" />
    </div>
  </div>
);

export const FrictionStack = () => (
  <div style={{ position: "relative", width: 650, height: 430 }}>
    {[
      { title: "菜单栏", items: ["编辑", "服务", "替换"], x: 40, y: 30 },
      { title: "二级菜单", items: ["转换", "朗读", "打开方式"], x: 190, y: 112 },
      { title: "窗口切换", items: ["Notes", "Finder", "Terminal"], x: 330, y: 198 },
    ].map((card, index) => (
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
          opacity: 1 - index * 0.04,
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
    ))}
  </div>
);

export const QuickOpenTargets = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 150px)", gap: 18, justifyContent: "center" }}>
    {["Terminal", "Code", "Finder", "Notes", "Shortcuts"].map((name, index) => {
      const glyph = appGlyph[name];
      return (
        <div
          key={name}
          style={{
            ...panel("light"),
            width: 150,
            height: 150,
            borderRadius: 24,
            display: "grid",
            placeItems: "center",
            gap: 10,
            padding: 18,
            outline: index === 1 ? "3px solid rgba(47,127,211,0.24)" : "none",
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: glyph.color,
              color: "white",
              display: "grid",
              placeItems: "center",
              fontSize: name === "Terminal" ? 18 : 24,
              fontWeight: 820,
            }}
          >
            {glyph.glyph}
          </div>
          <div style={{ fontSize: 20, fontWeight: 720, color: "#334155" }}>{name}</div>
        </div>
      );
    })}
    <div style={{ gridColumn: "1 / -1", justifySelf: "center", marginTop: 4 }}>
      <RingflowWheel mini activeSegment="quick-open" centerLabel="打开" />
    </div>
  </div>
);

export const MacroTimeline = () => (
  <div style={{ width: 610, display: "grid", gap: 18 }}>
    {["复制选区", "切换到目标 App", "粘贴并保存", "恢复剪贴板"].map((step, index) => (
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
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            background: index < 3 ? "rgba(47,127,211,0.95)" : "rgba(148,163,184,0.28)",
            display: "grid",
            placeItems: "center",
            color: "white",
            fontSize: 18,
            fontWeight: 820,
          }}
        >
          {index + 1}
        </div>
        <div style={{ fontSize: 24, fontWeight: 760, color: theme.colors.darkInk }}>{step}</div>
        <div style={{ fontSize: 18, color: index < 3 ? "#8bd69a" : theme.colors.darkMuted, fontWeight: 700 }}>
          {index < 3 ? "完成" : "等待"}
        </div>
      </div>
    ))}
    <div style={{ justifySelf: "center", marginTop: 8 }}>
      <RingflowWheel mini mode="dark" runningSegment="macro" centerLabel="运行中" />
    </div>
  </div>
);

export const MonitorDashboard = () => (
  <div style={{ width: 560, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
    {[
      ["CPU", "18%", 0.18],
      ["内存", "62%", 0.62],
      ["网络", "42M", 0.45],
      ["电池", "86%", 0.86],
    ].map(([label, value, raw]) => {
      const level = Number(raw);
      return (
        <div key={String(label)} style={{ ...panel("dark"), borderRadius: 20, padding: 20, minHeight: 142 }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: theme.colors.darkMuted, fontSize: 20 }}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
          <div
            style={{
              height: 12,
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              marginTop: 26,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${level * 100}%`,
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #4aa3ff, #8bd69a)",
              }}
            />
          </div>
        </div>
      );
    })}
    <div style={{ gridColumn: "1 / -1", justifySelf: "center", marginTop: 10 }}>
      <RingflowWheel mini mode="dark" activeSegment="monitor" centerLabel="状态" />
    </div>
  </div>
);

export const AppConfigurationScreenshot = () => (
  <div
    style={{
      width: 900,
      borderRadius: 26,
      overflow: "hidden",
      boxShadow: "0 30px 90px rgba(25, 47, 80, 0.20), 0 2px 16px rgba(25, 47, 80, 0.12)",
      border: "1px solid rgba(255,255,255,0.74)",
    }}
  >
    <Img src={staticFile(assets.brand.appScreenshot)} style={{ width: "100%", display: "block" }} />
  </div>
);

export const PresetLibraryShowcase = () => (
  <div style={{ position: "relative", width: 760, height: 430 }}>
    <div
      style={{
        ...panel("light"),
        position: "absolute",
        inset: "20px 70px 0 0",
        borderRadius: 28,
        padding: 28,
      }}
    >
      <div style={{ fontSize: 24, color: "#64748b", fontWeight: 720, marginBottom: 22 }}>预设库</div>
      {["AI 写作助手", "开发者工作流", "会议记录整理"].map((title, index) => (
        <div
          key={title}
          style={{
            height: 82,
            borderRadius: 18,
            padding: "0 22px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            marginBottom: 14,
            background: index === 0 ? "rgba(232,244,255,0.92)" : "rgba(248,250,252,0.88)",
            border: "1px solid rgba(226,232,240,0.84)",
          }}
        >
          <div>
            <div style={{ fontSize: 24, fontWeight: 780, color: "#263244" }}>{title}</div>
            <div style={{ marginTop: 5, fontSize: 16, color: "#64748b" }}>动作库 + 轮盘布局 + 分组外环</div>
          </div>
          <div style={{ color: "#2f7fd3", fontSize: 18, fontWeight: 760 }}>导入</div>
        </div>
      ))}
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
