import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { Curiosity } from "./scenes/01-Curiosity";
import { Focus } from "./scenes/02-Focus";
import { ReaderScene } from "./scenes/03-Reader";
import { Library } from "./scenes/04-Library";
import { Personal } from "./scenes/05-Personal";
import { Anywhere } from "./scenes/06-Anywhere";
import { Finale } from "./scenes/07-Finale";
import "./fonts.css";

export const Film: React.FC = () => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence
        durationInFrames={390}
        name="01 · A world worth reading"
      >
        <Curiosity />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 30 })}
      />
      <TransitionSeries.Sequence
        durationInFrames={510}
        name="02 · One word. Full focus."
      >
        <Focus />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 30 })}
      />
      <TransitionSeries.Sequence
        durationInFrames={630}
        name="03 · Find your reading flow"
      >
        <ReaderScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 30 })}
      />
      <TransitionSeries.Sequence
        durationInFrames={630}
        name="04 · Your next world"
      >
        <Library />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 30 })}
      />
      <TransitionSeries.Sequence
        durationInFrames={630}
        name="05 · Your pace. Your palette."
      >
        <Personal />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 30 })}
      />
      <TransitionSeries.Sequence
        durationInFrames={510}
        name="06 · Make the everyday count"
      >
        <Anywhere />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 30 })}
      />
      <TransitionSeries.Sequence durationInFrames={480} name="07 · More you">
        <Finale />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Sequence from={0} durationInFrames={3600} name="Original electronic score">
      <Audio src={staticFile("audio/more-you.wav")} />
    </Sequence>
  </AbsoluteFill>
);
