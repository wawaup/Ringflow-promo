import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { assets } from "./config/assets";
import { scenes, type SceneId } from "./config/timeline";
import {
  AppProfilesScene,
  CoreGestureScene,
  FrictionScene,
  IntroFocusScene,
  MacroSequenceScene,
  MonitorScene,
  NearerConceptScene,
  OutroScene,
  PresetLibraryScene,
  QuickInputScene,
  QuickOpenScene,
  ShellScriptScene,
  ShortcutsScene,
  StickyNoteScene,
} from "./scenes";

const SCENE_MAP: Record<SceneId, React.ComponentType> = {
  "intro-focus": IntroFocusScene,
  friction: FrictionScene,
  "nearer-concept": NearerConceptScene,
  "core-gesture": CoreGestureScene,
  "quick-input": QuickInputScene,
  "quick-open": QuickOpenScene,
  "sticky-note": StickyNoteScene,
  "macro-sequence": MacroSequenceScene,
  "shell-script": ShellScriptScene,
  shortcuts: ShortcutsScene,
  monitor: MonitorScene,
  "app-profiles": AppProfilesScene,
  "preset-library": PresetLibraryScene,
  outro: OutroScene,
};

export const PromoFilm = () => {
  return (
    <AbsoluteFill>
      {scenes.map((scene) => {
        const Scene = SCENE_MAP[scene.id];
        if (!Scene) {
          // Safety: should never happen once timeline and map are aligned
          return null;
        }
        return (
          <Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.durationInFrames}>
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile(assets.audio.music)} trimBefore={120} volume={0.32} />
    </AbsoluteFill>
  );
};
