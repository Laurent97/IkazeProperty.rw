
# Ikaze Property Logo - PNG Conversion Instructions

## Generated SVG Files:
✅ logo.svg - Main logo (200x60)
✅ logo-horizontal.svg - Horizontal version (250x50)  
✅ logo-square.svg - Square version (100x100)
✅ logo-200x60.svg - Sized for headers
✅ logo-150x40.svg - Sized for navigation
✅ logo-100x100.svg - Sized for avatars
✅ logo-50x50.svg - Sized for small icons
✅ logo-favicon.svg - Sized for favicon (32x32)

## To Convert to PNG:

### Option 1: Online Converters (Recommended)
1. Visit https://convertio.co/svg-png/
2. Upload the SVG files
3. Download as PNG

### Option 2: Command Line (if you have ImageMagick)
```bash
# Install ImageMagick first
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Convert each SVG to PNG
magick logo.svg logo.png
magick logo-horizontal.svg logo-horizontal.png
magick logo-square.svg logo-square.png
magick logo-favicon.svg favicon.png
```

### Option 3: Node.js with Sharp
```bash
npm install sharp
node convert-with-sharp.js
```

## Logo Features:
- 🎨 Modern gradient design (blue to cyan)
- 🔥 Orange accent colors for visual interest
- 🏠 Property/house icon symbol
- 📝 Clean typography with "Ikaze Property"
- 🇷🇼 Designed for Rwandan marketplace
- 📱 Responsive sizes for all use cases

## Usage in Your Website:
```jsx
// Next.js Image component usage
import Image from 'next/image';

// Main logo
<Image src="/logo.svg" alt="Ikaze Property" width={200} height={60} />

// Favicon
<link rel="icon" type="image/svg+xml" href="/logo-favicon.svg" />
```

The logo is ready to use! SVG files are preferred for modern web development
as they scale perfectly and have smaller file sizes than PNG equivalents.
