'use client'

import { useEffect } from 'react'

interface StructuredDataProps {
  data: object
  type: string
}

export default function StructuredData({ data, type }: StructuredDataProps) {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(data)
    
    // Add to head
    document.head.appendChild(script)
    
    // Cleanup on unmount
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [data])

  return null
}
