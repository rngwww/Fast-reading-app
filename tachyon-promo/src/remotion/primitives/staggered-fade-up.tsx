import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { scaleFont } from "@/remotion/lib/layout";
import { EASING_ENTER, staggerDelay } from "@/remotion/lib/timing";

export type StaggeredFadeUpProps = {
  text: string;
  staggerInFrames?: number;
  durationInFrames?: number;
  delayInFrames?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  fontFamily?: string;
};

export const StaggeredFadeUp: React.FC<StaggeredFadeUpProps> = ({
  text,
  staggerInFrames = 4,
  durationInFrames = 16,
  delayInFrames = 0,
  fontSize: fontSizeProp,
  color = "#f4f4f5",
  fontWeight = 600,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const fontSize = fontSizeProp ?? scaleFont(72, width);
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        gap: "0.28em",
        fontSize,
        fontWeight,
        color,
        lineHeight: 1.2,
        ...(fontFamily ? { fontFamily } : {}),
      }}
    >
      {words.map((word, index) => {
        const start = staggerDelay(index, staggerInFrames, delayInFrames);
        const progress = interpolate(
          frame,
          [start, start + durationInFrames],
          [0, 1],
          {
            easing: EASING_ENTER,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        // TACHYON treatment: more energetic travel with a restrained spring.
        const rise = spring({
          frame: frame - start,
          fps,
          durationInFrames,
          config: { damping: 19, stiffness: 150, mass: 0.9 },
        });
        const y = interpolate(rise, [0, 1], [38, 0]);

        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: "inline-block",
              opacity: progress,
              translate: `0px ${y}px`,
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};
