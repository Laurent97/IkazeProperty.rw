import { FileText, Shield, Users, AlertTriangle, CheckCircle, Gavel } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function TermsOfServicePage() {
  const keyTerms = [
    {
      icon: Users,
      title: 'User Accounts',
      description: 'Account creation, responsibilities, and security requirements'
    },
    {
      icon: Shield,
      title: 'Platform Use',
      description: 'Acceptable use and prohibited activities on our platform'
    },
    {
      icon: Gavel,
      title: 'Transactions',
      description: 'Rules governing transactions and commission payments'
    },
    {
      icon: AlertTriangle,
      title: 'Liabilities',
      description: 'Limitation of liability and disclaimer of warranties'
    }
  ]

  const userResponsibilities = [
    {
      title: 'Accurate Information',
      description: 'Provide truthful and complete information in your profile and listings'
    },
    {
      title: 'Legal Compliance',
      description: 'Comply with all applicable laws and regulations'
    },
    {
      title: 'Account Security',
      description: 'Maintain the security of your account credentials'
    },
    {
      title: 'Professional Conduct',
      description: 'Interact professionally with other users and our staff'
    },
    {
      title: 'Payment Obligations',
      description: 'Pay commission fees for successful transactions'
    },
    {
      title: 'No Misrepresentation',
      description: 'Avoid false or misleading information in listings'
    }
  ]

  const prohibitedActivities = [
    {
      title: 'Fraudulent Activities',
      description: 'Any form of fraud, scam, or deceptive practices'
    },
    {
      title: 'Illegal Items',
      description: 'Listing illegal or prohibited items and services'
    },
    {
      title: 'Spam and Harassment',
      description: 'Sending unsolicited messages or harassing other users'
    },
    {
      title: 'System Interference',
      description: 'Attempting to disrupt or damage our platform systems'
    },
    {
      title: 'Circumvention',
      description: 'Attempting to avoid commission payments or platform fees'
    },
    {
      title: 'Multiple Accounts',
      description: 'Creating multiple accounts without proper authorization'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              By using IkazeProperty.rw, you agree to these terms and conditions
            </p>
          </div>
        </div>
      </section>

      {/* Agreement Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Terms & Conditions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Important aspects of our service agreement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyTerms.map((term, index) => {
              const Icon = term.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {term.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {term.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* User Responsibilities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                User Responsibilities
              </h2>
              <div className="space-y-4">
                {userResponsibilities.map((responsibility, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{responsibility.title}</h4>
                      <p className="text-gray-600">{responsibility.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Prohibited Activities
              </h2>
              <div className="space-y-4">
                {prohibitedActivities.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      <p className="text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction Terms */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transaction Terms
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Rules governing all transactions on our platform
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Commission Agreement</h3>
                <p className="text-gray-600 mb-6">
                  All successful transactions are subject to a 30% commission fee. This fee is automatically deducted 
                  from the transaction amount before payout to the seller.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Payment Processing</h3>
                <p className="text-gray-600 mb-6">
                  All payments are processed through our secure payment system. We act as an intermediary to ensure 
                  secure transactions between buyers and sellers.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Dispute Resolution</h3>
                <p className="text-gray-600 mb-6">
                  All disputes are handled through our admin mediation process. Users agree to abide by the decisions 
                  made by our dispute resolution team.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Refund Policy</h3>
                <p className="text-gray-600 mb-6">
                  Refunds are handled on a case-by-case basis and are subject to our dispute resolution process. 
                  Commission fees are non-refundable once services have been rendered.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Transaction Cancellation</h3>
                <p className="text-gray-600">
                  Transactions can be cancelled before completion, but may be subject to cancellation fees if 
                  services have already been rendered by our admin team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Intellectual Property */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Intellectual Property
              </h2>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Content</h3>
                  <p className="text-gray-600 mb-4">
                    All content on IkazeProperty.rw, including logos, text, graphics, and software, 
                    is owned by IkazeProperty.rw and protected by copyright laws.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Content</h3>
                  <p className="text-gray-600 mb-4">
                    Users retain ownership of content they upload but grant IkazeProperty.rw a license 
                    to use, display, and distribute such content for platform operations.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900">Prohibited Use</h3>
                  <p className="text-gray-600">
                    Users may not copy, modify, distribute, or create derivative works of our platform 
                    content without explicit permission.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Limitation of Liability
              </h2>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Availability</h3>
                  <p className="text-gray-600 mb-4">
                    We strive to maintain high service availability but cannot guarantee uninterrupted service. 
                    We are not liable for temporary service disruptions.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Third-Party Content</h3>
                  <p className="text-gray-600 mb-4">
                    We are not responsible for the accuracy, legality, or quality of user-generated content 
                    or third-party listings.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900">Maximum Liability</h3>
                  <p className="text-gray-600">
                    Our maximum liability for any claim related to our service is limited to the commission 
                    fees paid for the relevant transaction.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Agreement Acceptance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-red-600 text-white">
            <CardContent className="p-8 text-center">
              <Gavel className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Agreement Acceptance
              </h2>
              <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                By creating an account, listing items, or using our platform services, you acknowledge that you have 
                read, understood, and agree to be bound by these Terms of Service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/privacy"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Read Privacy Policy
                </a>
                <a
                  href="/commission-agreement"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors"
                >
                  View Commission Agreement
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
