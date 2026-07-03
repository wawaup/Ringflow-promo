import { interpolate, useCurrentFrame } from "remotion";
import { MacContextMenu } from "../MacUI/MacContextMenu";
import { MacMenuBar } from "../MacUI/MacMenuBar";
import { MacWindow } from "../MacUI/MacWindow";

/**
 * FrictionWorkflow — the film's opening friction montage.
 * Real macOS chrome only: menu bar → dropdown → cascading submenu → a second
 * window appears (app switching). Three stages timed via choreography.
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

  // Three stages of friction: menu → submenu → window switch
  const menuStage = interpolate(frame, [visual, visual + 26, action + 10], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subStage = interpolate(frame, [action - 6, action + 18, action + 44], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const switchStage = interpolate(frame, [action + 38, action + 62], [0, 1], {
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

      {/* Main document window — real usage context, sits right under its menu bar */}
      <div style={{ position: "absolute", left: 60, top: 28 }}>
        <MacWindow title="迭代计划.md" width={520} height={200}>
          <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.65 }}>
            需要把会议纪要里的三件事同步到代码注释里…<br />
            <span style={{ opacity: 0.7 }}>添加订阅状态刷新逻辑</span>
          </div>
        </MacWindow>
      </div>

      {/* Dropdown opened from "编辑" in the menu bar — real menu-bar friction */}
      <div
        style={{
          position: "absolute",
          left: 152,
          top: 66,
          opacity: menuStage,
          transform: `translateY(${(1 - menuStage) * 10}px)`,
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

      {/* Submenu cascading further from "替换…" — the extra hop that costs time */}
      <div
        style={{
          position: "absolute",
          left: 336,
          top: 150,
          opacity: subStage,
          transform: `translateY(${(1 - subStage) * 8}px)`,
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

      {/* App/window switching cost — another real window appears, clear of the submenu above it */}
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
