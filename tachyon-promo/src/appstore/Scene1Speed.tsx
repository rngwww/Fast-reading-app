import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { PhoneFrame } from "./PhoneFrame";
import { AnimatedHeader, StageContainer, TachyonLogo } from "./SharedStyles";

export const Scene1Speed: React.FC = () => {
  const frame = useCurrentFrame();

  const phoneSpring = spring({
    frame,
    fps: 30,
    config: { damping: 16, stiffness: 100, mass: 0.9 },
  });

  const phoneY = interpolate(phoneSpring, [0, 1], [120, 0]);
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.94, 1]);

  return (
    <StageContainer>
      <AnimatedHeader
        category="Rapid Serial Visual Presentation"
        headline="Read at the Speed of Thought"
        subheadline="Real-time RSVP speed engine with zero eye movement required"
      />

      <div
        style={{
          position: "relative",
          marginTop: 20,
          transform: `translateY(${phoneY}px) scale(${phoneScale})`,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Soft ground shadow */}
        <div
          style={{
            position: "absolute",
            bottom: -35,
            width: 480,
            height: 60,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, transparent 75%)",
            filter: "blur(20px)",
            zIndex: 0,
          }}
        />

        <PhoneFrame width={540} height={1140} notch={false}>
          {/* Actual In-App Screen Recording */}
          <Video
            src={staticFile("recordings/real_reader.mp4")}
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

      <div style={{ marginTop: 24 }}>
        <TachyonLogo size={28} />
      </div>
    </StageContainer>
  );
};
