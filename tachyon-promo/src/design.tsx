import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";
import { StaggeredFadeUp } from "./remotion/primitives/staggered-fade-up";

export const C = {
  paper: "#F6F3EA",
  ink: "#171820",
  red: "#FF2A54",
  lilac: "#CBBEFF",
  lime: "#DEEF75",
  blue: "#BDE4F2",
  grey: "#858590",
  dark: "#08080A",
};
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const enter = (f: number, delay = 0, duration = 48) =>
  interpolate(f, [delay, delay + duration], [0, 1], { ...clamp, easing: ease });
export const pop = (f: number, delay = 0) =>
  spring({
    frame: f - delay,
    fps: 60,
    config: { damping: 18, stiffness: 130, mass: 1 },
  });

export const Logo: React.FC<{ color?: string; size?: number }> = ({
  color = C.ink,
  size = 28,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      fontSize: size,
      fontWeight: 800,
      letterSpacing: 5,
      color,
    }}
  >
    <svg width={size + 8} height={size + 8} viewBox="0 0 40 40">
      <path d="M7 10H33M20 10V33" stroke={color} strokeWidth="5" />
      <circle cx="20" cy="20" r="5" fill={C.red} />
    </svg>
    TACHYON
  </div>
);

export const Stage: React.FC<
  React.PropsWithChildren<{ bg?: string; dark?: boolean; chapter?: string }>
> = ({ children, bg = C.paper, dark = false, chapter }) => (
  <AbsoluteFill
    style={{
      background: bg,
      color: dark ? "white" : C.ink,
      fontFamily: "Manrope, Arial, sans-serif",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 100,
        right: 100,
        top: 57,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <Logo color={dark ? "white" : C.ink} />
      <div
        style={{
          fontSize: 22,
          letterSpacing: 3,
          fontWeight: 600,
          opacity: 0.55,
        }}
      >
        {chapter}
      </div>
    </div>
    {children}
  </AbsoluteFill>
);

export const Head: React.FC<{
  text: string;
  size?: number;
  color?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ text, size = 108, color = C.ink, delay = 0, style }) => (
  <div style={{ letterSpacing: -5, lineHeight: 1.04, ...style }}>
    <StaggeredFadeUp
      text={text}
      fontSize={size}
      fontWeight={800}
      color={color}
      delayInFrames={delay}
      durationInFrames={35}
      staggerInFrames={7}
    />
  </div>
);

export const Label: React.FC<React.PropsWithChildren<{ color?: string }>> = ({
  children,
  color = C.red,
}) => (
  <div
    style={{
      fontSize: 23,
      fontWeight: 800,
      letterSpacing: 3,
      color,
      textTransform: "uppercase",
      marginBottom: 24,
    }}
  >
    {children}
  </div>
);

export const Arrow: React.FC<{ size?: number; color?: string }> = ({
  size = 30,
  color = "currentColor",
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M5 16H26M17 7L26 16L17 25"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Spark: React.FC<{
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ color = C.red, size = 120, style }) => {
  const f = useCurrentFrame();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ position: "absolute", rotate: `${f * 0.14}deg`, ...style }}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d="M50 5L50 95"
          stroke={color}
          strokeWidth="5"
          transform={`rotate(${i * 15} 50 50)`}
        />
      ))}
    </svg>
  );
};

export const Waves: React.FC<{ color?: string; opacity?: number }> = ({
  color = C.red,
  opacity = 0.18,
}) => {
  const f = useCurrentFrame();
  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
      }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={`M-200 ${730 + i * 24} C${450 + Math.sin(f / 140) * 100} ${330 + i * 28},${1050 + Math.cos(f / 170) * 150} ${1160 + i * 15},2120 ${560 + i * 38}`}
          fill="none"
          stroke={color}
          strokeWidth={i === 0 ? 3 : 1.2}
        />
      ))}
    </svg>
  );
};

export const Pill: React.FC<
  React.PropsWithChildren<{ color?: string; dark?: boolean }>
> = ({ children, color = C.lime, dark = false }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 18,
      padding: "18px 26px",
      borderRadius: 50,
      background: color,
      color: dark ? "white" : C.ink,
      fontSize: 25,
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);
