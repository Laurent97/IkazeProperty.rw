import Link from 'next/link'
import { FileText, CheckCircle, Shield, Calculator, Users, Handshake } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CommissionAgreementPage() {
  const commissionStructure = [
    {
      type: 'Property Transactions',
      rate: '30%',
      description: 'All property sales and rentals',
      examples: ['Houses & Apartments', 'Land & Plots', 'Commercial Properties']
    },
    {
      type: 'Vehicle Transactions',
      rate: '30%',
      description: 'All vehicle sales and rentals',
      examples: ['Cars & SUVs', 'Motorcycles', 'Commercial Vehicles']
    },
    {
      type: 'Other Items',
      rate: '30%',
      description: 'All other valuable items',
      examples: ['Electronics', 'Furniture', 'Equipment']
    }
  ]

  const whatCommissionCovers = [
    {
      icon: Shield,
      title: 'Transaction Security',
      description: 'Secure payment processing and fraud protection'
    },
    {
      icon: Users,
      title: 'Admin Mediation',
      description: 'Professional mediation between buyer and seller'
    },
    {
      icon: FileText,
      title: 'Legal Support',
      description: 'Document preparation and legal compliance'
    },
    {
      icon: Handshake,
      title: 'Dispute Resolution',
      description: 'Fair dispute resolution and conflict management'
    }
  ]

  const paymentTerms = [
    {
      title: 'Payment Timing',
      description: 'Commission is paid only upon successful completion of the transaction'
    },
    {
      title: 'Payment Method',
      description: 'Automatically deducted from the transaction amount before seller payout'
    },
    {
      title: 'Refund Policy',
      description: 'No commission charged if transaction fails due to platform issues'
    },
    {
      title: 'Invoice Provided',
      description: 'Detailed invoice provided for all commission payments'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Commission Agreement
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Transparent commission structure that ensures successful, secure transactions
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Commission Structure
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, transparent pricing with no hidden fees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {commissionStructure.map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-red-600 mb-4">
                    {item.rate}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.type}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <div className="space-y-1">
                    {item.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="text-sm text-gray-500">
                        • {example}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Commission Covers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Commission Covers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive services included in our commission fee
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatCommissionCovers.map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Payment Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Commission Calculator
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                See exactly how much commission you'll pay for any transaction amount.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Amount (RWF)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter amount"
                    defaultValue="10000000"
                  />
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Commission (30%):</span>
                    <span className="text-2xl font-bold text-red-600">RWF 3,000,000</span>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">You Receive:</span>
                    <span className="text-2xl font-bold text-gray-900">RWF 7,000,000</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Payment Terms
              </h2>
              <div className="space-y-4">
                {paymentTerms.map((term, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{term.title}</h4>
                      <p className="text-gray-600">{term.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agreement Terms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Commission Agreement Terms
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Important terms and conditions for all transactions
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Commission Agreement</h3>
                <p className="text-gray-600 mb-6">
                  By using IkazeProperty.rw services, you agree to pay a 30% commission on all successful transactions. 
                  This agreement is automatically accepted when you list an item or express interest in a listing.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Payment Obligations</h3>
                <p className="text-gray-600 mb-6">
                  Commission is automatically deducted from the transaction amount before payout to the seller. 
                  Buyers are not required to pay commission directly.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Service Guarantee</h3>
                <p className="text-gray-600 mb-6">
                  Our commission includes all mediation services, legal support, and dispute resolution. 
                  If a transaction fails due to platform issues, no commission is charged.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Refund Policy</h3>
                <p className="text-gray-600 mb-6">
                  Commission is non-refundable once services have been rendered and the transaction is successfully completed.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Tax Compliance</h3>
                <p className="text-gray-600">
                  All commission payments are compliant with Rwandan tax regulations. 
                  Sellers are responsible for their own tax obligations on transaction proceeds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calculator className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Join thousands of satisfied users who trust our secure platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-listing">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                List Your Property
              </Button>
            </Link>
            <Link href="/listings">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                Browse Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
