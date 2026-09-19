import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Book } from "../components/Book";
import { C, Stage, Head, Spark, enter, clamp, Pill, Arrow } from "../design";
export const Curiosity: React.FC = () => {
  const f = useCurrentFrame();
  const turn = interpolate(f, [115, 153], [0, 1], clamp);
  return (
    <Stage chapter="A WORLD WORTH READING">
      <div
        style={{
          position: "absolute",
          width: 930,
          height: 930,
          borderRadius: "50%",
          background: C.lilac,
          left: 1150,
          top: -170,
          scale: enter(f, 10) * 1.1,
        }}
      />
      <div style={{ position: "absolute", left: 110, top: 250, width: 1100 }}>
        <Head text="So much" size={144} />
        <div style={{ height: 180, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              opacity: 1 - turn,
              translate: `0 ${-70 * turn}px`,
            }}
          >
            <Head text="to discover." size={144} color={C.red} delay={14} />
          </div>
          <div
            style={{
              position: "absolute",
              opacity: turn,
              translate: `0 ${70 * (1 - turn)}px`,
            }}
          >
            <Head text="to become." size={144} color={C.red} />
          </div>
        </div>
        <div
          style={{
            fontSize: 35,
            color: "#676770",
            marginTop: 24,
            opacity: enter(f, 50),
          }}
        >
          Make room for the ideas that move you.
        </div>
        <div
          style={{
            marginTop: 43,
            opacity: enter(f, 178),
            translate: `${50 * (1 - enter(f, 178))}px 0`,
          }}
        >
          <Pill>
            Meet your next chapter <Arrow />
          </Pill>
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 1280 + i * 24,
            top: 170 + i * 69,
            transform: `perspective(1500px) translateY(${(1 - enter(f, 30 + i * 12)) * 700 + Math.sin(f / 68 + i) * 12}px) rotateY(-22deg) rotateZ(${[-18, 9, -4][i] + Math.sin(f / 120) * 3}deg)`,
            zIndex: 3 - i,
          }}
        >
          <Book index={i} width={310} />
        </div>
      ))}
      <Spark size={150} style={{ left: 1120, top: 780 }} />
      <div
        style={{
          position: "absolute",
          left: 110,
          bottom: 80,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 2,
          opacity: enter(f, 60),
        }}
      >
        LESS SCROLLING. MORE POSSIBILITY.
      </div>
    </Stage>
  );
};
