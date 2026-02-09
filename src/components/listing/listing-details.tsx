'use client'

import { useState, useEffect } from 'react'
import { Bed, Bath, Square, Car, Trees, Home, Zap, Droplets, Shield, Gauge, Fuel, Calendar, MapPin, Package, Eye, EyeOff } from 'lucide-react'
import type { Database } from '@/types/database'
import WatermarkAccessRequest from './watermark-access-request'

interface ListingDetailsProps {
  category: string
  listing: Database['public']['Tables']['listings']['Row'] & {
    house_details?: Database['public']['Tables']['house_details']['Row']
    car_details?: Database['public']['Tables']['car_details']['Row']
    land_details?: Database['public']['Tables']['land_details']['Row']
    other_item_details?: Database['public']['Tables']['other_item_details']['Row']
  }
  className?: string
}

export default function ListingDetails({ category, listing, className = '' }: ListingDetailsProps) {
  const [canViewWatermarks, setCanViewWatermarks] = useState<boolean>(true) // Default to true for now
  const [isCheckingPermission, setIsCheckingPermission] = useState<boolean>(false)

  // For now, always allow viewing details
  // TODO: Implement watermark permission checking when policies are set up
  useEffect(() => {
    // Temporarily disabled until database policies are implemented
    setCanViewWatermarks(true)
    setIsCheckingPermission(false)
  }, [listing.id])

  const renderHouseDetails = () => {
    const details = listing.house_details
    if (!details) return null

    const items = []

    // Bedrooms (always collected)
    if (details.bedrooms) {
      items.push({
        icon: Bed,
        label: 'Bedrooms',
        value: `${details.bedrooms} bed`
      })
    }

    // Bathrooms (always collected)
    if (details.bathrooms) {
      items.push({
        icon: Bath,
        label: 'Bathrooms',
        value: `${details.bathrooms} bath`
      })
    }

    // Total Area (always collected)
    if (details.total_area) {
      items.push({
        icon: Square,
        label: 'Area',
        value: `${details.total_area}m²`
      })
    }

    // Year Built (optional)
    if (details.year_built) {
      items.push({
        icon: Calendar,
        label: 'Built',
        value: details.year_built.toString()
      })
    }

    // Furnished (always collected, but show if not unfurnished)
    if (details.furnished && details.furnished !== 'unfurnished') {
      items.push({
        icon: Home,
        label: 'Furnished',
        value: details.furnished.replace('_', ' ')
      })
    }

    // Parking (optional, but show if not none)
    if (details.parking && details.parking !== 'none') {
      items.push({
        icon: Car,
        label: 'Parking',
        value: details.parking
      })
    }

    return items.slice(0, 4).map((item, index) => {
      const Icon = item.icon
      return (
        <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
          <Icon className="h-3 w-3" />
          <span>{item.value}</span>
        </div>
      )
    })
  }

  const renderCarDetails = () => {
    const details = listing.car_details
    if (!details) return null

    const items = []

    // Year Manufacture (always collected)
    if (details.year_manufacture) {
      items.push({
        icon: Calendar,
        label: 'Year',
        value: details.year_manufacture.toString()
      })
    }

    // Mileage (always collected)
    if (details.mileage) {
      items.push({
        icon: Gauge,
        label: 'Mileage',
        value: `${details.mileage.toLocaleString()} km`
      })
    }

    // Fuel Type (always collected)
    if (details.fuel_type) {
      items.push({
        icon: Fuel,
        label: 'Fuel',
        value: details.fuel_type
      })
    }

    // Transmission (always collected)
    if (details.transmission) {
      items.push({
        icon: Gauge,
        label: 'Transmission',
        value: details.transmission
      })
    }

    // Make + Model (always collected)
    if (details.make && details.model) {
      items.push({
        icon: Car,
        label: 'Model',
        value: `${details.make} ${details.model}`
      })
    }

    // Color (optional)
    if (details.color) {
      items.push({
        icon: Car,
        label: 'Color',
        value: details.color
      })
    }

    // Doors (optional)
    if (details.doors) {
      items.push({
        icon: Car,
        label: 'Doors',
        value: `${details.doors} doors`
      })
    }

    // Seats (optional)
    if (details.seats) {
      items.push({
        icon: Car,
        label: 'Seats',
        value: `${details.seats} seats`
      })
    }

    return items.slice(0, 4).map((item, index) => {
      const Icon = item.icon
      return (
        <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
          <Icon className="h-3 w-3" />
          <span>{item.value}</span>
        </div>
      )
    })
  }

  const renderLandDetails = () => {
    const details = listing.land_details
    if (!details) return null

    const items = []

    // Plot Size + Unit (always collected)
    if (details.plot_size && details.size_unit) {
      items.push({
        icon: Square,
        label: 'Size',
        value: `${details.plot_size} ${details.size_unit}`
      })
    }

    // Plot Type (always collected)
    if (details.plot_type) {
      items.push({
        icon: Trees,
        label: 'Type',
        value: details.plot_type
      })
    }

    // Shape (always collected)
    if (details.shape) {
      items.push({
        icon: Square,
        label: 'Shape',
        value: details.shape
      })
    }

    // Topography (always collected)
    if (details.topography) {
      items.push({
        icon: Trees,
        label: 'Topography',
        value: details.topography
      })
    }

    // Road Access (always collected)
    if (details.road_access) {
      items.push({
        icon: MapPin,
        label: 'Access',
        value: details.road_access
      })
    }

    // Land Title Type (always collected)
    if (details.land_title_type) {
      items.push({
        icon: Shield,
        label: 'Title',
        value: details.land_title_type
      })
    }

    // Fenced (optional, but show if true)
    if (details.fenced) {
      items.push({
        icon: Shield,
        label: 'Fenced',
        value: 'Yes'
      })
    }

    // Surveyed (optional, but show if true)
    if (details.surveyed) {
      items.push({
        icon: MapPin,
        label: 'Surveyed',
        value: 'Yes'
      })
    }

    return items.slice(0, 4).map((item, index) => {
      const Icon = item.icon
      return (
        <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
          <Icon className="h-3 w-3" />
          <span>{item.value}</span>
        </div>
      )
    })
  }

  const renderOtherDetails = () => {
    const details = listing.other_item_details
    if (!details) return null

    const items = []

    // Subcategory (always collected)
    if (details.subcategory) {
      items.push({
        icon: Package,
        label: 'Category',
        value: details.subcategory
      })
    }

    // Condition (always collected)
    if (details.condition) {
      items.push({
        icon: Shield,
        label: 'Condition',
        value: details.condition.replace('_', ' ')
      })
    }

    // Brand (optional)
    if (details.brand) {
      items.push({
        icon: Package,
        label: 'Brand',
        value: details.brand
      })
    }

    // Model (optional)
    if (details.model) {
      items.push({
        icon: Package,
        label: 'Model',
        value: details.model
      })
    }

    // Warranty Available (optional, but show if true)
    if (details.warranty_available) {
      items.push({
        icon: Shield,
        label: 'Warranty',
        value: 'Available'
      })
    }

    return items.slice(0, 4).map((item, index) => {
      const Icon = item.icon
      return (
        <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
          <Icon className="h-3 w-3" />
          <span>{item.value}</span>
        </div>
      )
    })
  }

  const renderDetails = () => {
    switch (category.toLowerCase()) {
      case 'houses':
      case 'house':
        return renderHouseDetails()
      case 'cars':
      case 'car':
        return renderCarDetails()
      case 'land':
        return renderLandDetails()
      default:
        return renderOtherDetails()
    }
  }

  const details = renderDetails()

  // Don't show anything if no details exist
  if (!details || details.length === 0) {
    return null
  }

  // If checking permission, show loading state
  if (isCheckingPermission) {
    return (
      <div className={`flex flex-wrap gap-2 mb-3 ${className}`}>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <EyeOff className="h-3 w-3" />
          <span>Checking permissions...</span>
        </div>
      </div>
    )
  }

  // If user cannot view watermarks, show restricted message with access request
  if (!canViewWatermarks) {
    return (
      <div className={`flex flex-wrap items-center gap-2 mb-3 ${className}`}>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <EyeOff className="h-3 w-3" />
          <span>Details hidden</span>
        </div>
        <WatermarkAccessRequest listingId={listing.id} />
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap gap-2 mb-3 ${className}`}>
      {details}
    </div>
  )
}
