# TACHYON — More You

A bright, energetic one-minute product vision film. Warm ivory, electric red,
lime, lilac and sky blue surround TACHYON's recognizable reader interface.
The film combines dimensional phones, illustrated books, kinetic typography,
frame-driven waves, theme changes and an original electronic score.

## Finished video

`out/TACHYON-More-You-1080p60.mp4`

60 seconds · 1920 × 1080 · 60 fps · H.264 · stereo AAC.
The editable source and assets are committed; generated exports in `out/` are
kept locally and can be recreated with `npm run render`.

## Open and edit

From this folder, run:

```bash
npm ci
npm run dev
```

Open the local address printed by Remotion and select **Tachyon-More-You**.
The **Scenes** folder lets you preview each section independently.

```bash
npm run check    # Check the source
npm run review   # Render representative full-resolution stills
npm run render   # Export the finished 1080p, 60 fps MP4
npm run verify   # Check dimensions, frame count, duration and audio
```

## Story and timing

| Time  | Scene     | Story                                   |
| ----- | --------- | --------------------------------------- |
| 00–06 | Curiosity | So much to discover. So much to become. |
| 06–14 | Focus     | One word. Full focus.                   |
| 14–24 | Reader    | Find your reading flow.                 |
| 24–34 | Library   | Your next world is waiting.             |
| 34–44 | Personal  | Your pace. Your palette.                |
| 44–52 | Anywhere  | Make the everyday count.                |
| 52–60 | Finale    | More stories. More ideas. More you.     |

Scene boundaries include half-second transitions. Total length is exactly
3,600 frames. All movement is determined by the Remotion frame, including
word changes, particles, the illustrated covers and the phone perspectives.
No CSS animations, keyframes or transitions are used.

## Where to change things

- `src/scenes/`: seven individually editable scenes.
- `src/design.tsx`: palette, logo, typography and shared graphic elements.
- `src/components/Reader.tsx`: the phone, reader and focal-word treatment.
- `src/components/Book.tsx`: the four original illustrated concept covers.
- `src/Film.tsx`: scene order, timing, transitions and audio.
- `scripts/score.mjs`: original deterministic 120 BPM soundtrack generator.
- `src/remotion/primitives/`: copied, editable RemotionUI components.

The app's obsidian background, red focal letter, reader controls, library,
themes, waveform idea and ambient waves informed the art direction. The
book covers, film layouts and extended library presentation are promotional
concepts. Displayed WPM values illustrate controls rather than promising
reading or comprehension outcomes. The application itself is unchanged.

## Assets and dependencies

Music and illustrations were created for this film. The score is synthesized
locally without third-party samples; regenerate it using `npm run score`.
Manrope is stored locally, with its OFL license in `public/fonts/OFL.txt`.
Rendering does not need a font or audio service.

RemotionUI was initialized with `npx remotion-ui@latest init tachyon-promo --json`.
`staggered-fade-up` and `particle-field` were installed through its CLI before
importing from local source. The text primitive was customized with a spring
entrance. The CLI's Windows dependency-spawn error was worked around with
direct npm installation after it had copied the components. Its search command
also encountered a registry lane-schema mismatch; component selection used the
official JSON component index and per-component props instead.

RemotionUI attribution is in `REMOTIONUI-LICENSE.txt`. Remotion and its packages
are pinned to 4.0.526; the lockfile records the complete dependency tree.
