import { NextRequest, NextResponse } from 'next/server'
import { uploadBuffer } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload API called')
    
    // Check environment variables
    console.log('🔑 Environment variables check:', {
      cloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: !!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      apiSecret: !!process.env.CLOUDINARY_API_SECRET
    })
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'ikazeproperty'
    const resourceType = formData.get('resourceType') as string || 'auto'

    console.log('📁 File details:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folder,
      resourceType
    })

    if (!file) {
      console.error('❌ No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Check file size (limit to 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB in bytes
    if (buffer.length > maxSize) {
      console.error('❌ File too large:', buffer.length, 'bytes')
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 100MB.' },
        { status: 400 }
      )
    }

    // Determine resource type based on file
    const fileType = file.type.startsWith('video/') ? 'video' : 'image'
    const detectedResourceType = formData.get('resourceType') as string || 'auto'
    const finalResourceType = detectedResourceType === 'auto' ? fileType : detectedResourceType

    console.log('📤 Starting Cloudinary upload...')

    // Upload to Cloudinary with appropriate settings
    const result = await uploadBuffer(buffer, file.name, {
      folder,
      resource_type: finalResourceType as 'image' | 'video' | 'auto',
      // Video-specific settings
      ...(fileType.startsWith('video/') && {
        chunk_size: '600k', // For better streaming
        eager: 'streaming' // For video optimization
      })
    })

    console.log('✅ Cloudinary upload successful:', {
      url: (result as any).secure_url || (result as any).url,
      public_id: (result as any).public_id,
      width: (result as any).width,
      height: (result as any).height
    })

    return NextResponse.json({
      success: true,
      data: {
        url: (result as any).secure_url || (result as any).url,
        public_id: (result as any).public_id,
        size: file.size,
        type: fileType,
        duration: (result as any).duration || null, // Video duration if available
        format: (result as any).format || null // Video format if available
      }
    })
  } catch (error: any) {
    console.error('❌ Upload error:', error)
    return NextResponse.json({
      success: false,
      error: (error as any).message || 'Failed to upload file'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { public_id } = await request.json()

    if (!public_id) {
      return NextResponse.json(
        { error: 'No public_id provided' },
        { status: 400 }
      )
    }

    const { deleteImage } = await import('@/lib/cloudinary')
    const result = await deleteImage(public_id)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
