# Hero Video Setup Guide

## Video Background Implementation

The hero section now uses a video background instead of a static image. The video loads without delay and plays automatically.

## Required Files

Place your video files in the `public` folder:

```
full_ecommerse_site/
├── public/
│   ├── hero-video.mp4      # Primary video (MP4 format)
│   ├── hero-video.webm     # Fallback video (WebM format)
│   └── hero-poster.jpg     # Poster image (shows while loading)
```

## Video Specifications

### Recommended Settings:
- **Resolution**: 1920x1080 (Full HD) or 1280x720 (HD)
- **Aspect Ratio**: 16:9
- **Duration**: 10-30 seconds (loops automatically)
- **File Size**: Keep under 5MB for fast loading
- **Frame Rate**: 24-30 fps
- **Codec**: H.264 for MP4, VP9 for WebM

### Optimization Tips:
1. **Compress the video** to reduce file size without losing quality
2. **Use tools like**:
   - HandBrake (free, cross-platform)
   - FFmpeg (command-line)
   - Online tools: CloudConvert, Clipchamp

3. **Example FFmpeg commands**:
   ```bash
   # Convert to optimized MP4
   ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k hero-video.mp4
   
   # Convert to WebM
   ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 hero-video.webm
   
   # Extract poster frame
   ffmpeg -i hero-video.mp4 -ss 00:00:01 -vframes 1 hero-poster.jpg
   ```

## Features Implemented

### ✅ Instant Loading
- Video uses `preload="auto"` to start loading immediately
- Poster image displays while video loads
- No delay in playback

### ✅ Autoplay
- Video plays automatically on page load
- Muted by default (required for autoplay in most browsers)
- `playsInline` attribute for mobile devices

### ✅ Smooth Animation
- Video container scales from 1.1 to 1.0 for subtle zoom effect
- Matches the previous image animation timing
- Text animations remain unchanged

### ✅ Fallback Support
- Multiple video formats (MP4 and WebM) for browser compatibility
- Poster image shows if video fails to load
- Graceful degradation for older browsers

## Video Content Suggestions

For a luxury hoodie brand, consider:
- Close-up fabric texture shots
- Slow-motion hoodie movement
- Product showcase in premium setting
- Lifestyle shots with subtle motion
- Abstract, artistic visuals

## Performance Considerations

1. **Mobile Optimization**:
   - Consider serving a smaller video for mobile devices
   - Use responsive video sources if needed

2. **Loading Strategy**:
   - Video loads in background while page renders
   - Text and UI elements appear on schedule
   - No blocking of user interaction

3. **Bandwidth**:
   - Keep video under 5MB for optimal performance
   - Consider lazy loading for below-the-fold videos

## Testing Checklist

- [ ] Video plays automatically on desktop
- [ ] Video plays on mobile devices
- [ ] Poster image displays correctly
- [ ] Text animations work as expected
- [ ] Dropdown menu functions properly
- [ ] Video loops seamlessly
- [ ] Page loads quickly (< 3 seconds)
- [ ] Works in Chrome, Firefox, Safari, Edge

## Troubleshooting

### Video doesn't autoplay
- Ensure video is muted (`muted` attribute)
- Check browser autoplay policies
- Verify video file is accessible

### Video loads slowly
- Compress video file further
- Use a CDN for video hosting
- Consider using a video streaming service

### Video doesn't loop smoothly
- Ensure video has no black frames at start/end
- Use video editing software to create seamless loop
- Check video encoding settings

## Alternative: Using a Video URL

If you want to use a video from a URL instead of local files:

```tsx
<video
  ref={videoRef}
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  className="h-full w-full object-cover opacity-90"
  poster="https://your-cdn.com/hero-poster.jpg"
>
  <source src="https://your-cdn.com/hero-video.mp4" type="video/mp4" />
</video>
```

## Next Steps

1. Create or obtain your hero video
2. Optimize the video for web
3. Place files in the `public` folder
4. Test on multiple devices and browsers
5. Monitor loading performance
