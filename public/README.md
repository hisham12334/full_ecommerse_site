# Public Assets Folder

## Hero Video Files

Place your hero section video files here:

### Required Files:
1. **hero-video.mp4** - Main video file (H.264 encoded)
2. **hero-video.webm** - Fallback video file (WebM format)
3. **hero-poster.jpg** - Poster image (shows while video loads)

### File Structure:
```
public/
├── hero-video.mp4      ← Place your MP4 video here
├── hero-video.webm     ← Place your WebM video here
├── hero-poster.jpg     ← Place your poster image here
└── images/
    └── (other images)
```

## Quick Start

1. **Get your video ready** (10-30 seconds, looping content)
2. **Optimize it** (keep under 5MB)
3. **Convert to both formats**:
   - MP4 (for most browsers)
   - WebM (for better compression)
4. **Extract a poster frame** (first frame of video as JPG)
5. **Place all three files** in this folder

## Video Specifications

- **Resolution**: 1920x1080 or 1280x720
- **Duration**: 10-30 seconds
- **File Size**: < 5MB
- **Format**: MP4 (H.264) + WebM (VP9)
- **Aspect Ratio**: 16:9

## Need Help?

See `VIDEO_SETUP.md` in the root folder for detailed instructions on:
- Video optimization
- Compression tools
- FFmpeg commands
- Troubleshooting

## Temporary Solution

If you don't have a video yet, you can:
1. Use a stock video from sites like Pexels or Pixabay
2. Convert an existing image to a static video
3. Create a simple animated video with tools like Canva

The hero section will show the poster image until the video is ready.
