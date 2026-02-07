import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const width = searchParams.get('width')
    const height = searchParams.get('height')
    
    if (!width || !height) {
      return NextResponse.json(
        { error: 'Missing width or height parameters' },
        { status: 400 }
      )
    }

    const w = parseInt(width)
    const h = parseInt(height)
    
    if (isNaN(w) || isNaN(h)) {
      return NextResponse.json(
        { error: 'Invalid width or height values' },
        { status: 400 }
      )
    }

    // Create a simple SVG placeholder
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
          ${w} × ${h}
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
