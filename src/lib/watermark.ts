import sharp from 'sharp'

// Add watermark to images
export const addImageWatermark = async (
  imageBuffer: Buffer | ArrayBuffer,
  watermarkPath: string = '/images/ikazeproperty-logo.png'
): Promise<Buffer> => {
  try {
    // For now, we'll use a simple text watermark since we can't easily access the logo file in server environment
    // In production, you might want to store the watermark in Cloudinary and use their overlay features
    
    const watermarkSvg = `
      <svg width="300" height="60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#dc2626;stop-opacity:0.95" />
            <stop offset="100%" style="stop-color:#991b1b;stop-opacity:0.95" />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        <rect width="300" height="60" fill="url(#grad1)" rx="8" filter="url(#shadow)" />
        <text x="150" y="35" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">
          www.ikazeproperty.org
        </text>
      </svg>
    `

    const watermarkBuffer = Buffer.from(watermarkSvg)

    // Convert input to Buffer if it's an ArrayBuffer
    const inputBuffer = imageBuffer instanceof ArrayBuffer ? Buffer.from(imageBuffer) : imageBuffer

    const watermarkedImage = await sharp(inputBuffer)
      .composite([{
        input: watermarkBuffer,
        gravity: 'southeast',
        blend: 'over'
      }])
      .png()
      .toBuffer()

    console.log('✅ Watermark applied successfully to image')
    return watermarkedImage
  } catch (error) {
    console.error('Error adding watermark:', error)
    // Return original image if watermarking fails
    return imageBuffer instanceof ArrayBuffer ? Buffer.from(imageBuffer) : imageBuffer
  }
}

// Cloudinary transformation for watermarking
export const getWatermarkTransformation = () => {
  return {
    transformation: [
      {
        overlay: {
          url: 'https://res.cloudinary.com/demo/image/upload/w_200,h_60,c_fit/sample'
        },
        gravity: 'south_east',
        x: 10,
        y: 10,
        opacity: 80
      }
    ]
  }
}

// Alternative: Use Cloudinary's built-in text overlay
export const getTextWatermarkTransformation = () => {
  return {
    transformation: [
      {
        overlay: {
          font_family: 'Arial',
          font_size: 20,
          font_weight: 'bold',
          text: 'www.ikazeproperty.org',
          color: '#ffffff'
        },
        gravity: 'south_east',
        x: 15,
        y: 15,
        opacity: 95,
        background: 'rgb(220,38,38)',
        border: '3px_solid_rgb(153,27,27)',
        radius: 8
      }
    ]
  }
}
