import { Img, staticFile } from "remotion";
import { assets } from "../../config/assets";

type AppLogoMarkProps = {
  size?: number;
};

export const AppLogoMark = ({ size = 168 }: AppLogoMarkProps) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.22),
      boxShadow: "0 28px 72px rgba(24, 45, 92, 0.22), 0 8px 24px rgba(24, 45, 92, 0.14)",
      overflow: "hidden",
    }}
  >
    <Img
      src={staticFile(assets.brand.appLogo)}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  </div>
);
