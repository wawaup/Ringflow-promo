import { Easing, interpolate, useCurrentFrame } from "remotion";
import { GalleryTile, rotateApps } from "../components/Promo/AppGallery";
import { FONT_STACK } from "../components/Text/PromoText";
import { EASE, ease01 } from "../config/motion";
import { theme } from "../config/theme";
import { scenes } from "../config/timeline";
import { SceneShell } from "./SceneShell";

const scene = scenes.find((item) => item.id === "app-gallery")!;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const TILE = 108;
const GAP = 26;
const STEP = TILE + GAP;

/** Four film-strip rows, alternating directions and speeds. */
const ROWS = [
  { offset: 0, dir: 1, speed: 1.5 },
  { offset: 7, dir: -1, speed: 2.0 },
  { offset: 14, dir: 1, speed: 1.3 },
  { offset: 21, dir: -1, speed: 1.8 },
] as const;
const ROW_SPACING = 154;
const ROWS_TOP = 540 - ((ROWS.length - 1) * ROW_SPACING) / 2 - TILE / 2;

/**
 * Shot 9 — 应用长廊。
 * Film strips of the world's most-used social & productivity apps scroll
 * horizontally in alternating directions;「支持 Mac 上的所有应用」floats on
 * top; then every strip accelerates off to its own side, clearing the stage
 * for the outro.
 */
export const AppGalleryScene = () => {
  const frame = useCurrentFrame();
  const c = scene.choreography;
  const exitStart = c.actionStartFrame;

  const titleIn = ease01(frame, c.textStartFrame, 26);
  const titleOut = interpolate(frame, [exitStart, exitStart + 18], [1, 0], CLAMP);
  // Soft veil under the title so it stays readable over the moving strips.
  const veil = interpolate(frame, [c.textStartFrame - 8, c.textStartFrame + 16], [0, 0.42], CLAMP) * titleOut;

  return (
    <SceneShell scene={scene} hideText stageWidth={1920} stageHeight={1080} pushIn={0}>
      <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", fontFamily: FONT_STACK }}>
        {ROWS.map((row, index) => {
          const apps = rotateApps(row.offset);
          const listW = apps.length * STEP;
          const rowIn = ease01(frame, (c.visualStartFrame ?? 6) + index * 5, 20);
          // Continuous scroll, wrapped over three copies of the list.
          const scrolled = ((frame * row.speed) % listW + listW) % listW;
          const baseX = row.dir > 0 ? -listW + scrolled : -scrolled;
          // Roll away to this row's own side: the strip ACCELERATES in its own
          // scroll direction and dissolves as it whooshes out (向两边滚动收起).
          const exitP = interpolate(frame, [exitStart + index * 5, exitStart + index * 5 + 44], [0, 1], {
            ...CLAMP,
            easing: Easing.in(Easing.quad),
          });
          const exitX = row.dir * exitP * 2400;

          return (
            <div
              key={row.offset}
              style={{
                position: "absolute",
                left: 0,
                top: ROWS_TOP + index * ROW_SPACING,
                display: "flex",
                gap: GAP,
                opacity: rowIn * (1 - exitP),
                transform: `translateX(${baseX + exitX + (1 - rowIn) * row.dir * -60}px)`,
              }}
            >
              {[0, 1, 2].map((copy) =>
                apps.map((app) => <GalleryTile key={`${copy}-${app.id}`} app={app} size={TILE} />),
              )}
            </div>
          );
        })}

        {/* Readability veil + floating title */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 300,
            width: 1920,
            height: 480,
            background: "radial-gradient(ellipse 62% 100% at 50% 50%, rgba(248,249,252,0.95) 0%, rgba(248,249,252,0.6) 55%, transparent 78%)",
            opacity: veil / 0.42,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 108,
              fontWeight: 780,
              letterSpacing: "-0.01em",
              backgroundImage: theme.gradients.headlineLight,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              opacity: titleIn * titleOut,
              transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0], { easing: EASE })}px)`,
            }}
          >
            支持 Mac 上的所有应用
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
