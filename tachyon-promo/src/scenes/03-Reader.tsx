import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Phone } from "../components/Reader";
import { C, Stage, Head, Label, enter, clamp, Arrow, Waves } from "../design";
export const ReaderScene: React.FC = () => {
  const f = useCurrentFrame();
  const speed =
    Math.round(interpolate(f, [70, 230, 480], [300, 420, 420], clamp) / 10) *
    10;
  return (
    <Stage chapter="02 / GET INTO YOUR FLOW">
      <div
        style={{
          position: "absolute",
          width: 850,
          height: 850,
          borderRadius: "50%",
          background: C.red,
          left: 980,
          top: 180,
          scale: enter(f, 10),
        }}
      />
      <Waves color={C.red} opacity={0.12} />
      <div style={{ position: "absolute", left: 110, top: 253, width: 830 }}>
        <Label>Built around your attention</Label>
        <Head text="Find your" size={119} />
        <Head text="reading flow." size={119} color={C.red} delay={12} />
        <div
          style={{
            fontSize: 34,
            lineHeight: 1.5,
            width: 640,
            marginTop: 33,
            opacity: enter(f, 65),
          }}
        >
          Less noise. More story.
          <br />
          Set the pace. Settle into the moment.
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 43,
            opacity: enter(f, 140),
          }}
        >
          {["Precise focus", "Smooth pacing"].map((t) => (
            <div
              key={t}
              style={{
                padding: "15px 23px",
                border: "1px solid #17182025",
                borderRadius: 50,
                fontSize: 23,
                fontWeight: 600,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1154,
          top: 134,
          translate: `0 ${(1 - enter(f, 15)) * 850 + Math.sin(f / 90) * 9}px`,
        }}
      >
        <Phone
          scale={0.88}
          wpm={speed}
          rotateY={interpolate(f, [0, 400], [-27, -8], clamp)}
          rotateZ={-5 + Math.sin(f / 130) * 2}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 987,
          top: 673,
          background: C.lime,
          borderRadius: 23,
          padding: "23px 31px",
          boxShadow: "0 15px 30px #00000015",
          opacity: enter(f, 220),
          translate: `${-60 * (1 - enter(f, 220))}px 0`,
          rotate: "-5deg",
        }}
      >
        <div style={{ fontSize: 15, letterSpacing: 2, fontWeight: 700 }}>
          YOUR READING RHYTHM
        </div>
        <div
          style={{
            fontSize: 51,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {speed}
          <span style={{ fontSize: 22, fontWeight: 500 }}>WPM</span>
          <Arrow />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 111,
          bottom: 89,
          fontSize: 22,
          color: "#74747D",
          opacity: enter(f, 300),
        }}
      >
        Pause. Breathe. Pick up exactly where you left off.
      </div>
    </Stage>
  );
};
