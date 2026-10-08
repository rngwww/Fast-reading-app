import wave
import struct
import math
import os

SAMPLE_RATE = 44100
DURATION = 22.0  # seconds
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)
BPM = 120.0
BEAT_DUR = 60.0 / BPM  # 0.5 sec per beat

# We will generate a sleek, high-end Apple / Porsche style ambient electronic track:
# - Rich warm pad chords (F minor / Ab major / Bb / C progression)
# - Metronomic precision click / tick pulse (syncing with Tachyon reading rhythm)
# - Deep smooth 808 sub-bass
# - Elegant arpeggiated melodic lead with stereo ping-pong delay
# - Dynamic build-up and smooth outro fade

print(f"Synthesizing {DURATION}s luxury ambient electronic soundtrack at {BPM} BPM...")

# Left and Right channel buffers
left_channel = [0.0] * TOTAL_SAMPLES
right_channel = [0.0] * TOTAL_SAMPLES

def add_tone(buffer, start_time, duration, freq, amp=0.1, wave_type='sine', attack=0.05, decay=0.1, pan=0.0):
    start_sample = int(start_time * SAMPLE_RATE)
    num_samples = int(duration * SAMPLE_RATE)
    
    pan_l = math.cos((pan + 1.0) * math.pi / 4.0)
    pan_r = math.sin((pan + 1.0) * math.pi / 4.0)
    
    for i in range(num_samples):
        idx = start_sample + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SAMPLE_RATE
        
        # Envelope
        if t < attack:
            env = t / attack
        elif t > (duration - decay):
            env = max(0.0, (duration - t) / decay)
        else:
            env = 1.0
            
        # Waveform
        phase = 2.0 * math.pi * freq * t
        if wave_type == 'sine':
            val = math.sin(phase)
        elif wave_type == 'warm_pad':
            # Rich harmonics
            val = 0.6 * math.sin(phase) + 0.25 * math.sin(phase * 2) + 0.15 * math.sin(phase * 3) + 0.08 * math.sin(phase * 4)
        elif wave_type == 'sub':
            val = math.sin(phase) + 0.15 * math.sin(phase * 2)
        elif wave_type == 'click':
            # Fast transient exponential decay
            val = (math.sin(phase) + 0.5 * (math.sin(phase * 3.7))) * math.exp(-t * 80.0)
        else:
            val = math.sin(phase)
            
        sample_val = val * env * amp
        left_channel[idx] += sample_val * pan_l
        right_channel[idx] += sample_val * pan_r

# Chords (frequencies in Hz):
# Progression: Fm9 -> Dbmaj7 -> Bbm9 -> Eb / C
chords = [
    # 0s - 4.5s (Fm9): F2, C3, Eb3, G3, Ab3, C4
    {"start": 0.0, "dur": 4.5, "notes": [87.31, 130.81, 155.56, 196.00, 207.65, 261.63], "bass": 43.65},
    # 4.5s - 9.0s (Dbmaj7): Db2, Ab2, C3, F3, Ab3, C4
    {"start": 4.5, "dur": 4.5, "notes": [69.30, 103.83, 130.81, 174.61, 207.65, 261.63], "bass": 34.65},
    # 9.0s - 13.5s (Bbm9): Bb1, F2, Ab2, Db3, F3, C4
    {"start": 9.0, "dur": 4.5, "notes": [58.27, 87.31, 103.83, 138.59, 174.61, 261.63], "bass": 29.14},
    # 13.5s - 18.0s (Eb9 / Csus): Eb2, Bb2, G3, Bb3, Db4, F4
    {"start": 13.5, "dur": 4.5, "notes": [77.78, 116.54, 196.00, 233.08, 277.18, 349.23], "bass": 38.89},
    # 18.0s - 22.0s (Outro Fm resolving): F2, C3, Ab3, C4, Eb4
    {"start": 18.0, "dur": 4.0, "notes": [87.31, 130.81, 207.65, 261.63, 311.13], "bass": 43.65},
]

# 1. Add warm ambient chord pads
for chord in chords:
    c_start = chord["start"]
    c_dur = chord["dur"]
    # Pad notes
    for freq in chord["notes"]:
        add_tone(None, c_start, c_dur, freq, amp=0.045, wave_type='warm_pad', attack=0.8, decay=1.0, pan=-0.2 if freq < 200 else 0.2)
    # Deep Sub bass
    add_tone(None, c_start, c_dur, chord["bass"], amp=0.12, wave_type='sub', attack=0.4, decay=0.8, pan=0.0)

# 2. Add Tachyon Rhythmic Reading Metronome Clicks (16th notes / 8th notes)
# Clicks accelerate from 8th notes to 16th notes to embody speed reading
num_beats = int(DURATION / BEAT_DUR)
for b in range(num_beats):
    t_beat = b * BEAT_DUR
    if t_beat >= 21.0:
        break
    
    # Kick/thump on quarter beats (beats 0, 2 in each bar)
    if b % 2 == 0 and t_beat >= 2.0:
        add_tone(None, t_beat, 0.15, 55.0, amp=0.14, wave_type='sub', attack=0.005, decay=0.12, pan=0.0)
        
    # Metronome acoustic wood/ceramic click on 8th notes
    if t_beat >= 1.0:
        # Downbeat click
        add_tone(None, t_beat, 0.04, 1800.0, amp=0.06, wave_type='click', attack=0.001, decay=0.03, pan=-0.1)
        # Upbeat click
        add_tone(None, t_beat + BEAT_DUR * 0.5, 0.03, 2400.0, amp=0.045, wave_type='click', attack=0.001, decay=0.025, pan=0.1)
        
    # Fast 16th-note RSVP velocity ticks during the peak (beats 18 to 36, ~9s to 18s)
    if 9.0 <= t_beat <= 18.0:
        add_tone(None, t_beat + BEAT_DUR * 0.25, 0.02, 3200.0, amp=0.03, wave_type='click', attack=0.001, decay=0.015, pan=0.3)
        add_tone(None, t_beat + BEAT_DUR * 0.75, 0.02, 3200.0, amp=0.03, wave_type='click', attack=0.001, decay=0.015, pan=-0.3)

# 3. Add Elegant Melodic Arp Lead (Pentatonic / Dorian)
arp_notes = [523.25, 622.25, 698.46, 783.99, 932.33, 1046.50]  # C5, Eb5, F5, G5, Bb5, C6
step_dur = BEAT_DUR * 0.5  # 8th notes
num_steps = int(DURATION / step_dur)

for s in range(num_steps):
    t_step = s * step_dur
    if 2.0 <= t_step <= 19.5:
        # Pattern index
        note_idx = (s * 3) % len(arp_notes)
        freq = arp_notes[note_idx]
        pan = -0.5 if (s % 2 == 0) else 0.5
        add_tone(None, t_step, 0.28, freq, amp=0.035, wave_type='sine', attack=0.01, decay=0.25, pan=pan)

# Apply global master fade-in (first 0.8s) and fade-out (last 2.0s)
for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    master_env = 1.0
    if t < 0.6:
        master_env = t / 0.6
    elif t > (DURATION - 1.8):
        master_env = max(0.0, (DURATION - t) / 1.8)
        
    left_channel[i] *= master_env
    right_channel[i] *= master_env

# Simple stereo delay effect
delay_samples = int(0.25 * SAMPLE_RATE)  # 250ms delay
feedback = 0.3
for i in range(delay_samples, TOTAL_SAMPLES):
    left_channel[i] += right_channel[i - delay_samples] * feedback
    right_channel[i] += left_channel[i - delay_samples] * feedback

# Normalize to avoid clipping
max_peak = 0.0001
for i in range(TOTAL_SAMPLES):
    max_peak = max(max_peak, abs(left_channel[i]), abs(right_channel[i]))

gain = 0.88 / max_peak
print(f"Normalizing audio (peak={max_peak:.3f}, gain={gain:.3f})...")

os.makedirs("marketing/audio", exist_ok=True)
wav_path = "marketing/audio/demo_soundtrack.wav"

with wave.open(wav_path, "wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)  # 16-bit
    wf.setframerate(SAMPLE_RATE)
    
    interleaved = bytearray()
    for i in range(TOTAL_SAMPLES):
        l = int(max(-32767, min(32767, left_channel[i] * gain * 32767.0)))
        r = int(max(-32767, min(32767, right_channel[i] * gain * 32767.0)))
        interleaved.extend(struct.pack('<hh', l, r))
        
    wf.writeframes(interleaved)

print(f"Soundtrack generated successfully: {wav_path} ({os.path.getsize(wav_path)} bytes)")
