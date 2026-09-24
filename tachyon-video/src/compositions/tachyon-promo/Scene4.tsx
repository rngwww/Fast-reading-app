import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Scene4: React.FC = () => {
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
        name="Logo"
        style={{
          opacity: interpolate(frame, [0, fps], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: 8,
          textShadow: "0 0 60px rgba(255,255,255,0.3)"
        }}
      >
        TACHYON
      </Interactive.Div>
      <Interactive.Div
        name="CallToAction"
        style={{
          opacity: interpolate(frame, [fps, 2 * fps], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          fontSize: 48,
          marginTop: 40,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        Available Now
      </Interactive.Div>
    </AbsoluteFill>
  );
};
