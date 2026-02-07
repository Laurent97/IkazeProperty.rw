import Link from 'next/link'
import { Search, Users, Shield, CheckCircle, ArrowRight, Clock, FileText, Handshake } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: 'Browse & Discover',
      description: 'Search through our curated listings of properties, vehicles, and valuable items across Rwanda.',
      details: [
        'Advanced search filters',
        'High-quality images',
        'Detailed descriptions',
        'Verified seller information'
      ]
    },
    {
      icon: Users,
      title: 'Express Interest',
      description: 'Found something you like? Click "Express Interest" and our admin team will facilitate the connection.',
      details: [
        'No direct contact required',
        'Admin verification process',
        'Secure communication channel',
        'Privacy protection'
      ]
    },
    {
      icon: Shield,
      title: 'Admin Mediation',
      description: 'Our professional admin team reviews and mediates every transaction to ensure safety and fairness.',
      details: [
        'Identity verification',
        'Document validation',
        'Price negotiation support',
        'Legal compliance check'
      ]
    },
    {
      icon: Handshake,
      title: 'Complete Transaction',
      description: 'Finalize your deal with our 30% commission guarantee and ongoing support.',
      details: [
        'Secure payment processing',
        'Transfer assistance',
        'Post-sale support',
        'Dispute resolution'
      ]
    }
  ]

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Verified Listings',
      description: 'All listings are reviewed by our admin team for authenticity and accuracy.'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Every transaction is mediated to protect both buyers and sellers.'
    },
    {
      icon: Clock,
      title: 'Quick Processing',
      description: 'Most transactions are completed within 3-5 business days.'
    },
    {
      icon: FileText,
      title: 'Legal Support',
      description: 'Access to legal documentation and compliance assistance.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How It Works
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Simple, secure, and transparent process for buying and selling in Rwanda
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Simple Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four easy steps to complete your transaction safely and securely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2" />
                  )}
                  <Card className="h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-red-600" />
                      </div>
                      <div className="text-sm font-semibold text-red-600 mb-2">
                        STEP {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>
                      <ul className="text-sm text-gray-500 text-left space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Process?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Benefits that make us the most trusted marketplace in Rwanda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transparent Commission Structure
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We charge a 30% commission on successful transactions. This ensures we're invested in making every deal work perfectly for both parties.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">No Hidden Fees</h4>
                    <p className="text-gray-600">You only pay when your transaction is successful</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Includes Full Support</h4>
                    <p className="text-gray-600">Admin mediation, legal support, and dispute resolution</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Risk-Free</h4>
                    <p className="text-gray-600">If the deal doesn't close, you don't pay anything</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Commission Example</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Price:</span>
                  <span className="font-semibold">RWF 10,000,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission (30%):</span>
                  <span className="font-semibold text-red-600">RWF 3,000,000</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-semibold">Seller Receives:</span>
                    <span className="font-bold text-xl">RWF 7,000,000</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                *Commission includes all admin fees, legal support, and platform services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Join thousands of Rwandans who trust our secure marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                Browse Listings
              </Button>
            </Link>
            <Link href="/create-listing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
