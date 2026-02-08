const fs = require('fs');
const path = require('path');

// Simple SVG to PNG conversion using canvas (if available) or base64 encoding
// For now, we'll create optimized SVG files that can be used directly as PNG alternatives

const logoVariants = [
  {
    name: 'logo-200x60.png',
    width: 200,
    height: 60,
    svg: 'logo.svg'
  },
  {
    name: 'logo-150x40.png',
    width: 150,
    height: 40,
    svg: 'logo-horizontal.svg'
  },
  {
    name: 'logo-100x100.png',
    width: 100,
    height: 100,
    svg: 'logo-square.svg'
  },
  {
    name: 'logo-50x50.png',
    width: 50,
    height: 50,
    svg: 'logo-square.svg'
  },
  {
    name: 'logo-favicon.png',
    width: 32,
    height: 32,
    svg: 'logo-square.svg'
  }
];

// Create optimized SVG files with specific dimensions
logoVariants.forEach(variant => {
  const svgPath = path.join(__dirname, 'public', variant.svg);
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  // Update viewBox and dimensions
  const optimizedSvg = svgContent
    .replace(/width="[^"]*"/, `width="${variant.width}"`)
    .replace(/height="[^"]*"/, `height="${variant.height}"`)
    .replace(/viewBox="[^"]*"/, `viewBox="0 0 ${variant.width} ${variant.height}"`);
  
  // Save as SVG with PNG-like naming convention
  const outputPath = path.join(__dirname, 'public', variant.name.replace('.png', '.svg'));
  fs.writeFileSync(outputPath, optimizedSvg);
  
  console.log(`Created ${outputPath}`);
});

console.log('\nLogo generation complete!');
console.log('Note: These are optimized SVG files that can be used directly in browsers.');
console.log('For true PNG conversion, you can use:');
console.log('1. Online converters like https://convertio.co/svg-png/');
console.log('2. Command line tools like "inkscape" or "imagemagick"');
console.log('3. Node.js packages like "sharp" or "canvas"');

// Create a simple HTML preview file
const previewHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ikaze Property Logo Preview</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f8fafc;
            padding: 20px;
            line-height: 1.6;
        }
        .logo-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            text-align: center;
        }
        .logo-container h3 {
            margin-top: 10px;
            color: #1e293b;
        }
        .logo-container p {
            color: #64748b;
            font-size: 14px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .dark-bg {
            background: #1e293b;
            color: white;
        }
    </style>
</head>
<body>
    <h1>Ikaze Property Logo Variants</h1>
    
    <div class="grid">
        <div class="logo-container">
            <img src="logo.svg" alt="Ikaze Property Logo" />
            <h3>Main Logo</h3>
            <p>200x60px - Full version with tagline</p>
        </div>
        
        <div class="logo-container dark-bg">
            <img src="logo-horizontal.svg" alt="Ikaze Property Horizontal Logo" />
            <h3>Horizontal Logo</h3>
            <p>250x50px - Compact horizontal version</p>
        </div>
        
        <div class="logo-container">
            <img src="logo-square.svg" alt="Ikaze Property Square Logo" />
            <h3>Square Logo</h3>
            <p>100x100px - For avatars and icons</p>
        </div>
        
        <div class="logo-container">
            <div style="display: flex; gap: 20px; justify-content: center; align-items: center;">
                <div>
                    <img src="logo-200x60.svg" alt="Logo 200x60" />
                    <p>200x60</p>
                </div>
                <div>
                    <img src="logo-150x40.svg" alt="Logo 150x40" />
                    <p>150x40</p>
                </div>
                <div>
                    <img src="logo-100x100.svg" alt="Logo 100x100" />
                    <p>100x100</p>
                </div>
                <div>
                    <img src="logo-50x50.svg" alt="Logo 50x50" />
                    <p>50x50</p>
                </div>
                <div>
                    <img src="logo-favicon.svg" alt="Logo Favicon" />
                    <p>32x32</p>
                </div>
            </div>
            <h3>Size Variants</h3>
            <p>Different sizes for various use cases</p>
        </div>
    </div>
    
    <div style="margin-top: 40px; padding: 20px; background: #e0f2fe; border-radius: 8px;">
        <h2>Usage Instructions</h2>
        <p>These SVG files can be used directly in your Next.js application:</p>
        <ul>
            <li><strong>Main logo:</strong> Use for headers and branding</li>
            <li><strong>Horizontal:</strong> Use for navigation bars</li>
            <li><strong>Square:</strong> Use for favicons, avatars, and social media</li>
            <li><strong>Size variants:</strong> Pre-sized for specific use cases</li>
        </ul>
        <p><strong>To convert to PNG:</strong> Use any SVG to PNG converter online or install ImageMagick:</p>
        <code>magick logo.svg logo.png</code>
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'public', 'logo-preview.html'), previewHtml);
console.log('Created logo preview: public/logo-preview.html');
