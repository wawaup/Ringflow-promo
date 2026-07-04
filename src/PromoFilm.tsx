import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile } from "remotion";
import { assets } from "./config/assets";
import { composition, scenes, type SceneId } from "./config/timeline";
import {
  AppProfilesScene,
  FeatureRunScene,
  FrictionScene,
  GestureScene,
  GroupRingScene,
  OutroScene,
  PresetLibraryScene,
  RevealScene,
  UmbrellaScene,
} from "./scenes";

const SCENE_MAP: Record<SceneId, React.ComponentType> = {
  friction: FrictionScene,
  reveal: RevealScene,
  gesture: GestureScene,
  umbrella: UmbrellaScene,
  "feature-run": FeatureRunScene,
  "group-ring": GroupRingScene,
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
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            // Extended past the nominal end so the next scene cross-dissolves in
            durationInFrames={scene.durationInFrames + scene.overlapWithNextFrames}
          >
            <Scene />
          </Sequence>
        );
      })}
      <Audio
        src={staticFile(assets.audio.music)}
        trimBefore={120}
        volume={(f) =>
          interpolate(
            f,
            [0, 70, composition.durationInFrames - 110, composition.durationInFrames - 10],
            [0, 0.3, 0.3, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
    </AbsoluteFill>
  );
};
