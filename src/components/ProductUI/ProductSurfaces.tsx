import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MacContextMenu } from "../MacUI/MacContextMenu";
import { MacMenuBar } from "../MacUI/MacMenuBar";
import { MacWindow } from "../MacUI/MacWindow";

/** Sharper close than the open — menus snap shut once a real choice is made. */
const EASE_CLOSE = Easing.bezier(0.4, 0, 0.68, 0.06);

/**
 * FrictionWorkflow — the film's opening friction montage.
 * Real macOS chrome only: menu bar → dropdown → cascading submenu, both close
 * together once "打开方式" is chosen, THEN the window switch happens. The menu
 * group and the switched-to window are never visible at meaningful opacity at
 * the same time — mirrors how a real app-switch would dismiss any open menu.
 */
export const FrictionWorkflow = ({
  choreography,
}: {
  choreography?: { visualStartFrame?: number; actionStartFrame?: number };
} = {}) => {
  const frame = useCurrentFrame();
  const c = choreography || {};
  const visual = c.visualStartFrame ?? 42;
  const action = c.actionStartFrame ?? 76;

  // Stage 1: open — dropdown, then cascading submenu.
  const menuOpenStart = visual;
  const subOpenStart = action - 6;
  // Stage 2: chosen — both menus close together (no more "menu forever open").
  const exitStart = action + 32;
  const exitDur = 26;
  const exitEnd = exitStart + exitDur;
  // Stage 3: switch — only begins after the menu group has fully closed.
  const switchStart = exitEnd + 4;

  const menuIn = interpolate(frame, [menuOpenStart, menuOpenStart + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subIn = interpolate(frame, [subOpenStart, subOpenStart + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const groupExit = interpolate(frame, [exitStart, exitEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_CLOSE,
  });
  const menuStage = menuIn * groupExit;
  const subStage = subIn * groupExit;

  // Main window loses focus once the menu closes — makes room for the switch
  // instead of staying at full opacity and fighting the new window visually.
  const focusOpacity = interpolate(frame, [0, exitStart, exitStart + 18], [1, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const switchStage = interpolate(frame, [switchStart, switchStart + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const editMenuActive = menuStage > 0.4;

  return (
    <div style={{ position: "relative", width: 780, height: 460 }}>
      {/* Real macOS menu bar for the focused app — sets the real-app context */}
      <div style={{ position: "absolute", left: 60, top: 0, borderRadius: "10px 10px 0 0", overflow: "hidden" }}>
        <MacMenuBar
          appName="文本编辑"
          menus={["文件", "编辑", "格式", "窗口"]}
          activeMenu={editMenuActive ? "编辑" : undefined}
          width={520}
        />
      </div>

      {/* Main document window — loses focus once the menu closes, making room for the switch */}
      <div style={{ position: "absolute", left: 60, top: 28, opacity: focusOpacity }}>
        <MacWindow title="迭代计划.md" width={520} height={200}>
          <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.65 }}>
            需要把会议纪要里的三件事同步到代码注释里…<br />
            <span style={{ opacity: 0.7 }}>添加订阅状态刷新逻辑</span>
          </div>
        </MacWindow>
      </div>

      {/* Dropdown opened from "编辑" in the menu bar — closes together with the submenu once chosen */}
      <div
        style={{
          position: "absolute",
          left: 152,
          top: 66,
          opacity: menuStage,
          transform: `translateY(${(1 - menuIn) * 10 - (1 - groupExit) * 8}px) scale(${0.97 + groupExit * 0.03})`,
        }}
      >
        <MacContextMenu
          width={190}
          items={[
            { label: "剪切", shortcut: "⌘X" },
            { label: "拷贝", shortcut: "⌘C" },
            { label: "粘贴", shortcut: "⌘V" },
            { label: "服务", hasSubmenu: true, separatorBefore: true },
            { label: "替换…", hasSubmenu: true, selected: true },
          ]}
        />
      </div>

      {/* Submenu cascading further from "替换…" — closes together with the dropdown above it */}
      <div
        style={{
          position: "absolute",
          left: 336,
          top: 150,
          opacity: subStage,
          transform: `translateY(${(1 - subIn) * 8 - (1 - groupExit) * 8}px) scale(${0.97 + groupExit * 0.03})`,
        }}
      >
        <MacContextMenu
          width={170}
          items={[
            { label: "转换文本" },
            { label: "朗读" },
            { label: "打开方式", hasSubmenu: true, selected: true },
          ]}
        />
      </div>

      {/* App/window switching cost — only appears after the menu group has fully closed */}
      <div
        style={{
          position: "absolute",
          left: 480,
          top: 270,
          opacity: switchStage,
          transform: `translateY(${(1 - switchStage) * 12}px)`,
        }}
      >
        <MacWindow title="备忘录" width={210} height={130} mode="light">
          <div style={{ fontSize: 13, color: "#475569" }}>
            Notes · Finder · Terminal<br />
            <span style={{ color: "#1f5f9f" }}>来回切换…</span>
          </div>
        </MacWindow>
      </div>
    </div>
  );
};
