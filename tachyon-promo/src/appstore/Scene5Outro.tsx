import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { COLORS, StageContainer } from "./SharedStyles";

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const logoSpring = spring({
    frame,
    fps: 30,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.85, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const textSpring = spring({
    frame: frame - 10,
    fps: 30,
    config: { damping: 16, stiffness: 100, mass: 0.8 },
  });
  const textY = interpolate(textSpring, [0, 1], [25, 0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  const badgeSpring = spring({
    frame: frame - 20,
    fps: 30,
    config: { damping: 16, stiffness: 100, mass: 0.8 },
  });
  const badgeY = interpolate(badgeSpring, [0, 1], [25, 0]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);

  // Subtle end fade out in last 15 frames
  const endOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <StageContainer>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: endOpacity,
          padding: "0 60px",
          boxSizing: "border-box",
        }}
      >
        {/* Tachyon Vector Emblem */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            marginBottom: 36,
          }}
        >
          <svg width={130} height={130} viewBox="0 0 100 100">
            <line
              x1="50"
              y1="10"
              x2="50"
              y2="90"
              stroke="#7A7A85"
              strokeWidth="2.5"
            />
            <line
              x1="10"
              y1="50"
              x2="90"
              y2="50"
              stroke="#7A7A85"
              strokeWidth="2.5"
            />
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="none"
              stroke="#7A7A85"
              strokeWidth="2.5"
            />
            <polygon
              points="26,26 74,26 74,36 56,36 56,76 44,76 44,36 26,36"
              fill={COLORS.ink}
            />
            <circle
              cx="50"
              cy="50"
              r="6.5"
              fill={COLORS.crimson}
              style={{
                filter: "drop-shadow(0 0 12px rgba(255,69,58,0.8))",
              }}
            />
          </svg>
        </div>

        {/* Wordmark and Tagline */}
        <div
          style={{
            transform: `translateY(${textY}px)`,
            opacity: textOpacity,
            textAlign: "center",
            marginBottom: 44,
          }}
        >
          <h1
            style={{
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: "0.28em",
              color: COLORS.ink,
              margin: "0 0 16px",
              textTransform: "uppercase",
            }}
          >
            TACHYON
          </h1>
          <p
            style={{
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: "-0.015em",
              color: COLORS.sub,
              margin: 0,
            }}
          >
            Read faster than thought.
          </p>
        </div>

        {/* App Store Badge Button */}
        <div
          style={{
            transform: `translateY(${badgeY}px)`,
            opacity: badgeOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "#08080A",
              color: "#FFFFFF",
              padding: "16px 36px",
              borderRadius: 40,
              boxShadow: "0 14px 35px rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* Apple Logo Icon */}
            <svg width={26} height={26} viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.62-.77 1.05-1.84.93-2.92-.93.04-2.02.63-2.67 1.4-.58.67-1.09 1.76-.95 2.82 1.04.08 2.07-.53 2.69-1.3" />
            </svg>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}
              >
                Available on the
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                App Store
              </div>
            </div>
          </div>

          {/* Feature Badges */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 12,
            }}
          >
            {["Optimal Recognition Point", "EPUB & PDF", "Offline First"].map(
              (pill) => (
                <div
                  key={pill}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.ink,
                    background: "rgba(0,0,0,0.06)",
                    padding: "8px 16px",
                    borderRadius: 20,
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  {pill}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </StageContainer>
  );
};
