# PWA Icon Generation Guide

## Required Icons for PWA

Create these icon files in the `public/icons/` directory:

### Icon Sizes Needed:
- `icon-72x72.png` (72x72)
- `icon-96x96.png` (96x96)
- `icon-128x128.png` (128x128)
- `icon-144x144.png` (144x144)
- `icon-152x152.png` (152x152)
- `icon-192x192.png` (192x192)
- `icon-384x384.png` (384x384)
- `icon-512x512.png` (512x512)

### Using Online Tools:
1. **PWA Builder**: https://www.pwabuilder.com/imageGenerator
2. **Real Favicon Generator**: https://realfavicongenerator.net/
3. **Canva**: Create a 512x512 icon and export in different sizes

### Icon Design Tips:
- Use a simple, recognizable symbol (like "F" for Flashy)
- Ensure it works on both light and dark backgrounds
- Make it distinctive and memorable
- Use your brand colors (#000000 theme color)

### Quick Command (if you have ImageMagick):
```bash
# If you have a base icon.png file:
convert icon.png -resize 72x72 public/icons/icon-72x72.png
convert icon.png -resize 96x96 public/icons/icon-96x96.png
convert icon.png -resize 128x128 public/icons/icon-128x128.png
convert icon.png -resize 144x144 public/icons/icon-144x144.png
convert icon.png -resize 152x152 public/icons/icon-152x152.png
convert icon.png -resize 192x192 public/icons/icon-192x192.png
convert icon.png -resize 384x384 public/icons/icon-384x384.png
convert icon.png -resize 512x512 public/icons/icon-512x512.png
```

### Temporary Placeholder:
For now, you can use the existing `next.svg` as a placeholder by copying it to the icons folder and renaming it.

