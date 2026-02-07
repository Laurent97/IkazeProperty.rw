// Client-side file validation functions (no Node.js dependencies)

// Validate image before upload
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' }
  }

  return { valid: true }
}

// Validate video before upload
export const validateVideo = (file: File): { valid: boolean; error?: string } => {
  // Check file size (max 50MB for videos)
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, error: 'Video file size must be less than 50MB' }
  }

  // Check file type
  const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only MP4, MOV, and AVI videos are allowed' }
  }

  return { valid: true }
}
