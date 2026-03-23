---
name: youtube-search
description: >
  Search YouTube for videos and extract metadata/transcripts using yt-dlp.
  Use when the user needs to find YouTube videos on a topic, research content sources,
  or extract video captions/subtitles.
argument-hint: <search query> [count] [--full] | --captions <video_url> [lang] [--text]
---

# YouTube Search & Transcript Extraction

Search YouTube and extract video metadata or transcripts using yt-dlp. No videos are downloaded.

## Prerequisites

Verify yt-dlp is installed:
```bash
python -c "import yt_dlp; print(yt_dlp.version.__version__)"
```

If missing:
```bash
pip install yt-dlp
```

## Commands

### 1. Search YouTube

```bash
python -c "
import yt_dlp, json, sys
query, count = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 5
with yt_dlp.YoutubeDL({'quiet': True, 'extract_flat': True, 'force_generic_extractor': False}) as ydl:
    results = ydl.extract_info(f'ytsearch{count}:{query}', download=False)
    for e in results.get('entries', []):
        print(f\"{e.get('title','')} | {e.get('url','')} | {e.get('duration_string','')}\")
" "QUERY" COUNT
```

### 2. Get Captions

```bash
python -c "
import yt_dlp, sys
url = sys.argv[1]
lang = sys.argv[2] if len(sys.argv) > 2 else 'fr'
with yt_dlp.YoutubeDL({'quiet': True, 'writesubtitles': True, 'writeautomaticsub': True, 'skip_download': True}) as ydl:
    info = ydl.extract_info(url, download=False)
    subs = info.get('subtitles', {})
    auto = info.get('automatic_captions', {})
    print(f'Manual: {list(subs.keys())}')
    print(f'Auto: {list(auto.keys())[:10]}')
" "VIDEO_URL" "fr"
```

## Output Format

Present results as a table:

| # | Title | Channel | Duration | Views | URL |
|---|-------|---------|----------|-------|-----|

## Constraints

- Never download video or audio files
- Keep searches under 20 results
- Auto-generated captions may contain errors
