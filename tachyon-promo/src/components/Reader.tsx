import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, clamp, Logo } from "../design";

const passage =
  "Make room for the stories that move you the ideas that stay with you and the worlds you have yet to discover".split(
    " ",
  );
export const FocusWord: React.FC<{
  word: string;
  size?: number;
  color?: string;
  accent?: string;
}> = ({ word, size = 76, color = "white", accent = C.red }) => {
  const pivot = Math.min(word.length - 1, Math.floor(word.length * 0.35));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "baseline",
        width: "100%",
        fontFamily: "Arial, sans-serif",
        fontSize: size,
        fontWeight: 600,
        letterSpacing: -1,
        color,
      }}
    >
      <span style={{ textAlign: "right" }}>{word.slice(0, pivot)}</span>
      <span style={{ color: accent }}>{word[pivot]}</span>
      <span>{word.slice(pivot + 1)}</span>
    </div>
  );
};

export const Reader: React.FC<{
  light?: boolean;
  accent?: string;
  playing?: boolean;
  wpm?: number;
  compact?: boolean;
}> = ({
  light = false,
  accent = C.red,
  playing = true,
  wpm = 420,
  compact = false,
}) => {
  const f = useCurrentFrame();
  const index = Math.floor(f / (3600 / wpm)) % passage.length;
  const word = playing ? passage[index] : "possibility";
  const fg = light ? C.ink : "#F8F8FA";
  const sub = light ? "#73716D" : "#93939D";
  return (
    <div
      style={{
        width: 500,
        height: 850,
        borderRadius: 43,
        background: light ? "#F5EDDA" : C.dark,
        color: fg,
        overflow: "hidden",
        position: "relative",
        padding: "56px 30px 28px",
        boxSizing: "border-box",
        fontFamily: "Manrope, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 29,
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        9:41
      </div>
      <div style={{ position: "absolute", top: 18, right: 29, fontSize: 14 }}>
        ● ▰
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "8px 0 27px",
        }}
      >
        <Logo color={fg} size={23} />
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 14,
          color: sub,
          marginTop: -18,
          marginBottom: 29,
        }}
      >
        Read faster than thought.
      </div>
      <div
        style={{
          display: "flex",
          gap: 26,
          justifyContent: "center",
          fontSize: 17,
          color: sub,
          marginBottom: 33,
        }}
      >
        <span
          style={{
            color: fg,
            borderBottom: `2px solid ${accent}`,
            paddingBottom: 13,
          }}
        >
          Reader
        </span>
        <span>Library</span>
        <span>Appearance</span>
      </div>
      <div
        style={{
          height: 290,
          position: "relative",
          borderRadius: 26,
          border: `1px solid ${light ? "#17182018" : "#FFFFFF14"}`,
          background: light
            ? "#FFFCF488"
            : "linear-gradient(145deg,#22222C,#101015)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 25,
            left: 23,
            fontSize: 12,
            letterSpacing: 2,
            color: sub,
          }}
        >
          THE ART OF NOTICING
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 83,
            width: 1,
            height: 24,
            background: accent,
            opacity: 0.65,
          }}
        />
        <FocusWord
          word={word}
          size={compact ? 51 : 58}
          color={fg}
          accent={accent}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 73,
            width: 1,
            height: 24,
            background: accent,
            opacity: 0.65,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            right: 24,
            height: 3,
            background: light ? "#17182012" : "#FFFFFF12",
            borderRadius: 5,
          }}
        >
          <div
            style={{
              height: 3,
              width: `${28 + ((f / 60) % 42)}%`,
              background: accent,
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          color: sub,
          margin: "17px 4px 28px",
        }}
      >
        <span>CHAPTER 01</span>
        <span>{Math.floor(28 + ((f / 60) % 42))}% complete</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 42,
        }}
      >
        <span style={{ fontSize: 25, color: sub }}>↶</span>
        <div
          style={{
            height: 68,
            width: 68,
            borderRadius: 34,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 10px 35px ${accent}33`,
          }}
        >
          <svg width="25" height="25" viewBox="0 0 24 24" fill="white">
            {playing ? (
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            ) : (
              <path d="M7 4L20 12L7 20z" />
            )}
          </svg>
        </div>
        <span style={{ fontSize: 25, color: sub }}>↷</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 8,
          marginTop: 23,
        }}
      >
        <span style={{ fontSize: 39, fontWeight: 700 }}>{wpm}</span>
        <span style={{ fontSize: 14, color: sub }}>WPM</span>
      </div>
      <div
        style={{
          height: 4,
          background: light ? "#17182022" : "#FFFFFF20",
          margin: "25px 15px 19px",
          position: "relative",
          borderRadius: 3,
        }}
      >
        <div style={{ height: 4, width: "57%", background: accent }} />
        <div
          style={{
            position: "absolute",
            left: "57%",
            top: -7,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: fg,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: sub,
          fontSize: 12,
          margin: "0 15px",
        }}
      >
        <span>YOUR PACE</span>
        <span>YOUR POSSIBILITIES</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 170,
          width: 160,
          height: 5,
          borderRadius: 4,
          background: fg,
          opacity: 0.5,
        }}
      />
    </div>
  );
};

export const Phone: React.FC<{
  light?: boolean;
  accent?: string;
  playing?: boolean;
  wpm?: number;
  scale?: number;
  rotateY?: number;
  rotateZ?: number;
}> = ({ scale = 1, rotateY = -14, rotateZ = -4, ...props }) => (
  <div
    style={{
      width: 524,
      height: 874,
      padding: 12,
      background:
        "linear-gradient(135deg,#D4D4D8,#515159 24%,#D6D6DE 47%,#303037 70%,#A3A3AC)",
      borderRadius: 55,
      boxSizing: "border-box",
      transform: `perspective(2000px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
      transformStyle: "preserve-3d",
      boxShadow:
        "17px 17px 0 #24242B, 21px 20px 0 #9898A3, 45px 65px 75px #17182035",
    }}
  >
    <Reader {...props} />
    <div
      style={{
        position: "absolute",
        top: 23,
        left: 208,
        width: 110,
        height: 23,
        borderRadius: 20,
        background: "#000",
      }}
    />
  </div>
);
