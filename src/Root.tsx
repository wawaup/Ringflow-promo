import { Composition } from "remotion";
import { PromoFilm } from "./PromoFilm";
import { composition } from "./config/timeline";

export const RemotionRoot = () => {
  return (
    <Composition
      id="RingflowPromo"
      component={PromoFilm}
      durationInFrames={composition.durationInFrames}
      fps={composition.fps}
      width={composition.width}
      height={composition.height}
    />
  );
};
