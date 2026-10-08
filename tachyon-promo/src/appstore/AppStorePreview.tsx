import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";

import { Scene1Speed } from "./Scene1Speed";
import { Scene2Library } from "./Scene2Library";
import { Scene3Themes } from "./Scene3Themes";
import { Scene4Audio } from "./Scene4Audio";
import { Scene5Outro } from "./Scene5Outro";

export const AppStorePreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#F7F6F2" }}>
      {/* Background Synchronized Audio */}
      <Audio
        src={staticFile("audio/demo_soundtrack.wav")}
        volume={1.0}
      />

      <TransitionSeries>
        {/* Scene 1: Speed Reader Engine */}
        <TransitionSeries.Sequence durationInFrames={135} name="01 · RSVP Speed">
          <Scene1Speed />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 2: Personal Digital Library */}
        <TransitionSeries.Sequence durationInFrames={135} name="02 · Library">
          <Scene2Library />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 3: Dual Themes Day & Night */}
        <TransitionSeries.Sequence durationInFrames={135} name="03 · Themes">
          <Scene3Themes />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 4: Audio Metronome & Pacing */}
        <TransitionSeries.Sequence durationInFrames={135} name="04 · Audio">
          <Scene4Audio />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 5: Brand Outro */}
        <TransitionSeries.Sequence durationInFrames={120} name="05 · Finale">
          <Scene5Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
