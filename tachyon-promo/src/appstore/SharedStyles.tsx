import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";

export const COLORS = {
  bg: "#F7F6F2",
  ink: "#111116",
  sub: "#656570",
  crimson: "#FF453A",
  cardDark: "#121217",
  cardLight: "#FFFFFF",
  gold: "#FFB340",
};

export const StageContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        backgroundColor: COLORS.bg,
        color: COLORS.ink,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', Arial, sans-serif",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Archival paper radial subtle warm vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.45) 0%, rgba(228, 225, 216, 0.6) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const AnimatedHeader: React.FC<{
  category: string;
  headline: string;
  subheadline?: string;
  delay?: number;
}> = ({ category, headline, subheadline, delay = 0 }) => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(
    frame - delay,
    [0, 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const headerY = interpolate(
    frame - delay,
    [0, 15],
    [24, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        width: 960,
        textAlign: "center",
        marginTop: 100,
        marginBottom: 20,
        opacity: headerOpacity,
        transform: `translateY(${headerY}px)`,
      }}
    >
      {/* Category Pill Tag */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: COLORS.crimson,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            width: 24,
            height: 1.5,
            background: COLORS.crimson,
            display: "inline-block",
            opacity: 0.8,
          }}
        />
        <span>{category}</span>
        <span
          style={{
            width: 24,
            height: 1.5,
            background: COLORS.crimson,
            display: "inline-block",
            opacity: 0.8,
          }}
        />
      </div>

      {/* Main Headline */}
      <h1
        style={{
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          color: COLORS.ink,
          margin: 0,
          padding: 0,
        }}
      >
        {headline}
      </h1>

      {subheadline && (
        <p
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: COLORS.sub,
            marginTop: 10,
            marginBottom: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {subheadline}
        </p>
      )}
    </div>
  );
};

export const TachyonLogo: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 32, color = COLORS.ink }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100">
      <line x1="50" y1="10" x2="50" y2="90" stroke="#7A7A85" strokeWidth="3" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="#7A7A85" strokeWidth="3" />
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke="#7A7A85"
        strokeWidth="3"
      />
      <polygon
        points="26,26 74,26 74,36 56,36 56,76 44,76 44,36 26,36"
        fill={color}
      />
      <circle cx="50" cy="50" r="6" fill={COLORS.crimson} />
    </svg>
    <span
      style={{
        fontSize: size * 0.72,
        fontWeight: 900,
        letterSpacing: "0.24em",
        color,
        textTransform: "uppercase",
      }}
    >
      TACHYON
    </span>
  </div>
);
