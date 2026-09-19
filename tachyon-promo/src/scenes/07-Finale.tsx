import React from "react";
import { useCurrentFrame } from "remotion";
import { C, Stage, Head, enter, Waves, Arrow, Spark } from "../design";
import { ParticleField } from "../remotion/primitives/particle-field";
export const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = enter(f, 165, 60);
  return (
    <Stage chapter="MAKE ROOM FOR MORE" bg={C.red} dark>
      <Waves color={C.paper} opacity={0.24} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <ParticleField
          color={C.paper}
          backgroundColor="transparent"
          count={25}
          size={7}
          speed={0.4}
          depthBlur={0}
          glow={0}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 240,
          width: 1300,
          opacity: 1 - reveal,
          translate: `0 ${-60 * reveal}px`,
        }}
      >
        <Head text="More stories." size={125} color={C.paper} />
        <Head text="More ideas." size={125} color={C.paper} delay={35} />
        <Head text="More you." size={125} color={C.lime} delay={72} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 288,
          textAlign: "center",
          opacity: reveal,
          translate: `0 ${70 * (1 - reveal)}px`,
        }}
      >
        <div
          style={{
            fontSize: 169,
            fontWeight: 800,
            letterSpacing: -8,
            color: C.paper,
          }}
        >
          TACHYON<span style={{ color: C.lime }}>.</span>
        </div>
        <div style={{ fontSize: 41, marginTop: 17, fontWeight: 500 }}>
          Read faster than thought.
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 28,
            marginTop: 54,
            borderRadius: 70,
            padding: "23px 36px",
            background: C.lime,
            color: C.ink,
            fontSize: 29,
            fontWeight: 800,
            opacity: enter(f, 220),
          }}
        >
          Find your reading flow <Arrow size={34} />
        </div>
        <div
          style={{
            fontSize: 23,
            marginTop: 28,
            opacity: enter(f, 245) * 0.9,
            letterSpacing: 1,
          }}
        >
          rngwww.github.io/Fast-reading-app
        </div>
      </div>
      <Spark
        color={C.lime}
        size={200}
        style={{ left: 1530, top: 350, scale: 1 - reveal * 0.4 }}
      />
      <div
        style={{
          position: "absolute",
          left: 110,
          bottom: 80,
          fontSize: 21,
          letterSpacing: 2,
          opacity: 0.85,
        }}
      >
        A NEW CHAPTER STARTS WITH A SINGLE WORD.
      </div>
    </Stage>
  );
};
