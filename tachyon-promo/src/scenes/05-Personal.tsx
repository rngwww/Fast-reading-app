import React from "react";
import { useCurrentFrame } from "remotion";
import { Phone } from "../components/Reader";
import { C, Stage, Head, Label, enter, Spark } from "../design";
export const Personal: React.FC = () => {
  const f = useCurrentFrame();
  const selected = f < 215 ? 0 : f < 390 ? 1 : 2;
  const accent = [C.red, C.lilac, "#4E7160"][selected];
  return (
    <Stage chapter="04 / MAKE IT YOURS">
      <div style={{ position: "absolute", left: 100, top: 166 }}>
        <Label>Designed for your kind of mind</Label>
        <Head text="Your pace." size={116} />
        <Head text="Your palette." size={116} color={C.red} delay={12} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1140,
          top: 130,
          translate: `0 ${90 * (1 - enter(f, 5))}px`,
          opacity: enter(f, 5),
        }}
      >
        <Phone
          light={selected === 2}
          accent={accent}
          wpm={380}
          scale={0.86}
          rotateY={-10 + Math.sin(f / 150) * 7}
          rotateZ={4}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 523,
          width: 770,
          opacity: enter(f, 45),
        }}
      >
        <div style={{ display: "flex", gap: 19 }}>
          {[
            { name: "Obsidian", bg: C.dark, fg: "white" },
            { name: "Graphite", bg: "#302D39", fg: C.lilac },
            { name: "Parchment", bg: "#E7DAC0", fg: "#4E7160" },
          ].map((t, i) => (
            <div
              key={t.name}
              style={{
                width: 206,
                padding: 17,
                borderRadius: 24,
                background: "white",
                border: `2px solid ${selected === i ? accent : "transparent"}`,
                translate: `0 ${selected === i ? -10 : 0}px`,
                boxShadow: selected === i ? "0 15px 32px #17182012" : "none",
              }}
            >
              <div
                style={{
                  height: 100,
                  borderRadius: 15,
                  background: t.bg,
                  color: t.fg,
                  fontSize: 49,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Aa
              </div>
              <div
                style={{
                  fontSize: 20,
                  marginTop: 15,
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {t.name}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 33, fontSize: 26, fontWeight: 600 }}>
          A look that feels like you.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 857,
          display: "flex",
          alignItems: "center",
          gap: 32,
          opacity: enter(f, 140),
        }}
      >
        <div
          style={{ display: "flex", gap: 5, height: 47, alignItems: "center" }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                borderRadius: 5,
                height: 9 + Math.abs(Math.sin(f / 12 + i * 0.8)) * 33,
                background: C.red,
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 26 }}>Sound on. World out.</span>
      </div>
      <Spark color={C.lime} size={95} style={{ left: 968, top: 281 }} />
    </Stage>
  );
};
