import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../design";

export const books = [
  {
    title: "THE ART OF\nNOTICING",
    category: "A little more wonder",
    color: C.red,
    ink: C.paper,
    kind: 0,
  },
  {
    title: "SMALL\nWORLDS",
    category: "A new perspective",
    color: C.lilac,
    ink: C.ink,
    kind: 1,
  },
  {
    title: "MAKE\nSPACE",
    category: "Ideas for a fuller life",
    color: C.lime,
    ink: C.ink,
    kind: 2,
  },
  {
    title: "BEYOND\nTHE BLUE",
    category: "Follow your curiosity",
    color: C.blue,
    ink: C.ink,
    kind: 3,
  },
];

export const Book: React.FC<{
  index?: number;
  width?: number;
  flat?: boolean;
}> = ({ index = 0, width = 300, flat = false }) => {
  const b = books[index % 4];
  const f = useCurrentFrame();
  return (
    <div
      style={{
        width,
        height: width * 1.37,
        position: "relative",
        borderRadius: "5px 16px 16px 5px",
        background: b.color,
        color: b.ink,
        boxShadow: flat
          ? "none"
          : "12px 16px 0 #171820, 22px 36px 50px #17182025",
        overflow: "hidden",
        borderLeft: "8px solid #00000018",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "9%",
          top: "7%",
          fontSize: width * 0.042,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        TACHYON EDITIONS / 0{index + 1}
      </div>
      <div
        style={{
          position: "absolute",
          left: "9%",
          top: "17%",
          fontWeight: 800,
          fontSize: width * 0.122,
          lineHeight: 0.98,
          letterSpacing: -width * 0.004,
          whiteSpace: "pre-line",
        }}
      >
        {b.title}
      </div>
      <svg
        viewBox="0 0 300 260"
        style={{
          position: "absolute",
          width: "100%",
          height: "57%",
          bottom: "9%",
        }}
      >
        {b.kind === 0 && (
          <g transform={`translate(150 137) rotate(${Math.sin(f / 100) * 6})`}>
            {Array.from({ length: 14 }, (_, i) => (
              <ellipse
                key={i}
                rx="94"
                ry="30"
                fill="none"
                stroke={b.ink}
                strokeWidth="2.8"
                transform={`rotate(${i * 12.85})`}
              />
            ))}
          </g>
        )}
        {b.kind === 1 && (
          <g>
            {[100, 77, 54, 31].map((r, i) => (
              <circle
                key={r}
                cx={150 + i * 6}
                cy={133 - i * 4}
                r={r}
                fill={i % 2 ? b.color : b.ink}
              />
            ))}
            <circle cx="217" cy="57" r="21" fill={C.red} />
          </g>
        )}
        {b.kind === 2 && (
          <g transform="translate(60 34)">
            {Array.from({ length: 6 }, (_, i) => (
              <rect
                key={i}
                x={i * 19}
                y={i * 20}
                width="79"
                height="92"
                rx="40"
                fill={i % 2 ? b.color : b.ink}
                stroke={b.ink}
                strokeWidth="2"
              />
            ))}
          </g>
        )}
        {b.kind === 3 && (
          <g>
            <circle cx="190" cy="83" r="45" fill={C.red} />
            {Array.from({ length: 7 }, (_, i) => (
              <path
                key={i}
                d={`M-20 ${120 + i * 17} Q80 ${60 + i * 18} 160 ${137 + i * 17} T340 ${115 + i * 18}`}
                fill="none"
                stroke={b.ink}
                strokeWidth="9"
              />
            ))}
          </g>
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          left: "9%",
          bottom: "6%",
          fontSize: width * 0.048,
          fontWeight: 600,
        }}
      >
        {b.category}
      </div>
    </div>
  );
};
