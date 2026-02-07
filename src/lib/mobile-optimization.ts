// Mobile-first optimization utilities for Rwandan market

export const MOBILE_BREAKPOINTS = {
  sm: '640px',   // Small phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px' // Large desktops
}

export const RWANDA_MOBILE_STATS = {
  // Based on Rwanda's mobile penetration rates
  mobilePenetration: 85.2, // percentage
  smartphoneUsage: 45.3,   // percentage
  featurePhoneUsage: 39.9, // percentage
  averageDataSpeed: '4G',  // Major cities
  ruralConnectivity: '3G' // Rural areas
}

export const MOBILE_OPTIMIZATION_CONFIG = {
  // Image optimization for low bandwidth
  imageQuality: {
    mobile: 60,
    tablet: 75,
    desktop: 85
  },
  
  // Lazy loading thresholds
  lazyLoading: {
    mobile: '200px',
    tablet: '300px',
    desktop: '400px'
  },
  
  // Touch-friendly sizing
  touchTargets: {
    minSize: '44px',    // Apple HIG minimum
    recommended: '48px' // Android recommendation
  },
  
  // Font sizes for readability
  fontSizes: {
    mobile: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    },
    desktop: {
      xs: '0.625rem',
      sm: '0.75rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem'
    }
  }
}

export const FEATURE_PHONE_COMPATIBILITY = {
  // Basic feature phone support
  supportedBrowsers: [
    'Opera Mini',
    'UC Browser',
    'Nokia Browser'
  ],
  
  // Simplified CSS for feature phones
  simplifiedCSS: {
    noAnimations: true,
    noTransitions: true,
    basicLayout: true,
    reducedColors: true
  },
  
  // Data saving mode
  dataSaver: {
    compressImages: true,
    disableVideos: true,
    minimalJavaScript: true,
    textOnlyMode: true
  }
}

// Utility functions for mobile optimization
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = [
    'android', 'iphone', 'ipad', 'ipod', 
    'blackberry', 'windows phone', 'opera mini'
  ]
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword))
}

export const isLowBandwidth = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check for slow connection or data saver mode
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection
  
  if (connection) {
    return connection.saveData || 
           connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g'
  }
  
  return false
}

export const getOptimizedImageUrl = (
  url: string, 
  deviceType: 'mobile' | 'tablet' | 'desktop' = 'mobile'
): string => {
  // Add Cloudinary transformations for optimization
  const transformations = {
    mobile: 'q_auto:low,f_auto,w_400',
    tablet: 'q_auto:good,f_auto,w_800',
    desktop: 'q_auto:best,f_auto,w_1200'
  }
  
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/${transformations[deviceType]}/`)
  }
  
  return url
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Progressive enhancement for feature phones
export const loadProgressively = () => {
  if (typeof window === 'undefined') return
  
  // Load essential content first
  document.addEventListener('DOMContentLoaded', () => {
    // Show main content immediately
    const mainContent = document.querySelector('main')
    if (mainContent) {
      mainContent.style.opacity = '1'
    }
    
    // Load non-essential features after 2 seconds
    setTimeout(() => {
      // Load chat widgets, animations, etc.
      const chatWidgets = document.querySelectorAll('[data-lazy="chat"]')
      chatWidgets.forEach(widget => {
        widget.classList.remove('hidden')
      })
    }, 2000)
    
    // Load heavy features after 5 seconds
    setTimeout(() => {
      // Load videos, carousels, etc.
      const heavyFeatures = document.querySelectorAll('[data-lazy="heavy"]')
      heavyFeatures.forEach(feature => {
        feature.classList.remove('hidden')
      })
    }, 5000)
  })
}
