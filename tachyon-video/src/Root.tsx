import { Composition } from "remotion";
import { TachyonPromo } from "./compositions/tachyon-promo";
import { Scene1 } from "./compositions/tachyon-promo/Scene1";
import { Scene2 } from "./compositions/tachyon-promo/Scene2";
import { Scene3 } from "./compositions/tachyon-promo/Scene3";
import { Scene4 } from "./compositions/tachyon-promo/Scene4";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Scene1"
        component={Scene1}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene2"
        component={Scene2}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene3"
        component={Scene3}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene4"
        component={Scene4}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TachyonPromo"
        component={TachyonPromo}
        durationInFrames={855} // 150 + 300 + 210 + 240 - 45 (for transitions)
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
