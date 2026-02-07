import { Shield, Eye, Lock, Database, UserCheck, FileText, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
  const principles = [
    {
      icon: Shield,
      title: 'Data Protection',
      description: 'We implement industry-standard security measures to protect your personal information.'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'We are transparent about what data we collect and how we use it.'
    },
    {
      icon: Lock,
      title: 'Control',
      description: 'You have control over your personal data and can update or delete it at any time.'
    },
    {
      icon: UserCheck,
      title: 'Consent',
      description: 'We only collect and use data with your explicit consent.'
    }
  ]

  const dataCategories = [
    {
      title: 'Personal Information',
      description: 'Information that identifies you personally',
      examples: ['Full name', 'Email address', 'Phone number', 'Physical address']
    },
    {
      title: 'Transaction Data',
      description: 'Information related to your transactions',
      examples: ['Property listings', 'Purchase history', 'Payment information', 'Communication records']
    },
    {
      title: 'Usage Data',
      description: 'Information about how you use our platform',
      examples: ['Login history', 'Page views', 'Search queries', 'Interaction data']
    },
    {
      title: 'Technical Data',
      description: 'Technical information for platform functionality',
      examples: ['IP address', 'Browser type', 'Device information', 'Cookies']
    }
  ]

  const yourRights = [
    {
      title: 'Access',
      description: 'Request a copy of your personal data'
    },
    {
      title: 'Correction',
      description: 'Update inaccurate or incomplete data'
    },
    {
      title: 'Deletion',
      description: 'Request deletion of your personal data'
    },
    {
      title: 'Portability',
      description: 'Request transfer of your data to another service'
    },
    {
      title: 'Objection',
      description: 'Object to processing of your personal data'
    },
    {
      title: 'Restriction',
      description: 'Limit how we process your personal data'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Privacy Principles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Core principles that guide how we handle your personal information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Data We Collect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Categories of personal information we collect and why
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dataCategories.map((category, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Examples:</h4>
                    <ul className="space-y-1">
                      {category.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How We Use Data */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                How We Use Your Data
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Database className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Service Provision</h4>
                    <p className="text-gray-600">To provide and maintain our marketplace services</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <UserCheck className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Identity Verification</h4>
                    <p className="text-gray-600">To verify user identities and prevent fraud</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Security</h4>
                    <p className="text-gray-600">To protect our platform and users from security threats</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Legal Compliance</h4>
                    <p className="text-gray-600">To comply with legal obligations and regulations</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Data Sharing & Third Parties
              </h2>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    We only share data when necessary:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">With transaction parties (with consent)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">With payment processors for transactions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">With legal authorities when required</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">With service providers who help operate our platform</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Data Rights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You have control over your personal information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yourRights.map((right, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {right.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {right.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-red-600 text-white">
            <CardContent className="p-8 text-center">
              <Lock className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                Our privacy team is here to help with any questions about your personal data and privacy rights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:privacy@ikazeproperty.rw"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Email Privacy Team
                </a>
                <a
                  href="/customer-service"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
