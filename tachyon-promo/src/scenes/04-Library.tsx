import React from "react";
import { useCurrentFrame } from "remotion";
import { Book, books } from "../components/Book";
import { C, Stage, Head, Label, enter, Spark, Arrow } from "../design";
export const Library: React.FC = () => {
  const f = useCurrentFrame();
  const settle = enter(f, 235, 70);
  return (
    <Stage chapter="03 / FOLLOW YOUR CURIOSITY" bg={C.lilac}>
      <div style={{ position: "absolute", left: 110, top: 172 }}>
        <Label color={C.ink}>Your library, reimagined</Label>
        <Head text="Your next world is waiting." size={100} />
      </div>
      <Spark color={C.paper} size={100} style={{ right: 124, top: 198 }} />
      {books.map((b, i) => {
        const x = 190 + i * 403;
        const y = 417 + Math.sin(i * 2) * 20;
        return (
          <div
            key={b.title}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: enter(f, 30 + i * 15),
              transform: `perspective(1400px) translateY(${(1 - enter(f, 30 + i * 15)) * 350 + Math.sin(f / 95 + i) * 9}px) rotateY(${-14 + settle * 9}deg) rotateZ(${[-8, 3, -3, 8][i] * (1 - settle * 0.75)}deg)`,
            }}
          >
            <Book index={i} width={280} />
            <div
              style={{
                marginTop: 39,
                fontSize: 22,
                fontWeight: 600,
                opacity: enter(f, 160 + i * 15),
              }}
            >
              {
                [
                  "Discover something new",
                  "See another perspective",
                  "Make time for ideas",
                  "Go a little further",
                ][i]
              }
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          bottom: 77,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: enter(f, 315),
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 600 }}>
          The stories you love. Ready when you are.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 23,
            fontWeight: 700,
          }}
        >
          Open your library <Arrow />
        </div>
      </div>
    </Stage>
  );
};
