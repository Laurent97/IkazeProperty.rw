'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const faqCategories = [
    {
      name: 'Getting Started',
      icon: HelpCircle,
      color: 'bg-blue-500',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click "Sign Up" in the top right corner, fill in your details, and verify your email address. The process takes less than 2 minutes.'
        },
        {
          question: 'What documents do I need for verification?',
          answer: 'You\'ll need a valid ID card (national ID or passport), proof of address, and for property listings, ownership documents.'
        },
        {
          question: 'How long does account verification take?',
          answer: 'Account verification typically takes 1-2 business days. You\'ll receive an email once your account is verified.'
        },
        {
          question: 'Can I use the platform without verification?',
          answer: 'You can browse listings, but you need verification to list items, express interest, or complete transactions.'
        }
      ]
    },
    {
      name: 'Transactions',
      icon: MessageCircle,
      color: 'bg-green-500',
      questions: [
        {
          question: 'How does the transaction process work?',
          answer: '1) Browse and find what you like 2) Express interest 3) Our admin team mediates 4) Complete transaction with our secure payment system.'
        },
        {
          question: 'What is the commission fee?',
          answer: 'We charge a 30% commission on successful transactions. This includes mediation, legal support, and dispute resolution services.'
        },
        {
          question: 'How do I pay for a transaction?',
          answer: 'Payments are processed through our secure payment system. We accept bank transfers, mobile money, and other local payment methods.'
        },
        {
          question: 'When do I receive my money as a seller?',
          answer: 'After successful completion of the transaction and any applicable holding period, funds are typically released within 3-5 business days.'
        },
        {
          question: 'Can I cancel a transaction?',
          answer: 'Yes, transactions can be cancelled before completion. Cancellation fees may apply if admin services have been rendered.'
        }
      ]
    },
    {
      name: 'Property Listings',
      icon: HelpCircle,
      color: 'bg-purple-500',
      questions: [
        {
          question: 'How do I list a property?',
          answer: 'Go to your dashboard, click "List Property," upload photos, provide details, set your price, and submit for review.'
        },
        {
          question: 'What information is required for a property listing?',
          answer: 'Property type, location, size, price, photos, description, ownership documents, and your contact information.'
        },
        {
          question: 'How many photos can I upload?',
          answer: 'You can upload up to 20 high-quality photos. We recommend including exterior, interior, and key features.'
        },
        {
          question: 'How long does it take for a listing to be approved?',
          answer: 'Listings are typically reviewed and approved within 24-48 hours, provided all required information is complete.'
        },
        {
          question: 'Can I edit my listing after it\'s published?',
          answer: 'Yes, you can edit your listing anytime from your dashboard. Changes may require re-approval.'
        }
      ]
    },
    {
      name: 'Safety & Security',
      icon: MessageCircle,
      color: 'bg-red-500',
      questions: [
        {
          question: 'How do you verify users?',
          answer: 'We verify identity through government-issued IDs, address proof, and additional screening for high-value transactions.'
        },
        {
          question: 'What should I do if I suspect fraud?',
          answer: 'Immediately stop communication, report to our admin team, and provide all relevant evidence. We have a 24/7 emergency line.'
        },
        {
          question: 'Is my personal information safe?',
          answer: 'Yes, we use industry-standard encryption, never share your data without consent, and comply with data protection laws.'
        },
        {
          question: 'Should I meet buyers/sellers in person?',
          answer: 'Initial communication should be through our platform. If meeting is necessary, choose public places and bring someone with you.'
        }
      ]
    },
    {
      name: 'Technical Support',
      icon: HelpCircle,
      color: 'bg-yellow-500',
      questions: [
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your email.'
        },
        {
          question: 'Why can\'t I upload photos?',
          answer: 'Check file size (max 5MB per photo), format (JPG/PNG), and ensure you have a stable internet connection.'
        },
        {
          question: 'The app is running slowly. What should I do?',
          answer: 'Try clearing your browser cache, checking your internet connection, or using a different browser.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your dashboard, click "Profile," edit your information, and save changes. Some changes may require re-verification.'
        }
      ]
    }
  ]

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Find answers to common questions about using IkazeProperty.rw
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                Found {filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0)} results
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 mb-4">
                Try searching with different keywords or browse our categories below.
              </p>
              <Button 
                onClick={() => setSearchQuery('')}
                className="bg-red-600 hover:bg-red-700"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category, categoryIndex) => {
                const Icon = category.icon
                return (
                  <div key={categoryIndex}>
                    <div className="flex items-center mb-6">
                      <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center mr-3`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {category.name}
                      </h2>
                    </div>
                    
                    <div className="space-y-4">
                      {category.questions.map((faq, faqIndex) => {
                        const globalIndex = categoryIndex * 100 + faqIndex
                        const isExpanded = expandedItems.includes(globalIndex)
                        
                        return (
                          <Card key={globalIndex}>
                            <CardHeader 
                              className="cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleExpanded(globalIndex)}
                            >
                              <CardTitle className="flex items-center justify-between text-lg">
                                <span className="text-gray-900">{faq.question}</span>
                                {isExpanded ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                              </CardTitle>
                            </CardHeader>
                            {isExpanded && (
                              <CardContent>
                                <p className="text-gray-600">{faq.answer}</p>
                              </CardContent>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-red-600 text-white">
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Still Need Help?
              </h2>
              <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Phone className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Phone Support</h3>
                  <p className="text-sm text-red-100">+250 788 123 456</p>
                </div>
                <div className="text-center">
                  <Mail className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Email Support</h3>
                  <p className="text-sm text-red-100">support@ikazeproperty.rw</p>
                </div>
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-sm text-red-100">Available on website</p>
                </div>
              </div>
              <div className="mt-6">
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                  Contact Support Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
