import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    const dimensions = params.params.join('/')
    
    // Parse dimensions from the URL path
    const [width, height] = dimensions.split('x').map(Number)
    
    if (!width || !height || isNaN(width) || isNaN(height)) {
      return NextResponse.json(
        { error: 'Invalid dimensions. Use format: /api/placeholder/width/height' },
        { status: 400 }
      )
    }

    // Create a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
          ${width} × ${height}
        </text>
      </svg>
    `.trim()

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Placeholder API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
