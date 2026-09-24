import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Scene1: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(14, 18, 27)", // PS3 Obsidian Dark Mode
        color: "white",
        fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Interactive.Div
        name="Title"
        style={{
          opacity: interpolate(frame, [0, fps, 4 * fps, 5 * fps], [0, 1, 1, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.16, 1, 0.3, 1)],
          }),
          fontSize: 88,
          fontWeight: 700,
          textAlign: "center",
          textShadow: "0 0 40px rgba(255,255,255,0.2)"
        }}
      >
        Read faster than thought.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
