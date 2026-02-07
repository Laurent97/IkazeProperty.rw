import { Shield, Users, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function DisputeResolutionPage() {
  const steps = [
    {
      icon: AlertTriangle,
      title: 'Initiate Dispute',
      description: 'Contact our support team within 7 days of the transaction issue.',
      timeline: 'Day 1'
    },
    {
      icon: Users,
      title: 'Mediation Process',
      description: 'Our admin team will mediate between both parties to find a resolution.',
      timeline: 'Days 2-5'
    },
    {
      icon: FileText,
      title: 'Evidence Review',
      description: 'Both parties submit evidence and documentation for review.',
      timeline: 'Days 6-10'
    },
    {
      icon: CheckCircle,
      title: 'Resolution',
      description: 'Final decision is made and implemented by our admin team.',
      timeline: 'Days 11-14'
    }
  ]

  const disputeTypes = [
    {
      title: 'Property Misrepresentation',
      description: 'When property details don\'t match the listing description.',
      examples: ['False information about property size', 'Hidden defects not disclosed', 'Incorrect location details']
    },
    {
      title: 'Payment Issues',
      description: 'Disputes related to payment processing and refunds.',
      examples: ['Payment processing delays', 'Refund requests', 'Commission disputes']
    },
    {
      title: 'Transaction Breach',
      description: 'When one party fails to fulfill their obligations.',
      examples: ['Seller backing out after agreement', 'Buyer failing to complete payment', 'Document forgery']
    },
    {
      title: 'Service Quality',
      description: 'Issues with the quality of service provided.',
      examples: ['Poor communication', 'Delayed responses', 'Unprofessional conduct']
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Dispute Resolution
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Fair, transparent, and efficient dispute resolution process to protect all parties
            </p>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Dispute Resolution Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A structured 4-step process to ensure fair resolution for all disputes
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
                        {step.timeline}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Types of Disputes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Types of Disputes We Handle
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Common issues that fall under our dispute resolution process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {disputeTypes.map((type, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {type.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Examples:</h4>
                    <ul className="space-y-1">
                      {type.examples.map((example, exampleIndex) => (
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

      {/* Guidelines */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Dispute Resolution Guidelines
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Act Quickly</h4>
                    <p className="text-gray-600">Report disputes within 7 days of the incident</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Provide Evidence</h4>
                    <p className="text-gray-600">Submit all relevant documentation and proof</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Be Cooperative</h4>
                    <p className="text-gray-600">Respond promptly to our admin team's requests</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Follow Process</h4>
                    <p className="text-gray-600">Adhere to the established resolution timeline</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What We Need From You
              </h2>
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FileText className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Transaction details and reference number</span>
                    </li>
                    <li className="flex items-start">
                      <FileText className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Clear description of the dispute</span>
                    </li>
                    <li className="flex items-start">
                      <FileText className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Supporting evidence (photos, documents, messages)</span>
                    </li>
                    <li className="flex items-start">
                      <FileText className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Contact information for all parties involved</span>
                    </li>
                    <li className="flex items-start">
                      <FileText className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Desired resolution outcome</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-red-600 text-white">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Need to File a Dispute?
              </h2>
              <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                Our support team is ready to help you resolve any issues fairly and efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:disputes@ikazeproperty.rw"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Email Disputes Team
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
