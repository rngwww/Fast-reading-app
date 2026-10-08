import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { PhoneFrame } from "./PhoneFrame";
import { AnimatedHeader, COLORS, StageContainer, TachyonLogo } from "./SharedStyles";

const MEDITATIONS_WORDS = [
  "Waste", "no", "more", "time", "arguing", "about", "what", "a", "good", "man",
  "should", "be.", "Be", "one.", "When", "you", "arise", "in", "the", "morning",
  "think", "of", "what", "a", "privilege", "it", "is", "to", "be", "alive,",
  "to", "think,", "to", "enjoy,", "to", "love.", "The", "happiness", "of", "your",
  "life", "depends", "upon", "the", "quality", "of", "your", "thoughts.",
  "Very", "little", "is", "needed", "to", "make", "a", "happy", "life;", "it",
  "is", "all", "within", "yourself,", "in", "your", "way", "of", "thinking."
];

export const Scene1Speed: React.FC = () => {
  const frame = useCurrentFrame();

  // Smooth entrance of phone
  const phoneSpring = spring({
    frame,
    fps: 30,
    config: { damping: 16, stiffness: 100, mass: 0.9 },
  });

  const phoneY = interpolate(phoneSpring, [0, 1], [120, 0]);
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.94, 1]);

  // RSVP word calculations: 700 WPM at 30 fps = ~2.57 frames per word
  const framesPerWord = 2.57;
  const wordIndex = Math.min(
    Math.floor(frame / framesPerWord) % MEDITATIONS_WORDS.length,
    MEDITATIONS_WORDS.length - 1
  );
  const currentWord = MEDITATIONS_WORDS[wordIndex] || "Focus";

  // Calculate Optimal Recognition Point (focal letter)
  const pivot = Math.min(
    currentWord.length - 1,
    Math.max(0, Math.floor(currentWord.length * 0.35))
  );
  const leftSlice = currentWord.slice(0, pivot);
  const focalChar = currentWord[pivot];
  const rightSlice = currentWord.slice(pivot + 1);

  // Dynamic reading progress: 24% to 54%
  const progressPct = Math.min(
    54,
    Math.round(24 + (frame / 135) * 30)
  );

  return (
    <StageContainer>
      <AnimatedHeader
        category="Rapid Serial Visual Presentation"
        headline="Read at the Speed of Thought"
        subheadline="Lock every word directly onto your Optimal Recognition Point at 700 WPM"
      />

      {/* Device Stage */}
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
          {/* Inner Phone UI: Obsidian Dark Mode */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#08080A",
              color: "#FFFFFF",
              padding: "70px 24px 30px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Top Reader Header */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 4px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: COLORS.crimson,
                      fontWeight: 700,
                    }}
                  >
                    Active Book
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>
                    Meditations • Marcus Aurelius
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    padding: "6px 12px",
                    borderRadius: 14,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Book II
                </div>
              </div>
            </div>

            {/* Central RSVP Reading Display */}
            <div
              style={{
                height: 320,
                background: "linear-gradient(160deg, #131318 0%, #0D0D10 100%)",
                borderRadius: 28,
                border: "1px solid rgba(255,255,255,0.1)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
              }}
            >
              {/* Focus Guide Marks (Center Crosshair Ticks) */}
              <div
                style={{
                  position: "absolute",
                  top: 48,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 2,
                  height: 22,
                  background: COLORS.crimson,
                  opacity: 0.85,
                  borderRadius: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 48,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 2,
                  height: 22,
                  background: COLORS.crimson,
                  opacity: 0.85,
                  borderRadius: 1,
                }}
              />

              {/* Streaming Word with Centered ORP Pivot */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "baseline",
                  width: "100%",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  fontSize: 54,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                <span
                  style={{
                    textAlign: "right",
                    color: "rgba(255,255,255,0.92)",
                    paddingRight: 2,
                  }}
                >
                  {leftSlice}
                </span>
                <span
                  style={{
                    color: COLORS.crimson,
                    fontWeight: 800,
                    textShadow: "0 0 20px rgba(255,69,58,0.5)",
                  }}
                >
                  {focalChar}
                </span>
                <span
                  style={{
                    textAlign: "left",
                    color: "rgba(255,255,255,0.92)",
                    paddingLeft: 2,
                  }}
                >
                  {rightSlice}
                </span>
              </div>

              {/* In-box Progress Indicator */}
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 24,
                  right: 24,
                  height: 4,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: "100%",
                    background: COLORS.crimson,
                    borderRadius: 2,
                    boxShadow: "0 0 10px rgba(255,69,58,0.6)",
                  }}
                />
              </div>
            </div>

            {/* Reading Stats & Controls */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 20,
                  padding: "0 6px",
                }}
              >
                <span>Chapter Progress</span>
                <span style={{ fontWeight: 600, color: "#FFFFFF" }}>
                  {progressPct}% • 14 min remaining
                </span>
              </div>

              {/* Playback Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 36,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  ↺ 10s
                </div>
                {/* Active Play Button */}
                <div
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: "50%",
                    background: COLORS.crimson,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 25px rgba(255,69,58,0.45)",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <rect x="5" y="4" width="4" height="16" rx="2" />
                    <rect x="15" y="4" width="4" height="16" rx="2" />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  10s ↻
                </div>
              </div>

              {/* Speed Badge Pill */}
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 20,
                  padding: "12px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: COLORS.crimson,
                      boxShadow: "0 0 8px #FF453A",
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                    Reading Velocity
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF" }}>
                    700
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.crimson }}>
                    WPM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* Footer Branding */}
      <div style={{ marginTop: 24 }}>
        <TachyonLogo size={28} />
      </div>
    </StageContainer>
  );
};
