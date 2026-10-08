import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { PhoneFrame } from "./PhoneFrame";
import { AnimatedHeader, COLORS, StageContainer, TachyonLogo } from "./SharedStyles";

const DARK_WORDS = [
  "Waste", "no", "more", "time", "arguing", "about", "what", "a", "good", "man",
  "should", "be.", "Be", "one.", "Live", "with", "virtue,", "courage,", "and", "wisdom."
];

const LIGHT_WORDS = [
  "The", "physical", "world", "is", "structured", "by", "space,", "time,", "and",
  "motion.", "Nothing", "is", "faster", "than", "light", "across", "the", "universe."
];

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

  // Words streaming at ~500 WPM (3.6 frames per word)
  const framesPerWord = 3.6;
  const darkIndex = Math.floor(frame / framesPerWord) % DARK_WORDS.length;
  const lightIndex = Math.floor(frame / framesPerWord) % LIGHT_WORDS.length;

  const darkWord = DARK_WORDS[darkIndex];
  const lightWord = LIGHT_WORDS[lightIndex];

  const getSlices = (word: string) => {
    const pivot = Math.min(
      word.length - 1,
      Math.max(0, Math.floor(word.length * 0.35))
    );
    return {
      left: word.slice(0, pivot),
      focal: word[pivot],
      right: word.slice(pivot + 1),
    };
  };

  const darkSlices = getSlices(darkWord);
  const lightSlices = getSlices(lightWord);

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

        {/* Left Phone: Obsidian Dark */}
        <div style={{ transform: `translateX(${leftX}px)` }}>
          <PhoneFrame width={440} height={980}>
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#08080A",
                color: "#FFFFFF",
                padding: "60px 18px 20px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Header Bar */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    paddingBottom: 10,
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    Obsidian Dark
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                    Book II
                  </span>
                </div>

                {/* Book Info Card */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 14,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 38,
                      borderRadius: 4,
                      background: COLORS.crimson,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    M
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Meditations</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                      Marcus Aurelius
                    </div>
                  </div>
                </div>
              </div>

              {/* RSVP Reader Card */}
              <div
                style={{
                  height: 250,
                  background: "linear-gradient(160deg, #131318 0%, #0D0D10 100%)",
                  borderRadius: 22,
                  border: "1px solid rgba(255,255,255,0.1)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Guide ticks */}
                <div
                  style={{
                    position: "absolute",
                    top: 32,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 2,
                    height: 18,
                    background: COLORS.crimson,
                    borderRadius: 1,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 32,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 2,
                    height: 18,
                    background: COLORS.crimson,
                    borderRadius: 1,
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "baseline",
                    width: "100%",
                    fontSize: 42,
                    fontWeight: 700,
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  }}
                >
                  <span style={{ textAlign: "right", color: "rgba(255,255,255,0.9)" }}>
                    {darkSlices.left}
                  </span>
                  <span
                    style={{
                      color: COLORS.crimson,
                      fontWeight: 800,
                      textShadow: "0 0 15px rgba(255,69,58,0.5)",
                    }}
                  >
                    {darkSlices.focal}
                  </span>
                  <span style={{ textAlign: "left", color: "rgba(255,255,255,0.9)" }}>
                    {darkSlices.right}
                  </span>
                </div>

                {/* Mini progress bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 20,
                    right: 20,
                    height: 3,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 2,
                  }}
                >
                  <div
                    style={{
                      width: "68%",
                      height: "100%",
                      background: COLORS.crimson,
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 28,
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>↺</span>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: COLORS.crimson,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 18px rgba(255,69,58,0.4)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <rect x="5" y="4" width="4" height="16" rx="2" />
                      <rect x="15" y="4" width="4" height="16" rx="2" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>↻</span>
                </div>

                <div
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                    Reading Speed
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>
                    500 WPM
                  </span>
                </div>
              </div>
            </div>
          </PhoneFrame>
        </div>

        {/* Right Phone: Vellum Light */}
        <div style={{ transform: `translateX(${rightX}px)` }}>
          <PhoneFrame width={440} height={980}>
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#F5EDDA",
                color: "#18181A",
                padding: "60px 18px 20px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Header Bar */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    paddingBottom: 10,
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(0,0,0,0.08)",
                      color: "#18181A",
                      padding: "4px 10px",
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    Vellum Light
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(0,0,0,0.5)" }}>
                    Chapter IV
                  </span>
                </div>

                {/* Book Info Card */}
                <div
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    borderRadius: 14,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 38,
                      borderRadius: 4,
                      background: COLORS.gold,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#18181A",
                    }}
                  >
                    R
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Relativity</div>
                    <div style={{ fontSize: 11, color: "rgba(0,0,0,0.6)" }}>
                      Albert Einstein
                    </div>
                  </div>
                </div>
              </div>

              {/* RSVP Reader Card in Light Mode */}
              <div
                style={{
                  height: 250,
                  background: "#FFFFFF",
                  borderRadius: 22,
                  border: "1px solid rgba(0,0,0,0.08)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                }}
              >
                {/* Guide ticks */}
                <div
                  style={{
                    position: "absolute",
                    top: 32,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 2,
                    height: 18,
                    background: COLORS.crimson,
                    borderRadius: 1,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 32,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 2,
                    height: 18,
                    background: COLORS.crimson,
                    borderRadius: 1,
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "baseline",
                    width: "100%",
                    fontSize: 42,
                    fontWeight: 700,
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  }}
                >
                  <span style={{ textAlign: "right", color: "#18181A" }}>
                    {lightSlices.left}
                  </span>
                  <span
                    style={{
                      color: COLORS.crimson,
                      fontWeight: 800,
                    }}
                  >
                    {lightSlices.focal}
                  </span>
                  <span style={{ textAlign: "left", color: "#18181A" }}>
                    {lightSlices.right}
                  </span>
                </div>

                {/* Mini progress bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 20,
                    right: 20,
                    height: 3,
                    background: "rgba(0,0,0,0.08)",
                    borderRadius: 2,
                  }}
                >
                  <div
                    style={{
                      width: "35%",
                      height: "100%",
                      background: COLORS.crimson,
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 28,
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: 16, color: "rgba(0,0,0,0.3)" }}>↺</span>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: COLORS.crimson,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 18px rgba(255,69,58,0.35)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <rect x="5" y="4" width="4" height="16" rx="2" />
                      <rect x="15" y="4" width="4" height="16" rx="2" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 16, color: "rgba(0,0,0,0.3)" }}>↻</span>
                </div>

                <div
                  style={{
                    background: "rgba(0,0,0,0.05)",
                    borderRadius: 14,
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>
                    Natural Paper Contrast
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#18181A" }}>
                    500 WPM
                  </span>
                </div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <TachyonLogo size={28} />
      </div>
    </StageContainer>
  );
};
