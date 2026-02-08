'use client'

import { Phone, Mail, Shield, AlertTriangle, FileText, CheckCircle, Users, Eye, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminContactInfo from '@/components/listing/admin-contact'
import { Button } from '@/components/ui/button'

export default function SafetyPage() {
  const safetyTips = [
    {
      icon: Shield,
      title: 'Verify Before You Trust',
      description: 'Always verify user identities and property details before proceeding with transactions.',
      tips: [
        'Check user verification status',
        'Review transaction history',
        'Verify property documents',
        'Meet in safe locations'
      ]
    },
    {
      icon: Lock,
      title: 'Protect Your Information',
      description: 'Keep your personal and financial information secure throughout the transaction process.',
      tips: [
        'Never share passwords',
        'Use secure payment methods',
        'Be cautious with personal data',
        'Report suspicious requests'
      ]
    },
    {
      icon: Users,
      title: 'Use Our Mediation',
      description: 'Let our admin team handle all communications and negotiations for your safety.',
      tips: [
        'Avoid direct contact initially',
        'Use platform messaging',
        'Let admins mediate disputes',
        'Follow platform guidelines'
      ]
    },
    {
      icon: Eye,
      title: 'Stay Vigilant',
      description: 'Be aware of common scams and warning signs of fraudulent activities.',
      tips: [
        'Watch for unrealistic prices',
        'Beware of urgency tactics',
        'Check for grammar errors',
        'Trust your instincts'
      ]
    }
  ]

  const warningSigns = [
    {
      title: 'Too Good to Be True',
      description: 'Prices significantly below market value or deals that seem unusually favorable'
    },
    {
      title: 'Urgency Pressure',
      description: 'Requests for immediate action or payment without proper verification'
    },
    {
      title: 'Poor Communication',
      description: 'Vague responses, grammar errors, or refusal to provide proper documentation'
    },
    {
      title: 'Payment Red Flags',
      description: 'Requests for wire transfers, gift cards, or unusual payment methods'
    },
    {
      title: 'Identity Issues',
      description: 'Refusal to verify identity or provide legitimate contact information'
    },
    {
      title: 'Platform Bypass',
      description: 'Attempts to move conversations outside our platform for direct dealings'
    }
  ]

  const emergencySteps = [
    {
      step: '1',
      title: 'Stop Communication',
      description: 'Immediately cease all communication with the suspicious party'
    },
    {
      step: '2',
      title: 'Report to Admin',
      description: 'Contact our admin team with all relevant information and evidence'
    },
    {
      step: '3',
      title: 'Secure Accounts',
      description: 'Change passwords and review account security settings'
    },
    {
      step: '4',
      title: 'Document Everything',
      description: 'Save all communications, screenshots, and transaction details'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Safety Center
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Your safety is our priority. Learn how to protect yourself while using our platform.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Essential Safety Tips
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these guidelines to ensure safe and secure transactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyTips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <Icon className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {tip.tips.map((tipItem, tipIndex) => (
                        <div key={tipIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          {tipItem}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Warning Signs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Red Flags & Warning Signs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Be aware of these common warning signs of potential scams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warningSigns.map((warning, index) => (
              <Card key={index} className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {warning.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {warning.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Procedures */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Emergency Procedures
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              What to do if you encounter suspicious activity or fraud
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencySteps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Report Safety Issues
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                If you encounter any safety concerns or suspicious activity, report them immediately.
              </p>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Emergency Hotline</h4>
                        <AdminContactInfo className="text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Report Form</h4>
                        <p className="text-gray-600">Submit detailed reports online</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Additional Resources
              </h2>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Rwanda Police Cyber Crime Unit
                  </h3>
                  <p className="text-gray-600 mb-4">
                    For serious cyber crimes and fraud cases, contact the Rwanda National Police.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Phone:</strong> 111 (Toll-free)</p>
                    <p><strong>Email:</strong> cybercrime@police.gov.rw</p>
                    <p><strong>Website:</strong> www.police.gov.rw</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Safe, Trade Smart
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Your safety is our responsibility. Together we can create a trusted marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              Browse Safely
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              Report Issue
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
