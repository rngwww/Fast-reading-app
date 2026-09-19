// Original, deterministic 120 BPM electronic score. No samples or external audio.
import { mkdirSync, writeFileSync } from "node:fs";
const sr = 48000,
  seconds = 60,
  n = sr * seconds;
const left = new Float64Array(n),
  right = new Float64Array(n);
let seed = 21;
const noise = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 2147483648 - 1;
};
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
function note(start, duration, midi, amp, kind = "pluck", pan = 0) {
  const begin = Math.round(start * sr),
    len = Math.min(n - begin, Math.round(duration * sr));
  const freq = hz(midi);
  const l = Math.sqrt((1 - pan) / 2),
    r = Math.sqrt((1 + pan) / 2);
  for (let j = 0; j < len; j++) {
    const t = j / sr,
      ph = 2 * Math.PI * freq * t;
    let signal, env;
    if (kind === "pad") {
      env = Math.min(1, t / 0.18) * Math.min(1, (duration - t) / 0.5);
      signal =
        (Math.sin(ph) + 0.25 * Math.sin(ph * 2.002) + 0.12 * Math.sin(ph * 3)) *
        0.6;
    } else if (kind === "bass") {
      env =
        Math.min(1, t / 0.007) *
        Math.exp(-t * 5) *
        Math.min(1, (duration - t) / 0.025);
      signal = Math.sin(ph) + 0.22 * Math.sin(ph * 2) + 0.1 * Math.sin(ph * 3);
    } else {
      env =
        Math.min(1, t / 0.004) *
        Math.exp(-t * 7) *
        Math.min(1, (duration - t) / 0.06);
      signal =
        Math.sin(ph + 1.1 * Math.sin(ph * 2) * Math.exp(-t * 12)) +
        0.2 * Math.sin(ph * 3);
    }
    const pump =
      kind === "pad" ? 0.6 + 0.4 * Math.min(1, ((start + t) % 0.5) / 0.17) : 1;
    const v = signal * env * amp * pump;
    left[begin + j] += v * l;
    right[begin + j] += v * r;
  }
}
function drum(start, type, amp = 1) {
  const begin = Math.round(start * sr),
    duration = type === "kick" ? 0.35 : type === "clap" ? 0.17 : 0.08;
  let low = 0;
  for (let j = 0; j < duration * sr && begin + j < n; j++) {
    const t = j / sr;
    let v;
    if (type === "kick")
      v =
        Math.sin(2 * Math.PI * (49 * t + 8 * (1 - Math.exp(-t * 32)))) *
        Math.exp(-t * 12) *
        0.48 *
        amp;
    else {
      const ns = noise();
      low = low * 0.65 + ns * 0.35;
      const hp = ns - low;
      v =
        hp *
        Math.exp(-t * (type === "clap" ? 25 : 70)) *
        (type === "clap" ? 0.19 : 0.075) *
        amp;
      if (type === "clap")
        v += Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 40) * 0.06;
    }
    left[begin + j] += v;
    right[begin + j] += v;
  }
}
const chords = [
  [57, 60, 64, 67],
  [53, 57, 60, 64],
  [48, 52, 55, 59],
  [55, 59, 62, 65],
];
for (let bar = 0; bar < 30; bar++) {
  const start = bar * 2,
    ch = chords[Math.floor(bar / 2) % 4];
  ch.forEach((m, i) => note(start, 2.55, m, 0.043, "pad", (i - 1.5) * 0.45));
  const build = start < 6 ? 0.5 : start >= 44 && start < 48 ? 0.65 : 1;
  if (start < 58) {
    for (let beat = 0; beat < 4; beat++) {
      const t = start + beat * 0.5;
      if (start >= 6) drum(t, "kick", build);
      if (start >= 14 && beat % 2 === 1) drum(t, "clap", 0.9);
      if (start >= 6) {
        drum(t + 0.25, "hat", 0.6);
        drum(t, "hat", 0.3);
      }
      if (start >= 10) note(t, 0.4, ch[0] - 12, 0.17 * build, "bass");
    }
  }
  if (start < 58)
    for (let k = 0; k < 8; k++) {
      const m = ch[[0, 2, 1, 3, 2, 1, 3, 2][k]] + 12;
      note(
        start + k * 0.25,
        0.8,
        m,
        0.07 * build,
        "pluck",
        Math.sin(k * 1.8) * 0.55,
      );
      note(
        start + k * 0.25 + 0.1875,
        0.55,
        m,
        0.018 * build,
        "pluck",
        -Math.sin(k * 1.8) * 0.6,
      );
    }
  if (start >= 24 && start < 58)
    [0, 3, 6].forEach((beat, i) =>
      note(start + beat * 0.25, 1, ch[[2, 3, 1][i]] + 24, 0.05, "pluck", 0.2),
    );
}
// Air sweeps and soft impact chimes tie the arrangement to the picture cuts.
for (const cut of [6, 14, 24, 34, 44, 52]) {
  const start = cut - 0.45,
    begin = Math.round(start * sr);
  let smooth = 0;
  for (let j = 0; j < sr * 0.7; j++) {
    const t = j / sr;
    const ns = noise();
    smooth = smooth * 0.91 + ns * 0.09;
    const env = t < 0.45 ? (t / 0.45) ** 2 : Math.exp(-(t - 0.45) * 17);
    const v = smooth * env * 0.17;
    left[begin + j] += v;
    right[begin + j] += v;
  }
  note(cut, 1.4, 88, 0.07, "pluck", 0.2);
}
[60, 64, 67, 72].forEach((m, i) =>
  note(58 + i * 0.025, 1.9, m, 0.09, "pad", (i - 1.5) * 0.3),
);
// Short stereo ambience, followed by soft saturation and a gentle ending.
const dl = Math.round(sr * 0.093),
  dr = Math.round(sr * 0.137);
for (let i = n - 1; i >= Math.max(dl, dr); i--) {
  left[i] += right[i - dl] * 0.14;
  right[i] += left[i - dr] * 0.13;
}
let peak = 0;
for (let i = 0; i < n; i++) {
  const t = i / sr;
  const fade = Math.min(1, t / 0.08, (seconds - t) / 1.1);
  left[i] = Math.tanh(left[i] * 1.5) * fade;
  right[i] = Math.tanh(right[i] * 1.5) * fade;
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const buf = Buffer.alloc(44 + n * 4);
buf.write("RIFF");
buf.writeUInt32LE(36 + n * 4, 4);
buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(sr, 24);
buf.writeUInt32LE(sr * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(n * 4, 40);
let sum = 0;
for (let i = 0; i < n; i++) {
  const l = (left[i] / peak) * 0.87,
    r = (right[i] / peak) * 0.87;
  buf.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
  sum += (l * l + r * r) / 2;
}
mkdirSync("public/audio", { recursive: true });
writeFileSync("public/audio/more-you.wav", buf);
console.log(
  JSON.stringify({
    duration: seconds,
    sampleRate: sr,
    peakDb: 20 * Math.log10(0.87),
    rmsDb: 10 * Math.log10(sum / n),
  }),
);
