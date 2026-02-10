'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageViewerProps {
  images: string[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export default function ImageViewer({ images, initialIndex = 0, isOpen, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; distance: number } | null>(null)
  const [lastTouchEnd, setLastTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1 + images.length) % images.length)
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn()
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut()
      } else if (e.key === '0') {
        handleResetZoom()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, images.length, onClose])

  // Reset zoom when image changes
  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [currentIndex])

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleResetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2)
    } else {
      handleResetZoom()
    }
  }

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touches = e.touches
    
    if (touches.length === 1) {
      // Single touch - potential swipe or drag
      setTouchStart({
        x: touches[0].clientX,
        y: touches[0].clientY,
        distance: 0
      })
    } else if (touches.length === 2) {
      // Two fingers - pinch to zoom
      const distance = Math.hypot(
        touches[1].clientX - touches[0].clientX,
        touches[1].clientY - touches[0].clientY
      )
      setTouchStart({
        x: 0,
        y: 0,
        distance
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const touches = e.touches
    
    if (touches.length === 1 && touchStart) {
      // Single touch - drag to pan when zoomed
      if (scale > 1) {
        const deltaX = touches[0].clientX - touchStart.x
        const deltaY = touches[0].clientY - touchStart.y
        setPosition(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }))
        setTouchStart({
          ...touchStart,
          x: touches[0].clientX,
          y: touches[0].clientY
        })
      }
    } else if (touches.length === 2 && touchStart && touchStart.distance > 0) {
      // Two fingers - pinch to zoom
      const currentDistance = Math.hypot(
        touches[1].clientX - touches[0].clientX,
        touches[1].clientY - touches[0].clientY
      )
      const scaleDelta = currentDistance / touchStart.distance
      const newScale = Math.min(Math.max(scale * scaleDelta, 0.5), 3)
      setScale(newScale)
      setTouchStart({
        ...touchStart,
        distance: currentDistance
      })
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTouchEnd
    
    if (tapLength < 300 && tapLength > 0 && e.touches.length === 0) {
      // Double tap detected
      handleDoubleClick()
    }
    
    setLastTouchEnd(currentTime)
    
    if (touchStart && touchStart.distance === 0 && scale === 1) {
      // Check for swipe gesture
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)
      
      if (absDeltaX > 50 && absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          goToPrevious()
        } else {
          goToNext()
        }
      }
    }
    
    setTouchStart(null)
  }

  if (!isOpen) return null

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative w-full h-full flex flex-col">
        {/* Top Controls - Mobile Optimized */}
        <div className="flex justify-between items-center p-2 sm:p-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            title="Close image viewer"
            className="p-2 sm:p-3 text-white hover:bg-gray-800 rounded-full transition-colors touch-manipulation"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Zoom Controls - Responsive */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleZoomOut}
              title="Zoom out"
              className="p-1.5 sm:p-2 text-white hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50 touch-manipulation"
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <span className="text-white text-xs sm:text-sm min-w-[2.5rem] sm:min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Zoom in"
              className="p-1.5 sm:p-2 text-white hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50 touch-manipulation"
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset zoom"
              className="p-1.5 sm:p-2 text-white hover:bg-gray-800 rounded-full transition-colors touch-manipulation hidden sm:block"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Main Image Container - Mobile Optimized */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden flex items-center justify-center touch-none"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="relative"
            style={{
              '--scale': scale,
              '--translate-x': `${position.x / scale}px`,
              '--translate-y': `${position.y / scale}px`,
              transform: `scale(var(--scale)) translate(var(--translate-x), var(--translate-y))`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
            } as React.CSSProperties}
            onDoubleClick={handleDoubleClick}
          >
            <img
              ref={imageRef}
              src={images[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none touch-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Navigation - Mobile Optimized */}
        {images.length > 1 && (
          <div className="flex justify-between items-center p-2 sm:p-4">
            <button
              onClick={goToPrevious}
              title="Previous image"
              className="p-2 sm:p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all touch-manipulation"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <div className="text-white text-xs sm:text-sm">
              {currentIndex + 1} / {images.length}
            </div>

            <button
              onClick={goToNext}
              title="Next image"
              className="p-2 sm:p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all touch-manipulation"
              disabled={currentIndex === images.length - 1}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        )}

        {/* Mobile Instructions */}
        <div className="block sm:hidden text-center text-white text-xs opacity-75 p-2">
          <p>Swipe to navigate • Pinch to zoom • Double-tap to zoom</p>
        </div>
      </div>
    </div>
  )
}
