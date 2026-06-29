import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { assets } from "./config/assets";
import { scenes } from "./config/timeline";
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
  ProductRevealScene,
  QuickInputScene,
  QuickOpenScene,
  ShellScriptScene,
  ShortcutsScene,
  StickyNoteScene,
} from "./scenes";

const sceneComponents = [
  IntroFocusScene,
  FrictionScene,
  NearerConceptScene,
  ProductRevealScene,
  CoreGestureScene,
  QuickInputScene,
  QuickOpenScene,
  StickyNoteScene,
  MacroSequenceScene,
  ShellScriptScene,
  ShortcutsScene,
  MonitorScene,
  AppProfilesScene,
  PresetLibraryScene,
  OutroScene,
] as const;

export const PromoFilm = () => {
  return (
    <AbsoluteFill>
      {scenes.map((scene, index) => {
        const Scene = sceneComponents[index];
        return (
          <Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.durationInFrames}>
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile(assets.audio.music)} volume={0.32} />
    </AbsoluteFill>
  );
};
