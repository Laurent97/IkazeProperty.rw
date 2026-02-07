import { Shield, Users, TrendingUp, Award, MapPin, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Every transaction is mediated by our admin team to ensure safety and security for all parties.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a trusted marketplace where Rwandans can buy and sell with confidence.'
    },
    {
      icon: TrendingUp,
      title: 'Growth & Opportunity',
      description: 'Creating economic opportunities and facilitating property transactions across Rwanda.'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Verified listings and trusted sellers to ensure the best experience for our users.'
    }
  ]

  const stats = [
    { number: '4,678+', label: 'Active Listings' },
    { number: '12,456+', label: 'Verified Users' },
    { number: '3,234+', label: 'Successful Transactions' },
    { number: '98.5%', label: 'Trust Score' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About IkazeProperty.rw
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Rwanda's most trusted marketplace platform, connecting buyers and sellers through secure, admin-mediated transactions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To create a secure and trustworthy marketplace where Rwandans can buy and sell properties, vehicles, and valuable items with confidence. We bridge the gap between buyers and sellers through professional mediation and transparent processes.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Unlike traditional marketplaces, we ensure every transaction is overseen by our admin team, providing an extra layer of security and peace of mind for all parties involved.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-gray-700">Based in Kigali, Rwanda</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-gray-700">Serving all of Rwanda</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We're Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              What sets IkazeProperty.rw apart from other marketplaces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Admin-Mediated Transactions
              </h3>
              <p className="text-gray-600">
                Every transaction is reviewed and facilitated by our professional admin team to ensure security and fairness.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                30% Commission Model
              </h3>
              <p className="text-gray-600">
                Our transparent commission structure ensures we're invested in making every transaction successful.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Local Focus
              </h3>
              <p className="text-gray-600">
                Built specifically for the Rwandan market, understanding local needs and regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Become part of Rwanda's most trusted marketplace platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
