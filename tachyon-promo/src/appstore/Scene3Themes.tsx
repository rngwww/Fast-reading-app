import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { PhoneFrame } from "./PhoneFrame";
import { AnimatedHeader, StageContainer, TachyonLogo } from "./SharedStyles";

export const Scene3Themes: React.FC = () => {
  const frame = useCurrentFrame();

  const leftSpring = spring({
    frame,
    fps: 30,
    config: { damping: 15, stiffness: 90, mass: 0.9 },
  });

  const rightSpring = spring({
    frame: frame - 4,
    fps: 30,
    config: { damping: 15, stiffness: 90, mass: 0.9 },
  });

  const leftX = interpolate(leftSpring, [0, 1], [-80, 0]);
  const rightX = interpolate(rightSpring, [0, 1], [80, 0]);
  const phoneY = interpolate(leftSpring, [0, 1], [60, 0]);

  return (
    <StageContainer>
      <AnimatedHeader
        category="Day & Night Reading Comfort"
        headline="Effortless Focus Day & Night"
        subheadline="High-contrast typography crafted for pitch darkness and direct sunlight"
      />

      <div
        style={{
          position: "relative",
          marginTop: 20,
          display: "flex",
          justifyContent: "center",
          gap: 24,
          transform: `translateY(${phoneY}px)`,
        }}
      >
        {/* Soft ground shadows */}
        <div
          style={{
            position: "absolute",
            bottom: -35,
            width: 820,
            height: 60,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, transparent 75%)",
            filter: "blur(20px)",
            zIndex: 0,
          }}
        />

        {/* Left Phone: Actual Obsidian Dark Recording */}
        <div style={{ transform: `translateX(${leftX}px)` }}>
          <PhoneFrame width={440} height={980} notch={false}>
            <Video
              src={staticFile("recordings/real_dark.mp4")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              muted
            />
          </PhoneFrame>
        </div>

        {/* Right Phone: Actual Vellum Light Recording */}
        <div style={{ transform: `translateX(${rightX}px)` }}>
          <PhoneFrame width={440} height={980} notch={false}>
            <Video
              src={staticFile("recordings/real_light.mp4")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              muted
            />
          </PhoneFrame>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <TachyonLogo size={28} />
      </div>
    </StageContainer>
  );
};
