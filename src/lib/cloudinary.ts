import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

// Upload function for server-side
export const uploadImage = async (
  file: string,
  options: {
    folder?: string
    transformation?: any
    resource_type?: 'image' | 'video' | 'auto'
  } = {}
) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: options.folder || 'ikazeproperty',
      resource_type: options.resource_type || 'auto',
      transformation: options.transformation,
      overwrite: false,
      use_filename: true,
      unique_filename: false,
      filename_as_display_name: true
    })

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

// Upload function for Buffer (server-side)
export const uploadBuffer = async (
  buffer: Buffer,
  filename: string,
  options: {
    folder?: string
    transformation?: any
    resource_type?: 'image' | 'video' | 'auto'
  } = {}
) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'ikazeproperty',
          resource_type: options.resource_type || 'auto',
          transformation: options.transformation,
          overwrite: false,
          use_filename: true,
          unique_filename: false,
          filename_as_display_name: true,
          public_id: filename
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              size: result.bytes
            })
          } else {
            reject(new Error('Upload failed: No result returned'))
          }
        }
      )
      
      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

// Delete function
export const deleteImage = async (public_id: string) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id)
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image')
  }
}

// Generate signed upload URL for client-side uploads
export const generateUploadSignature = (options: {
  folder?: string
  public_id?: string
  timestamp?: number
} = {}) => {
  const timestamp = options.timestamp || Math.floor(Date.now() / 1000)
  
  const params: any = {
    timestamp,
    folder: options.folder || 'ikazeproperty',
    overwrite: false,
    use_filename: true,
    unique_filename: false,
    filename_as_display_name: true
  }

  if (options.public_id) {
    params.public_id = options.public_id
  }

  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!)

  return {
    signature,
    timestamp,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    folder: params.folder,
    overwrite: params.overwrite,
    use_filename: params.use_filename,
    unique_filename: params.unique_filename,
    filename_as_display_name: params.filename_as_display_name
  }
}

// Get optimized image URL
export const getOptimizedImageUrl = (public_id: string, options: {
  width?: number
  height?: number
  crop?: string
  quality?: number
  format?: string
} = {}) => {
  const transformation = {
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
    quality: options.quality || 'auto',
    format: options.format || 'auto',
    ...options
  }

  return cloudinary.url(public_id, {
    transformation,
    secure: true
  })
}

// Get thumbnail URL
export const getThumbnailUrl = (public_id: string, size: number = 200) => {
  return getOptimizedImageUrl(public_id, {
    width: size,
    height: size,
    crop: 'thumb',
    quality: 80
  })
}

// Get listing image URLs with different sizes
export const getListingImages = (public_id: string) => {
  return {
    thumbnail: getThumbnailUrl(public_id, 150),
    small: getOptimizedImageUrl(public_id, { width: 300, height: 200, crop: 'fill' }),
    medium: getOptimizedImageUrl(public_id, { width: 600, height: 400, crop: 'fill' }),
    large: getOptimizedImageUrl(public_id, { width: 1200, height: 800, crop: 'fill' }),
    original: cloudinary.url(public_id, { secure: true })
  }
}

export default cloudinary
