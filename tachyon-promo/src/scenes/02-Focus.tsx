import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FocusWord } from "../components/Reader";
import { C, Stage, Head, Label, enter, clamp, Waves } from "../design";
export const Focus: React.FC = () => {
  const f = useCurrentFrame();
  const collapse = interpolate(f, [40, 145], [0, 1], clamp);
  const words = [
    "stories",
    "curiosity",
    "ideas",
    "discovery",
    "wonder",
    "possibility",
    "creativity",
    "perspective",
    "inspiration",
  ];
  const hero = f < 230 ? "focus" : f < 325 ? "momentum" : "possibility";
  return (
    <Stage chapter="01 / FIND YOUR FOCUS" bg={C.lime}>
      <Waves color={C.ink} opacity={0.09} />
      <div style={{ position: "absolute", top: 184, left: 110 }}>
        <Label color={C.ink}>A different way to read</Label>
        <Head text="One word. Full focus." size={106} />
      </div>
      {words.map((w, i) => {
        const x = 200 + (i % 3) * 660;
        const y = 425 + Math.floor(i / 3) * 140;
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: x + (960 - x) * collapse,
              top: y + (620 - y) * collapse,
              fontSize: 37,
              fontWeight: 600,
              color: C.ink,
              opacity: (1 - collapse) * 0.35,
              rotate: `${(i % 2 ? 1 : -1) * 5 * (1 - collapse)}deg`,
            }}
          >
            {w}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 350,
          top: 433,
          width: 1220,
          height: 302,
          borderRadius: 30,
          background: C.dark,
          boxShadow: "0 30px 65px #27340025",
          opacity: enter(f, 85),
          scale: 0.86 + 0.14 * enter(f, 85),
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 37,
            width: 2,
            height: 37,
            background: C.red,
          }}
        />
        <FocusWord word={hero} size={126} />
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 37,
            width: 2,
            height: 37,
            background: C.red,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 30,
            fontSize: 17,
            color: "#8A8A96",
            letterSpacing: 3,
          }}
        >
          TACHYON READER
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 820,
          textAlign: "center",
          fontSize: 35,
          fontWeight: 500,
          opacity: enter(f, 165),
        }}
      >
        A steady focal point. A rhythm that’s yours.
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 890,
          textAlign: "center",
          fontSize: 20,
          letterSpacing: 3,
          opacity: enter(f, 190) * 0.5,
        }}
      >
        LET THE WORDS COME TO YOU
      </div>
    </Stage>
  );
};
