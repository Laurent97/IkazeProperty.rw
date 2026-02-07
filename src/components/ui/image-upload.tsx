'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Video, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { validateImage, validateVideo } from '@/lib/file-validation'

interface ImageUploadProps {
  images: Array<{ url: string; public_id: string; type: 'image' | 'video' }>
  onImagesChange: (images: Array<{ url: string; public_id: string; type: 'image' | 'video' }>) => void
  maxImages?: number
  acceptVideos?: boolean
  className?: string
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 20,
  acceptVideos = false,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} files allowed`)
      return
    }

    setError('')
    setUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file
        const validation = file.type.startsWith('image/') 
          ? validateImage(file)
          : validateVideo(file)

        if (!validation.valid) {
          throw new Error(validation.error)
        }

        // Create FormData for upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'ikazeproperty')
        formData.append('resourceType', file.type.startsWith('image/') ? 'image' : 'video')

        // Upload to our API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        const result = await response.json()
        
        return {
          url: result.data.url,
          public_id: result.data.public_id,
          type: file.type.startsWith('image/') ? 'image' as const : 'video' as const
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      onImagesChange([...images, ...uploadedImages])
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [images, maxImages, onImagesChange])

  const handleRemoveImage = useCallback(async (public_id: string) => {
    try {
      // Delete from Cloudinary
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ public_id })
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      // Remove from state
      onImagesChange(images.filter(img => img.public_id !== public_id))
    } catch (err) {
      console.error('Delete error:', err)
      // Still remove from UI even if Cloudinary delete fails
      onImagesChange(images.filter(img => img.public_id !== public_id))
    }
  }, [images, onImagesChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const event = { target: { files } } as any
    handleFileSelect(event)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card 
          className="border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CardContent className="p-8 text-center">
            <input
              type="file"
              id="file-upload"
              multiple
              accept={acceptVideos ? "image/*,video/*" : "image/*"}
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </p>
                <p className="text-sm text-gray-600">
                  Drag and drop or{' '}
                  <label 
                    htmlFor="file-upload" 
                    className="text-red-600 hover:text-red-500 cursor-pointer"
                  >
                    browse files
                  </label>
                </p>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Supported formats: {acceptVideos ? 'JPG, PNG, WebP, MP4, MOV' : 'JPG, PNG, WebP'}</p>
                <p>• Max file size: {acceptVideos ? '50MB for videos' : '5MB for images'}</p>
                <p>• Maximum {maxImages} files</p>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => document.getElementById('file-upload')?.click()}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                {uploading ? 'Uploading...' : 'Choose Files'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Uploaded Files ({images.length}/{maxImages})
            </h4>
            <span className="text-sm text-gray-500">
              First image will be the primary
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={image.public_id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {image.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-8 w-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Video</span>
                    </div>
                  ) : (
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    PRIMARY
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveImage(image.public_id)}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Photo Guidelines:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use bright, clear photos taken during daylight</li>
          <li>• Show all important features and angles</li>
          <li>• Include wide shots and close-up details</li>
          <li>• Avoid blurry or dark images</li>
          <li>• Don't include watermarks or contact information</li>
        </ul>
      </div>
    </div>
  )
}
