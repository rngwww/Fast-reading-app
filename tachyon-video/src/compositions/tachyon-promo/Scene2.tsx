import { AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig } from "remotion";

const text = "TACHYON is a mobile-first Progressive Web App designed to dramatically increase your reading speed. By perfectly locking words onto an Optimal Recognition Point, TACHYON eliminates eye saccades and reduces subvocalization.";
const words = text.split(" ");

export const Scene2: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const framesPerWord = 6; // ~300 WPM at 30fps

  const currentWordIndex = Math.min(
    Math.floor(frame / framesPerWord),
    words.length - 1
  );
  
  const currentWord = words[currentWordIndex] || "";

  // A simple way to highlight the middle letter as ORP
  const middleIndex = Math.floor(currentWord.length / 2);
  const leftPart = currentWord.slice(0, middleIndex);
  const centerChar = currentWord.slice(middleIndex, middleIndex + 1);
  const rightPart = currentWord.slice(middleIndex + 1);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(14, 18, 27)",
        color: "white",
        fontFamily: 'monospace',
      }}
    >
      <Interactive.Div
        name="RSVP Demo"
        style={{
          fontSize: 96,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span style={{ textAlign: "right", width: "50%", paddingRight: 2 }}>{leftPart}</span>
        <span style={{ color: "#ff3366" }}>{centerChar}</span>
        <span style={{ textAlign: "left", width: "50%", paddingLeft: 2 }}>{rightPart}</span>
      </Interactive.Div>

      <Interactive.Div
        name="Caption"
        style={{
          position: "absolute",
          bottom: 120,
          fontSize: 48,
          color: "rgba(255,255,255,0.6)",
          fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        Eliminate eye saccades.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
