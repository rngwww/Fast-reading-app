import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const binary =
  process.platform === "win32"
    ? "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe"
    : "ffprobe";
const file = process.argv[2] ?? "out/TACHYON-More-You-1080p60.mp4";
const data = JSON.parse(
  execFileSync(
    binary,
    ["-v", "error", "-show_streams", "-show_format", "-of", "json", file],
    { encoding: "utf8" },
  ),
);
const video = data.streams.find((s) => s.codec_type === "video");
const audio = data.streams.find((s) => s.codec_type === "audio");
assert.equal(video.width, 1920);
assert.equal(video.height, 1080);
assert.equal(video.r_frame_rate, "60/1");
assert.equal(Number(video.nb_frames), 3600);
assert.equal(video.codec_name, "h264");
// JPEG frame rendering uses full-range 4:2:0, reported as yuvj420p by FFprobe.
assert.ok(["yuv420p", "yuvj420p"].includes(video.pix_fmt));
assert.equal(Number(video.duration), 60);
// AAC packets can extend the container by a few milliseconds beyond picture.
assert.ok(Math.abs(Number(data.format.duration) - 60) < 0.1);
assert.equal(audio.codec_name, "aac");
assert.equal(audio.channels, 2);
const report = {
  file: path.resolve(file),
  seconds: Number(video.duration),
  containerSeconds: Number(data.format.duration),
  width: video.width,
  height: video.height,
  fps: 60,
  frames: Number(video.nb_frames),
  video: video.codec_name,
  pixelFormat: video.pix_fmt,
  audio: audio.codec_name,
  channels: audio.channels,
  bytes: Number(data.format.size),
  passed: true,
};
writeFileSync("out/verification.json", JSON.stringify(report, null, 2) + "\n");
console.log(report);
