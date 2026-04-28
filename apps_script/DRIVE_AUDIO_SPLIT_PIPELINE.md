# Drive Audio Auto-Splitting Pipeline

## Objective

If an audio file is too large for transcription limits (~25MB), automatically split it into smaller chunks before processing.

---

## Workflow

```text
Email / Upload
→ Drive Inbox (Audio)
→ Apps Script detects file
→ Check file size

IF file <= threshold
  → send to transcription

IF file > threshold
  → split into chunks
  → save chunks to Drive
  → queue each chunk for transcription
```

---

## Important Constraint

Google Apps Script CANNOT natively split audio.

So we use a hybrid approach:

### Option A (Cloud helper - lightweight)
- Use a small external endpoint (can be temporary)
- Accepts file
- Returns chunked files

### Option B (Better - Local or GitHub Action later)
- ffmpeg-based split
- Runs on:
  - your Mac
  - or GitHub Actions

---

## Recommended Current Approach

### Step 1: Apps Script detects large file

```javascript
function checkFileSize(file) {
  const sizeMB = file.getSize() / (1024 * 1024);
  return sizeMB > 20;
}
```

### Step 2: Mark for splitting

Instead of failing:

```text
status = needs_splitting
```

### Step 3: Split using external processor

Later pipeline:

```text
needs_splitting
→ ffmpeg split (5–10 min chunks)
→ save as:
  file_part_01.m4a
  file_part_02.m4a
→ queue each part
```

---

## ffmpeg Split Command (reference)

```bash
ffmpeg -i input.m4a -f segment -segment_time 300 -c copy output_%03d.m4a
```

This splits into 5-minute chunks.

---

## Naming Convention

```text
Original: voice_2026-04-28.m4a

Chunks:
voice_2026-04-28_part_01.m4a
voice_2026-04-28_part_02.m4a
voice_2026-04-28_part_03.m4a
```

---

## Reassembly Logic

After transcription:

```text
part_01 → transcript
part_02 → transcript
part_03 → transcript

→ combine in order
→ final transcript
```

---

## Key Principle

Never reject large files.

Always:

```text
Accept → Split → Process → Recombine
```

---

## Future Upgrade

When local worker is active:

```text
Drive → local watcher
→ auto split + transcribe
→ push results back
```

No cloud cost.

---

## Final Rule

Large files should degrade gracefully, not fail silently.

Libby should always respond:

```text
"File too large — splitting into parts. Processing in sequence."
```

---
