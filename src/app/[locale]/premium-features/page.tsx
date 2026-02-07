'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, Clock, TrendingUp, Zap, Users, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PremiumFeaturesPage() {
  const [selectedListing, setSelectedListing] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const premiumFeatures = [
    {
      code: 'featured_placement',
      name: 'Featured Placement',
      description: 'Appears at top of category pages for 7 days',
      price: 15000,
      duration: 7,
      icon: Star,
      color: 'bg-yellow-500',
      features: [
        'Top placement in category results',
        'Highlighted with special badge',
        'Increased visibility by 300%',
        '7-day duration'
      ],
      popular: true
    },
    {
      code: 'urgent_badge',
      name: 'Urgent Badge',
      description: 'Red URGENT badge with priority ranking',
      price: 5000,
      duration: 14,
      icon: Zap,
      color: 'bg-red-500',
      features: [
        'Eye-catching red badge',
        'Priority in search results',
        '14-day duration',
        'Perfect for time-sensitive listings'
      ]
    },
    {
      code: 'homepage_carousel',
      name: 'Homepage Feature',
      description: 'Featured in homepage carousel for 3 days',
      price: 25000,
      duration: 3,
      icon: TrendingUp,
      color: 'bg-purple-500',
      features: [
        'Homepage carousel placement',
        'Maximum exposure to all visitors',
        'Premium positioning',
        '3-day duration'
      ],
      popular: true
    },
    {
      code: 'social_boost',
      name: 'Social Media Boost',
      description: 'Promoted on our social media channels',
      price: 10000,
      duration: 7,
      icon: Users,
      color: 'bg-blue-500',
      features: [
        'Facebook promotion',
        'Instagram features',
        'Twitter mentions',
        'Reach 50,000+ users'
      ]
    },
    {
      code: 'whatsapp_blast',
      name: 'WhatsApp Broadcast',
      description: 'Sent to relevant subscriber groups',
      price: 8000,
      duration: 1,
      icon: MessageCircle,
      color: 'bg-green-500',
      features: [
        'Targeted WhatsApp groups',
        '1000+ subscribers reach',
        'Instant delivery',
        'High engagement rates'
      ]
    }
  ]

  const bundles = [
    {
      name: 'Starter Pack',
      description: 'Perfect for new listings',
      originalPrice: 20000,
      price: 17000,
      savings: 15,
      features: ['Urgent Badge', 'Social Media Boost'],
      color: 'bg-gray-100 border-gray-300'
    },
    {
      name: 'Growth Pack',
      description: 'Our most popular combination',
      originalPrice: 40000,
      price: 32000,
      savings: 20,
      features: ['Featured Placement', 'Urgent Badge', 'Social Media Boost'],
      color: 'bg-blue-100 border-blue-300',
      popular: true
    },
    {
      name: 'Premium Pack',
      description: 'Maximum visibility guaranteed',
      originalPrice: 65000,
      price: 48000,
      savings: 26,
      features: ['Homepage Feature', 'Featured Placement', 'Urgent Badge', 'WhatsApp Blast'],
      color: 'bg-purple-100 border-purple-300'
    }
  ]

  const handleFeatureToggle = (featureCode: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureCode) 
        ? prev.filter(f => f !== featureCode)
        : [...prev, featureCode]
    )
  }

  const calculateTotal = () => {
    return selectedFeatures.reduce((total, featureCode) => {
      const feature = premiumFeatures.find(f => f.code === featureCode)
      return total + (feature?.price || 0)
    }, 0)
  }

  const getSelectedFeaturesDetails = () => {
    return selectedFeatures.map(code => 
      premiumFeatures.find(f => f.code === code)
    ).filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Features Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Boost your listings with our powerful promotion features
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">3.5x</div>
              <div className="text-gray-600">More Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">2.8x</div>
              <div className="text-gray-600">More Inquiries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">50%</div>
              <div className="text-gray-600">Faster Sales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Individual Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select individual features or save money with our bundles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {premiumFeatures.map((feature) => {
              const Icon = feature.icon
              const isSelected = selectedFeatures.includes(feature.code)
              
              return (
                <Card 
                  key={feature.code} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-red-500 border-red-500' : ''
                  }`}
                  onClick={() => handleFeatureToggle(feature.code)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {feature.popular && (
                        <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl">{feature.name}</CardTitle>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-bold text-gray-900">
                          RWF {feature.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          /{feature.duration} days
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'bg-red-600 border-red-600' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bundle Deals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Save Big with Bundles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pre-packaged combinations for maximum impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bundles.map((bundle, index) => (
              <Card 
                key={index} 
                className={`${bundle.color} ${
                  bundle.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                }`}
              >
                <CardHeader className="text-center">
                  {bundle.popular && (
                    <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                      MOST POPULAR
                    </span>
                  )}
                  <CardTitle className="text-2xl mb-2">{bundle.name}</CardTitle>
                  <p className="text-gray-600 mb-4">{bundle.description}</p>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      RWF {bundle.price.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-500 line-through">
                      RWF {bundle.originalPrice.toLocaleString()}
                    </div>
                    <div className="text-green-600 font-semibold">
                      Save {bundle.savings}%
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {bundle.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Choose Bundle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Selection Summary */}
      {selectedFeatures.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Your Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {getSelectedFeaturesDetails().map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 ${feature.color} rounded-lg flex items-center justify-center mr-3`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{feature.name}</div>
                            <div className="text-sm text-gray-600">{feature.duration} days</div>
                          </div>
                        </div>
                        <div className="font-semibold">
                          RWF {feature.price.toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-3xl font-bold text-red-600">
                      RWF {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Listing to Promote
                    </label>
                    <select
                      value={selectedListing}
                      onChange={(e) => setSelectedListing(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Choose a listing...</option>
                      <option value="1">Modern 3-Bedroom Apartment</option>
                      <option value="2">Toyota Land Cruiser 2022</option>
                      <option value="3">Residential Plot - 500m²</option>
                    </select>
                  </div>
                  
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={!selectedListing}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Boost Your Listings?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Join thousands of sellers who increased their sales with premium features
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              Browse Features
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              View Success Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
