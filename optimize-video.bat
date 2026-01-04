@echo off
echo Video Optimization Script for Hero Background
echo =============================================
echo.
echo This script helps optimize your hero video for web playback
echo Make sure you have FFmpeg installed: https://ffmpeg.org/download.html
echo.

if not exist "public\hero-video-original.mp4" (
    echo Error: Please place your original video as "public\hero-video-original.mp4"
    echo Then run this script again.
    pause
    exit /b 1
)

echo Optimizing video for web...
echo.

REM Create optimized MP4
echo Creating optimized MP4...
ffmpeg -i "public\hero-video-original.mp4" -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k -movflags +faststart "public\hero-video.mp4" -y

REM Create WebM version
echo Creating WebM version...
ffmpeg -i "public\hero-video-original.mp4" -c:v libvpx-vp9 -crf 30 -b:v 0 "public\Primary_video\IMG_8418.webm" -y

REM Extract poster frame
echo Creating poster image...
ffmpeg -i "public\hero-video.mp4" -ss 00:00:01 -vframes 1 "public\hero-poster.jpg" -y

echo.
echo Optimization complete!
echo Files created:
echo - public\hero-video.mp4 (optimized)
echo - public\Primary_video\IMG_8418.webm (fallback)
echo - public\hero-poster.jpg (poster)
echo.
pause