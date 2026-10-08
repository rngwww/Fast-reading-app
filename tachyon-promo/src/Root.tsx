import { Composition, Folder } from "remotion";
import { Film } from "./Film";
import { Curiosity } from "./scenes/01-Curiosity";
import { Focus } from "./scenes/02-Focus";
import { ReaderScene } from "./scenes/03-Reader";
import { Library } from "./scenes/04-Library";
import { Personal } from "./scenes/05-Personal";
import { Anywhere } from "./scenes/06-Anywhere";
import { Finale } from "./scenes/07-Finale";

import { AppStorePreview } from "./appstore/AppStorePreview";
import { Scene1Speed } from "./appstore/Scene1Speed";
import { Scene2Library } from "./appstore/Scene2Library";
import { Scene3Themes } from "./appstore/Scene3Themes";
import { Scene4Audio } from "./appstore/Scene4Audio";
import { Scene5Outro } from "./appstore/Scene5Outro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AppStorePreview"
        component={AppStorePreview}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="AppStore">
        <Composition
          id="AppStore-Scene1"
          component={Scene1Speed}
          durationInFrames={135}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="AppStore-Scene2"
          component={Scene2Library}
          durationInFrames={135}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="AppStore-Scene3"
          component={Scene3Themes}
          durationInFrames={135}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="AppStore-Scene4"
          component={Scene4Audio}
          durationInFrames={135}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="AppStore-Scene5"
          component={Scene5Outro}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Composition
        id="Tachyon-More-You"
        component={Film}
        durationInFrames={3600}
        fps={60}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition
          id="Curiosity"
          component={Curiosity}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={390}
        />
        <Composition
          id="Focus"
          component={Focus}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={510}
        />
        <Composition
          id="Reader"
          component={ReaderScene}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={630}
        />
        <Composition
          id="Library"
          component={Library}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={630}
        />
        <Composition
          id="Personal"
          component={Personal}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={630}
        />
        <Composition
          id="Anywhere"
          component={Anywhere}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={510}
        />
        <Composition
          id="Finale"
          component={Finale}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={480}
        />
      </Folder>
    </>
  );
};
