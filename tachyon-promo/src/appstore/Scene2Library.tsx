import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { PhoneFrame } from "./PhoneFrame";
import { AnimatedHeader, COLORS, StageContainer, TachyonLogo } from "./SharedStyles";

const LIBRARY_BOOKS = [
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    badge: "700 WPM • 42m left",
    progress: 68,
    themeColor: "#FF453A",
    tag: "Philosophy",
  },
  {
    title: "Relativity",
    author: "Albert Einstein",
    badge: "600 WPM • 1h 15m left",
    progress: 35,
    themeColor: "#FFB340",
    tag: "Science",
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    badge: "650 WPM • 2h 10m left",
    progress: 12,
    themeColor: "#34C759",
    tag: "Classic",
  },
  {
    title: "The Time Machine",
    author: "H.G. Wells",
    badge: "720 WPM • 58m left",
    progress: 85,
    themeColor: "#0A84FF",
    tag: "Sci-Fi",
  },
  {
    title: "Beyond Good and Evil",
    author: "Friedrich Nietzsche",
    badge: "550 WPM • 3h 05m left",
    progress: 5,
    themeColor: "#BF5AF2",
    tag: "Philosophy",
  },
];

export const Scene2Library: React.FC = () => {
  const frame = useCurrentFrame();

  // Entrance spring
  const phoneSpring = spring({
    frame,
    fps: 30,
    config: { damping: 16, stiffness: 100, mass: 0.9 },
  });

  const phoneY = interpolate(phoneSpring, [0, 1], [120, 0]);
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.94, 1]);

  // Smooth bookshelf scrolling motion (scrolls upward smoothly)
  const scrollOffset = interpolate(frame, [15, 120], [0, -210], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <StageContainer>
      <AnimatedHeader
        category="Personal Digital Library"
        headline="Build Your Digital Library"
        subheadline="Organize your personal EPUBs, track reading velocity, and read offline"
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
              padding: "70px 20px 20px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Header: Title and Search */}
            <div style={{ marginBottom: 16, zIndex: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div>
                  <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Library</h2>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                    5 Books • 1,480 Pages
                  </span>
                </div>
                <div
                  style={{
                    background: COLORS.crimson,
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: 18,
                    fontSize: 13,
                    fontWeight: 700,
                    boxShadow: "0 4px 15px rgba(255,69,58,0.4)",
                  }}
                >
                  + Import
                </div>
              </div>

              {/* Search Bar */}
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span>🔍</span>
                <span>Search titles, authors, passages...</span>
              </div>

              {/* Category Pills */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 14,
                  overflow: "hidden",
                }}
              >
                {["All Books", "Philosophy", "Science", "Classics"].map((cat, i) => (
                  <div
                    key={cat}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      background: i === 0 ? "white" : "rgba(255,255,255,0.08)",
                      color: i === 0 ? "#08080A" : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable Bookshelf Content */}
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  transform: `translateY(${scrollOffset}px)`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  paddingBottom: 40,
                }}
              >
                {LIBRARY_BOOKS.map((b) => (
                  <div
                    key={b.title}
                    style={{
                      background: "linear-gradient(135deg, #14141A 0%, #0F0F14 100%)",
                      borderRadius: 18,
                      padding: "14px 16px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Book Cover Thumbnail */}
                    <div
                      style={{
                        width: 52,
                        height: 74,
                        borderRadius: 8,
                        background: `linear-gradient(145deg, ${b.themeColor} 0%, #16161D 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <span style={{ fontSize: 18, fontWeight: 900, color: "white" }}>
                        {b.title[0]}
                      </span>
                    </div>

                    {/* Book Details */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            margin: 0,
                            color: "#FFFFFF",
                          }}
                        >
                          {b.title}
                        </h3>
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 6,
                            background: "rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.6)",
                            fontWeight: 600,
                          }}
                        >
                          {b.tag}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.6)",
                          margin: "2px 0 8px",
                        }}
                      >
                        {b.author}
                      </p>

                      {/* Progress Bar */}
                      <div
                        style={{
                          height: 4,
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: 2,
                          overflow: "hidden",
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            width: `${b.progress}%`,
                            height: "100%",
                            background: b.themeColor,
                            borderRadius: 2,
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.5)",
                          fontWeight: 500,
                        }}
                      >
                        <span>{b.badge}</span>
                        <span style={{ fontWeight: 700, color: b.themeColor }}>
                          {b.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
