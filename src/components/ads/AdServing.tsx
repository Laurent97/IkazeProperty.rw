'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ExternalLink, Minimize2, Maximize2 } from 'lucide-react'

interface AdPlacement {
  id: string
  title: string
  image?: string
  link?: string
  description?: string
  type: 'banner' | 'sponsored' | 'premium_listing'
  isSponsored?: boolean
  campaignId?: string
  advertiser?: {
    name: string
    email?: string
  }
}

interface AdServingProps {
  placementCode: string
  className?: string
  maxWidth?: number
  maxHeight?: number
  showCloseButton?: boolean
  showMinimizeButton?: boolean
}

export default function AdServing({ 
  placementCode, 
  className = '', 
  maxWidth, 
  maxHeight, 
  showCloseButton = false,
  showMinimizeButton = true 
}: AdServingProps) {
  const [ad, setAd] = useState<AdPlacement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClosed, setIsClosed] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [impressionRecorded, setImpressionRecorded] = useState(false)

  // Helper function to get CSS classes based on ad type and dimensions
  const getAdSizeClasses = (type: string) => {
    switch (type) {
      case 'banner':
        return 'w-full max-w-[970px] h-[250px]'
      case 'sponsored':
        return 'w-full max-w-[300px] h-[250px]'
      case 'premium_listing':
        return 'w-full max-w-[400px] h-[300px]'
      default:
        return 'w-full max-w-[300px] h-[250px]'
    }
  }

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/ads?placement=${placementCode}&status=active`)
        const data = await response.json()
        
        if (response.ok && data.ad) {
          setAd(data.ad)
        } else {
          setAd(null)
        }
      } catch (error) {
        console.error('Error fetching ad:', error)
        setAd(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAd()
  }, [placementCode])

  useEffect(() => {
    // Record impression when ad is visible and not already recorded
    if (ad && !impressionRecorded && !isClosed && !isMinimized) {
      recordAnalytics('impression')
      setImpressionRecorded(true)
    }
  }, [ad, impressionRecorded, isClosed, isMinimized, placementCode])

  const recordAnalytics = async (type: 'impression' | 'click') => {
    try {
      await fetch('/api/ads/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: ad?.campaignId || ad?.id,
          type,
          userAgent: navigator.userAgent,
          ip: null, // Will be set by server
          referrer: document.referrer
        })
      })
    } catch (error) {
      console.error('Error recording analytics:', error)
    }
  }

  const handleClick = () => {
    if (ad) {
      // Record click in analytics
      recordAnalytics('click')
      
      // Open link in new tab if external
      if (ad.link?.startsWith('#')) {
        // Internal link - navigate within app
        window.location.href = ad.link
      } else if (ad.link) {
        // External link
        window.open(ad.link, '_blank', 'noopener,noreferrer')
      }
    }
  }

  const handleClose = () => {
    setIsClosed(true)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  // Don't render anything if no ad or closed
  if (!ad || isClosed || isLoading) {
    if (isLoading) {
      return (
        <div className={`${className} bg-gray-100 animate-pulse flex items-center justify-center ${getAdSizeClasses(ad?.type || 'banner')}`}> 
          <div className="text-gray-400 text-sm">Loading ad...</div>
        </div>
      )
    }
    return null
  }

  // Minimized state - show a small bar with restore option
  if (isMinimized) {
    return (
      <div className={`${className} relative group bg-gray-100 border border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition-colors minimized-ad-bar`} onClick={handleMinimize}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">AD</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">{ad.title}</span>
            {ad.isSponsored && (
              <span className="text-xs text-gray-500">• SPONSORED</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMinimize()
            }}
            className="bg-white hover:bg-gray-50 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity touch-target"
            aria-label="Restore ad"
            title="Restore ad"
          >
            <Maximize2 className="h-3 w-3 text-gray-600" />
          </button>
        </div>
      </div>
    )
  }

  // Different rendering based on ad type
  const renderAd = () => {
    const baseClasses = `relative group cursor-pointer ${className} ${getAdSizeClasses(ad.type)}`

    switch (ad.type) {
      case 'banner':
        return (
          <div className={baseClasses} onClick={handleClick}>
            <div className="relative overflow-hidden rounded-lg">
              {/* Minimize Button */}
              {showMinimizeButton && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMinimize()
                  }}
                  className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity touch-target"
                  aria-label="Minimize ad"
                  title="Minimize ad"
                >
                  <Minimize2 className="h-3 w-3 text-gray-600" />
                </button>
              )}
              
              {ad.image ? (
                <Image
                  src={ad.image}
                  alt={ad.title}
                  width={maxWidth || 728}
                  height={maxHeight || 250}
                  className="w-full h-auto object-cover"
                  unoptimized={ad.image?.startsWith('/api/placeholder')}
                />
              ) : (
                <div className={`bg-gray-200 flex items-center justify-center ${getAdSizeClasses('banner')}`}> 
                  <span className="text-gray-500">Ad Space</span>
                </div>
              )}
              {ad.isSponsored && (
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  SPONSORED
                </div>
              )}
              {ad.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                  {ad.description}
                </div>
              )}
            </div>
          </div>
        )

      case 'sponsored':
        return (
          <div className={baseClasses} onClick={handleClick}>
            {/* Minimize Button */}
            {showMinimizeButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleMinimize()
                }}
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity touch-target"
                aria-label="Minimize ad"
                title="Minimize ad"
              >
                <Minimize2 className="h-3 w-3 text-gray-600" />
              </button>
            )}
            
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {ad.image ? (
                <Image
                  src={ad.image}
                  alt={ad.title}
                  width={maxWidth || 300}
                  height={maxHeight || 250}
                  className="w-full h-auto object-cover"
                  unoptimized={ad.image?.startsWith('/api/placeholder')}
                />
              ) : (
                <div className={`bg-gray-100 flex items-center justify-center p-8 ${getAdSizeClasses('sponsored')}`}> 
                  <span className="text-gray-500 text-center">Ad Space<br/>{maxWidth}x{maxHeight}</span>
                </div>
              )}
              <div className="p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">{ad.title}</h4>
                <div className="flex items-center justify-between">
                  {ad.isSponsored && (
                    <span className="text-xs text-gray-500">SPONSORED</span>
                  )}
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )

      case 'premium_listing':
        return (
          <div className={baseClasses} onClick={handleClick}>
            {/* Minimize Button */}
            {showMinimizeButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleMinimize()
                }}
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity touch-target"
                aria-label="Minimize ad"
                title="Minimize ad"
              >
                <Minimize2 className="h-3 w-3 text-gray-600" />
              </button>
            )}
            
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {ad.image ? (
                <Image
                  src={ad.image}
                  alt={ad.title}
                  width={maxWidth || 400}
                  height={maxHeight || 300}
                  className="w-full h-auto object-cover"
                  unoptimized={ad.image?.startsWith('/api/placeholder')}
                />
              ) : (
                <div className={`bg-gray-100 flex items-center justify-center ${getAdSizeClasses('premium_listing')}`}> 
                  <span className="text-gray-500">Premium Listing</span>
                </div>
              )}
              <div className="p-3">
                <h4 className="font-semibold text-gray-900 mb-1">{ad.title}</h4>
                {ad.description && (
                  <p className="text-sm text-gray-600">{ad.description}</p>
                )}
                {ad.isSponsored && (
                  <div className="mt-2">
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                      PROMOTED
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className={baseClasses} onClick={handleClick}>
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4">
              <div className="text-center">
                <div className="text-gray-500 mb-2">Ad Space</div>
                <div className="text-xs text-gray-400">{maxWidth}x{maxHeight}</div>
              </div>
            </div>
          </div>
        )
    }
  }

  return renderAd()
}

// Predefined placement components for easy use
export function HomepageLeaderboard(props: Omit<AdServingProps, 'placementCode'>) {
  return <AdServing {...props} placementCode="homepage_leaderboard" maxWidth={970} maxHeight={250} showMinimizeButton={true} />
}

export function HomepageSidebar(props: Omit<AdServingProps, 'placementCode'>) {
  return <AdServing {...props} placementCode="homepage_sidebar" maxWidth={300} maxHeight={250} showMinimizeButton={true} />
}

export function CategoryTopBanner(props: Omit<AdServingProps, 'placementCode'>) {
  return <AdServing {...props} placementCode="category_top" maxWidth={728} maxHeight={90} showMinimizeButton={true} />
}

export function ListingSidebar(props: Omit<AdServingProps, 'placementCode'>) {
  return <AdServing {...props} placementCode="listing_sidebar" maxWidth={300} maxHeight={250} showMinimizeButton={true} />
}

export function FeaturedCarousel(props: Omit<AdServingProps, 'placementCode'>) {
  return <AdServing {...props} placementCode="featured_carousel" maxWidth={400} maxHeight={300} showMinimizeButton={true} />
}
