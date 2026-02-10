/**
 * Generates a short click SFX as WAV and MP3 (CC0 – no attribution required).
 * Mono, 44.1kHz, 16-bit, ~40ms. MP3 is created via ffmpeg when available.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, "..", "public", "audio");
const sampleRate = 44100;
const durationSec = 0.04;
const numSamples = Math.floor(sampleRate * durationSec);

function writeWav(filename, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * 2;
  const headerSize = 44;
  const fileSize = headerSize + dataSize;

  const buffer = Buffer.alloc(headerSize + dataSize);
  let offset = 0;

  function writeU32(v) {
    buffer.writeUInt32LE(v, offset);
    offset += 4;
  }
  function writeU16(v) {
    buffer.writeUInt16LE(v, offset);
    offset += 2;
  }
  function writeChunk(id, data) {
    buffer.write(id, offset, 4);
    offset += 4;
    writeU32(data.length);
    data.copy(buffer, offset);
    offset += data.length;
  }

  buffer.write("RIFF", 0, 4);
  writeU32(fileSize - 8);
  buffer.write("WAVE", offset, 4);
  offset += 4;

  const fmt = Buffer.alloc(16);
  let o = 0;
  fmt.writeUInt16LE(1, o);
  o += 2;
  fmt.writeUInt16LE(numChannels, o);
  o += 2;
  fmt.writeUInt32LE(sampleRate, o);
  o += 4;
  fmt.writeUInt32LE(byteRate, o);
  o += 4;
  fmt.writeUInt16LE((numChannels * bitsPerSample) / 8, o);
  o += 2;
  fmt.writeUInt16LE(bitsPerSample, o);
  writeChunk("fmt ", fmt);

  const dataBuf = Buffer.alloc(dataSize);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767)));
    dataBuf.writeInt16LE(s, i * 2);
  }
  writeChunk("data", dataBuf);

  const outPath = path.join(audioDir, filename);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log("Wrote", outPath);
}

// Click: short attack, fast decay (like a soft UI click)
const samples = [];
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  const attack = Math.min(1, i / (sampleRate * 0.002));
  const decay = Math.exp(-t * 80);
  const freq = 1200;
  const wave = Math.sin(2 * Math.PI * freq * t) * attack * decay * 0.4;
  samples.push(wave);
}

writeWav("click.wav", samples);

// Convert to MP3 with ffmpeg if available
try {
  execSync(
    `ffmpeg -y -i "${path.join(audioDir, "click.wav")}" -acodec libmp3lame -q:a 5 "${path.join(audioDir, "click.mp3")}"`,
    { stdio: "pipe" }
  );
  console.log("Wrote", path.join(audioDir, "click.mp3"));
} catch (e) {
  console.warn("FFmpeg not found; only click.wav was generated. Install ffmpeg to get click.mp3, or use the WAV.");
}
