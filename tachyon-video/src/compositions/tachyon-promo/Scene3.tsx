import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Scene3: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(14, 18, 27)",
        color: "white",
        fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Interactive.Div
        name="Feature 1"
        style={{
          opacity: interpolate(frame, [0, fps], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          transform: `translateY(${interpolate(frame, [0, fps], [20, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px)`,
          fontSize: 64,
          fontWeight: 600,
          margin: 20,
        }}
      >
        ✨ PS3 XMB Aesthetics
      </Interactive.Div>
      <Interactive.Div
        name="Feature 2"
        style={{
          opacity: interpolate(frame, [fps, 2 * fps], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          transform: `translateY(${interpolate(frame, [fps, 2 * fps], [20, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px)`,
          fontSize: 64,
          fontWeight: 600,
          margin: 20,
        }}
      >
        📱 Offline PWA
      </Interactive.Div>
      <Interactive.Div
        name="Feature 3"
        style={{
          opacity: interpolate(frame, [2 * fps, 3 * fps], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          transform: `translateY(${interpolate(frame, [2 * fps, 3 * fps], [20, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px)`,
          fontSize: 64,
          fontWeight: 600,
          margin: 20,
        }}
      >
        ⚡ Dynamic Pacing
      </Interactive.Div>
    </AbsoluteFill>
  );
};
