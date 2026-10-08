import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { PhoneFrame } from "./PhoneFrame";
import { AnimatedHeader, COLORS, StageContainer, TachyonLogo } from "./SharedStyles";

export const Scene4Audio: React.FC = () => {
  const frame = useCurrentFrame();

  const phoneSpring = spring({
    frame,
    fps: 30,
    config: { damping: 16, stiffness: 100, mass: 0.9 },
  });

  const phoneY = interpolate(phoneSpring, [0, 1], [120, 0]);
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.94, 1]);

  // Toggle switch animation: flips ON at frame 20
  const toggleSpring = spring({
    frame: frame - 20,
    fps: 30,
    config: { damping: 14, stiffness: 140, mass: 0.7 },
  });
  const toggleProgress = interpolate(toggleSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slider animation: glides from 400 WPM up to 700 WPM between frame 25 and 95
  const sliderProgress = interpolate(frame, [25, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentWpm = Math.round(400 + sliderProgress * 300);

  // Audio equalizer bars: 14 bars oscillating to 120 BPM tempo
  const numBars = 14;
  const bars = Array.from({ length: numBars }, (_, i) => {
    const phaseOffset = i * 0.45;
    const wave = Math.sin((frame * Math.PI * 2) / 15 + phaseOffset);
    const heightPct = toggleProgress > 0.5 ? Math.max(16, 22 + Math.abs(wave) * 72) : 8;
    return heightPct;
  });

  return (
    <StageContainer>
      <AnimatedHeader
        category="Rhythmic Audio & Pacing"
        headline="Find Your Perfect Flow"
        subheadline="Rhythmic metronome clicks lock your mental focus into pure flow"
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

        <PhoneFrame width={540} height={1140}>
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#08080A",
              color: "#FFFFFF",
              padding: "70px 22px 24px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Header */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  paddingBottom: 14,
                  marginBottom: 16,
                }}
              >
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
                    Cadence & Audio
                  </h2>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                    Focus metronome and speed pacing
                  </span>
                </div>
                <span
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    padding: "6px 12px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Settings
                </span>
              </div>

              {/* Setting Card 1: Audio Metronome */}
              <div
                style={{
                  background: "linear-gradient(135deg, #14141B 0%, #0E0E14 100%)",
                  borderRadius: 20,
                  padding: "16px 18px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: 14,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                      Audio Metronome
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.5)",
                        marginTop: 2,
                      }}
                    >
                      Acoustic clicks match your reading speed
                    </div>
                  </div>

                  {/* Tactile Toggle Switch */}
                  <div
                    style={{
                      width: 56,
                      height: 30,
                      borderRadius: 15,
                      background:
                        toggleProgress > 0.5 ? COLORS.crimson : "rgba(255,255,255,0.2)",
                      padding: 3,
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      boxShadow:
                        toggleProgress > 0.5
                          ? "0 0 16px rgba(255,69,58,0.5)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "#FFFFFF",
                        transform: `translateX(${interpolate(
                          toggleProgress,
                          [0, 1],
                          [0, 26]
                        )}px)`,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                      }}
                    />
                  </div>
                </div>

                {/* Animated Equalizer Waveform */}
                <div
                  style={{
                    height: 50,
                    background: "rgba(0,0,0,0.35)",
                    borderRadius: 12,
                    padding: "0 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {bars.map((height, i) => (
                    <div
                      key={i}
                      style={{
                        width: 5,
                        height: `${height}%`,
                        borderRadius: 3,
                        background:
                          toggleProgress > 0.5 ? COLORS.crimson : "rgba(255,255,255,0.2)",
                        boxShadow:
                          toggleProgress > 0.5
                            ? "0 0 8px rgba(255,69,58,0.4)"
                            : "none",
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 8,
                  }}
                >
                  <span>120 BPM Acoustic Pulse</span>
                  <span style={{ color: COLORS.crimson, fontWeight: 700 }}>
                    {toggleProgress > 0.5 ? "ACTIVE • SYNCED" : "OFF"}
                  </span>
                </div>
              </div>

              {/* Setting Card 2: Speed Velocity */}
              <div
                style={{
                  background: "linear-gradient(135deg, #14141B 0%, #0E0E14 100%)",
                  borderRadius: 20,
                  padding: "16px 18px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: 14,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                      Reading Velocity
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.5)",
                        marginTop: 2,
                      }}
                    >
                      Instantaneous pace control
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                    <span style={{ fontSize: 24, fontWeight: 900, color: "#FFFFFF" }}>
                      {currentWpm}
                    </span>
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: COLORS.crimson }}
                    >
                      WPM
                    </span>
                  </div>
                </div>

                {/* Animated Slider Track */}
                <div
                  style={{
                    position: "relative",
                    height: 8,
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 4,
                    margin: "10px 4px",
                  }}
                >
                  <div
                    style={{
                      width: `${sliderProgress * 100}%`,
                      height: "100%",
                      background: COLORS.crimson,
                      borderRadius: 4,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${sliderProgress * 100}%`,
                      transform: "translate(-50%, -50%)",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "#FFFFFF",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      border: `2px solid ${COLORS.crimson}`,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 6,
                  }}
                >
                  <span>300 WPM</span>
                  <span>700 WPM</span>
                  <span>1,200 WPM</span>
                </div>
              </div>

              {/* Setting Card 3: Focal Color Selection */}
              <div
                style={{
                  background: "linear-gradient(135deg, #14141B 0%, #0E0E14 100%)",
                  borderRadius: 20,
                  padding: "16px 18px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      Focal Point Palette
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                      Optimal Recognition Point highlight
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { color: "#FF453A", active: true },
                      { color: "#FF9F0A", active: false },
                      { color: "#30D158", active: false },
                      { color: "#64D2FF", active: false },
                    ].map((palette, i) => (
                      <div
                        key={i}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: palette.color,
                          border: palette.active
                            ? "2px solid white"
                            : "2px solid transparent",
                          boxShadow: palette.active
                            ? `0 0 10px ${palette.color}`
                            : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Setting Card 4: Typography Engine */}
              <div
                style={{
                  background: "linear-gradient(135deg, #14141B 0%, #0E0E14 100%)",
                  borderRadius: 20,
                  padding: "14px 18px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Font Family</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                      Optimized for rapid scanning
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      padding: "4px 12px",
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    SF Pro Display
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status */}
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                Haptic Engine
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#34C759" }}>
                Light Tap Pulse Enabled
              </span>
            </div>
          </div>
        </PhoneFrame>
      </div>

      <div style={{ marginTop: 24 }}>
        <TachyonLogo size={28} />
      </div>
    </StageContainer>
  );
};
