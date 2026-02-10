import { NextRequest, NextResponse } from 'next/server'
import { uploadBuffer } from '@/lib/cloudinary'
import { addImageWatermark, getTextWatermarkTransformation } from '@/lib/watermark'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload API called')
    
    // Check environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    console.log('🔑 Environment variables check:', {
      cloudName: !!cloudName,
      apiKey: !!apiKey,
      apiSecret: !!apiSecret
    })
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('❌ Missing Cloudinary configuration')
      return NextResponse.json(
        { error: 'Server configuration error: Cloudinary not properly configured' },
        { status: 500 }
      )
    }
    
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
    let buffer = Buffer.from(bytes)

    // Determine resource type based on file
    const fileType = file.type.startsWith('video/') ? 'video' : 'image'
    const detectedResourceType = formData.get('resourceType') as string || 'auto'
    const finalResourceType = detectedResourceType === 'auto' ? fileType : detectedResourceType

    // Watermarking disabled - only apply to new uploads when ready
    // TODO: Re-enable watermarking when system is stable
    if (false && fileType.startsWith('image/')) {
      console.log('🖼️ Processing image file:', file.name, 'Type:', fileType)
      try {
        buffer = (await addImageWatermark(buffer as any)) as any
        console.log('✅ Watermark successfully added to image:', file.name)
      } catch (error) {
        console.warn('⚠️ Failed to add watermark, continuing with original image:', error)
      }
    } else if (false && fileType.startsWith('video/')) {
      console.log('🎥 Processing video file:', file.name, 'Type:', fileType)
      console.log('📝 Will apply watermark via Cloudinary transformation')
    }

    // Check file size (limit to 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB in bytes
    if (buffer.length > maxSize) {
      console.error('❌ File too large:', buffer.length, 'bytes')
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 100MB.' },
        { status: 400 }
      )
    }

    console.log('📤 Starting Cloudinary upload...')

    // Upload to Cloudinary with appropriate settings
    const uploadOptions: any = {
      folder,
      resource_type: finalResourceType as 'image' | 'video' | 'auto',
      // Video-specific settings
      ...(fileType.startsWith('video/') && {
        chunk_size: '600k', // For better streaming
        eager: 'streaming', // For video optimization
        // Watermarking disabled for now
        // ...getTextWatermarkTransformation() // Add watermark to videos
      })
    }

    const result = await uploadBuffer(buffer, file.name, uploadOptions)

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
