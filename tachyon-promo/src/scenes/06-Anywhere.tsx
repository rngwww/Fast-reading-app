import React from "react";
import { useCurrentFrame } from "remotion";
import { C, Stage, Head, enter, Label, Arrow } from "../design";
const Art: React.FC<{ type: number }> = ({ type }) => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 480 370" width="100%" height="300">
      <g
        fill="none"
        stroke={C.ink}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === 0 && (
          <>
            <rect
              x="100"
              y="105"
              width="220"
              height="145"
              rx="13"
              fill={C.paper}
            />
            <path d="M320 133H350Q394 176 350 213H322" />
            <path d="M75 269H352" />
            <path
              d={`M156 77Q130 50 159 ${22 + Math.sin(f / 30) * 10}M221 77Q198 48 226 18M282 77Q254 48 278 20`}
              stroke={C.red}
            />
            <ellipse cx="210" cy="110" rx="104" ry="14" fill={C.ink} />
          </>
        )}
        {type === 1 && (
          <>
            <rect
              x="50"
              y="58"
              width="380"
              height="211"
              rx="31"
              fill={C.paper}
            />
            <rect x="79" y="86" width="115" height="90" rx="14" fill={C.blue} />
            <rect
              x="221"
              y="86"
              width="177"
              height="90"
              rx="14"
              fill={C.lilac}
            />
            <path d="M90 215H130M350 215H390M50 241H430" />
            <circle cx="121" cy="279" r="20" fill={C.ink} />
            <circle cx="360" cy="279" r="20" fill={C.ink} />
            <path d="M24 312H455" />
            <path
              d={`M${-40 + ((f * 2) % 130)} 340h65M${170 + ((f * 2) % 130)} 340h65`}
              stroke={C.red}
            />
          </>
        )}
        {type === 2 && (
          <>
            <path d="M62 280H427" />
            <path d="M295 280V116L342 66L389 116H295" fill={C.lilac} />
            <path
              d="M90 280V185Q130 112 180 185V280M180 235H258V280"
              fill={C.paper}
            />
            <path d="M180 215L230 193L274 220L220 238Z" fill={C.red} />
            <circle cx="115" cy="61" r="30" fill={C.lime} />
            <path d="M92 58L110 43" stroke={C.paper} />
          </>
        )}
      </g>
    </svg>
  );
};
export const Anywhere: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage chapter="05 / A LITTLE MORE EVERY DAY" bg={C.blue}>
      <div style={{ position: "absolute", left: 110, top: 175 }}>
        <Label color={C.ink}>Small moments. New possibilities.</Label>
        <Head text="Make the everyday count." size={104} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 414,
          display: "flex",
          gap: 30,
        }}
      >
        {[
          "Your morning pause.",
          "Your daily journey.",
          "Your evening escape.",
        ].map((t, i) => (
          <div
            key={t}
            style={{
              flex: 1,
              height: 433,
              borderRadius: 32,
              background: [C.lime, C.lilac, "#F8D8CF"][i],
              padding: "21px 21px 30px",
              opacity: enter(f, 25 + i * 18),
              translate: `0 ${140 * (1 - enter(f, 25 + i * 18))}px`,
              rotate: `${Math.sin(f / 100 + i) * 0.7}deg`,
            }}
          >
            <Art type={i} />
            <div
              style={{
                fontSize: 29,
                fontWeight: 700,
                textAlign: "center",
                marginTop: 14,
              }}
            >
              {t}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 89,
          left: 110,
          right: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 30,
          fontWeight: 600,
          opacity: enter(f, 165),
        }}
      >
        <span>A whole world of reading. Wherever life takes you.</span>
        <Arrow size={39} />
      </div>
    </Stage>
  );
};
