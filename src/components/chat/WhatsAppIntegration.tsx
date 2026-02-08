'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Phone, Send, X, Check, CheckCheck, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { usePaymentContext } from '@/contexts/PaymentContext'

// Utility function to generate stable IDs
const generateStableId = (() => {
  let counter = 0
  return () => `msg_${counter++}`
})()

interface WhatsAppMessage {
  id: string
  text: string
  sender: 'user' | 'business'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

interface WhatsAppIntegrationProps {
  phoneNumber?: string
  businessName?: string
  isOpen?: boolean
  onToggle?: () => void
}

export default function WhatsAppIntegration({ 
  phoneNumber: propPhoneNumber, 
  businessName = 'IkazeProperty.rw',
  isOpen: controlledIsOpen,
  onToggle 
}: WhatsAppIntegrationProps) {
  const [isInternalOpen, setIsInternalOpen] = useState(false)
  const [siteSettings, setSiteSettings] = useState<any>(null)
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: '1',
      text: '👋 Welcome to IkazeProperty.rw WhatsApp support! I can help you with listings, payments, verification, safety, and guide you through any process. How can I assist you today?',
      sender: 'business',
      timestamp: new Date(),
      status: 'delivered'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { getPlatformInfo } = usePaymentContext()
  const platformInfo = getPlatformInfo()

  // Use dynamic WhatsApp number from site settings or fall back to prop
  const phoneNumber = siteSettings?.whatsapp_phone || propPhoneNumber || '+250737060025'

  useEffect(() => {
    loadSiteSettings()
  }, [])

  const loadSiteSettings = async () => {
    try {
      // Try multiple possible URLs to handle different development environments
      const possibleUrls = [
        '/api/site-settings',
        'http://localhost:3000/api/site-settings',
        `${window.location.origin}/api/site-settings`
      ]
      
      let data = null
      let success = false
      
      for (const url of possibleUrls) {
        try {
          const response = await fetch(url)
          if (response.ok) {
            data = await response.json()
            if (data?.settings) {
              setSiteSettings(data.settings)
              success = true
              break
            }
          }
        } catch (err) {
          // Continue to next URL
          continue
        }
      }
      
      if (!success) {
        console.warn('Could not load site settings from any endpoint, using defaults')
      }
    } catch (err) {
      console.error('Failed to load site settings:', err)
    }
  }

  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : isInternalOpen
  const toggleChat = isControlled ? onToggle : () => setIsInternalOpen(!isInternalOpen)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: WhatsAppMessage = {
      id: generateStableId(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // Simulate message sending
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setMessages(prev => prev.map(msg => 
      msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
    ))

    await new Promise(resolve => setTimeout(resolve, 500))
    
    setMessages(prev => prev.map(msg => 
      msg.id === userMessage.id ? { ...msg, status: 'delivered' as const } : msg
    ))

    await new Promise(resolve => setTimeout(resolve, 500))
    
    setMessages(prev => prev.map(msg => 
      msg.id === userMessage.id ? { ...msg, status: 'read' as const } : msg
    ))

    // Simulate business response
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const businessResponse: WhatsAppMessage = {
      id: generateStableId(),
      text: generateBusinessResponse(inputText),
      sender: 'business',
      timestamp: new Date(),
      status: 'delivered'
    }

    setMessages(prev => [...prev, businessResponse])
    setIsTyping(false)
  }

  const generateBusinessResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Platform overview
    if (lowerMessage.includes('what is') || lowerMessage.includes('about') || lowerMessage.includes('platform')) {
      return '🏠 Welcome! IkazeProperty.rw is Rwanda\'s trusted marketplace for properties and vehicles. We offer secure transactions, admin mediation, and multiple payment options. Visit ikazeproperty.rw to explore listings or create your account!'
    }
    
    if (lowerMessage.includes('property') || lowerMessage.includes('house') || lowerMessage.includes('land') || lowerMessage.includes('car')) {
      return '🚗 Find your perfect property/vehicle on our platform! We have 4 categories: Houses, Cars, Land, and Other items. Browse at ikazeproperty.rw or tell me what you\'re looking for and I\'ll guide you! All listings are verified and transactions are secure.'
    }
    
    if (lowerMessage.includes('list') || lowerMessage.includes('sell') || lowerMessage.includes('post')) {
      return '📝 Ready to sell? 1) Create verified account at ikazeproperty.rw 2) Upload photos and details 3) Set your price 4) Choose optional promotion 5) Submit for review. Process takes ~10 minutes. Need help? Call us!'
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('commission')) {
      return '💰 Transparent pricing: 30% commission only on successful sales. No upfront costs! Includes admin mediation, legal support, and secure payments. Example: RWF 1M sale = RWF 700K to you, RWF 300K commission. Fair and secure!'
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('money')) {
      return '💳 5 secure payment methods: MTN Mobile Money, Airtel Money, Equity Bank transfers, Cryptocurrency (BTC/ETH/USDT), and Internal Wallet. All transactions are encrypted and monitored. Choose what works best for you!'
    }
    
    if (lowerMessage.includes('promote') || lowerMessage.includes('advertise') || lowerMessage.includes('featured')) {
      return '🚀 Boost your listing visibility! 🔴 Urgent Badge (5K RWF - 14 days) ⭐ Featured (15K RWF - 7 days) 👑 Premium (25K RWF - 10 days). Premium includes WhatsApp broadcast and social media mention. Get 30% more views with featured!'
    }
    
    if (lowerMessage.includes('safe') || lowerMessage.includes('security') || lowerMessage.includes('fraud') || lowerMessage.includes('scam')) {
      return '🔒 Your safety is guaranteed! We verify all users, mediate every transaction, and provide 24/7 support. NEVER pay outside our platform. All transactions are insured and monitored. Report suspicious activity immediately!'
    }
    
    if (lowerMessage.includes('verify') || lowerMessage.includes('account') || lowerMessage.includes('verification')) {
      return '✅ Secure verification process: 1-2 business days for standard accounts. Need valid ID and proof of address. Property listings require additional ownership documents. This protects everyone and builds trust!'
    }
    
    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('interested')) {
      return '🛒 Safe buying process: Browse listings → Click "Express Interest" → Our admin mediates → Secure payment → Receive item! No direct payments to sellers. Full protection and support included. Start browsing at ikazeproperty.rw!'
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('office') || lowerMessage.includes('support')) {
      return `📞 We're here to help! • Phone: ${platformInfo.phone} • Email: ${platformInfo.email} • Office: ${platformInfo.address} • Website: ikazeproperty.rw • WhatsApp: Continue here or click the WhatsApp button. Response times: Phone - Immediate, Email - 2-4 hours, WhatsApp - Instant!`
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('problem')) {
      return `🚨 Urgent support available! Call ${platformInfo.phone} for immediate assistance. For emergencies: Fraud reports, payment issues, security concerns. 24/7 emergency hotline available. Don\'t hesitate - we\'re here to help!`
    }
    
    if (lowerMessage.includes('app') || lowerMessage.includes('mobile') || lowerMessage.includes('download')) {
      return '📱 Mobile app coming soon! For now, use our responsive website on any device. Sign up at ikazeproperty.rw to get notified when the app launches. Future app will have push notifications, location search, and mobile payments!'
    }
    
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('looking for')) {
      return '🔍 Advanced search available! Filter by location, price, category, features, and keywords. Save searches for alerts. Use multiple filters for precise results. Visit ikazeproperty.rw and start searching - your perfect property awaits!'
    }
    
    if (lowerMessage.includes('hours') || lowerMessage.includes('time') || lowerMessage.includes('when')) {
      return '🕐 Available when you need us! • Website/AI: 24/7 • Phone: Mon-Fri 8AM-6PM, Sat 9AM-4PM • Email: 24/7 response • Emergency: 24/7 hotline. Automated systems work 24/7 for your convenience!'
    }
    
    return `💬 Thanks for reaching out! For detailed assistance: 🌐 Visit ikazeproperty.rw 📞 Call ${platformInfo.phone} 📧 Email ${platformInfo.email} 📱 Continue here on WhatsApp. I can help with listings, payments, verification, safety, and more. What do you need help with?`
  }

  const openWhatsAppWeb = () => {
    const message = encodeURIComponent('Hello! I need help with IkazeProperty.rw services.')
    window.open(`https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${message}`, '_blank')
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-28 right-6 z-50">
        <div className="flex flex-col items-center space-y-2">
          <Button
            onClick={openWhatsAppWeb}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg"
            size="lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <Button
            onClick={toggleChat}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg"
            size="lg"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <Card className="shadow-2xl">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">{businessName}</h3>
              <p className="text-xs text-green-100">Typically replies instantly</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={openWhatsAppWeb}
              className="fixed bottom-2 right-2 z-50 text-white hover:bg-green-700 p-2 shadow-lg"
              title="Open in WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              className="text-white hover:bg-green-700 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <CardContent className="p-4 h-96 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <div className={`flex items-center justify-end mt-1 space-x-1 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    {message.sender === 'user' && getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* Input */}
        <div className="border-t p-4 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-green-600 hover:bg-green-700 text-white p-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={openWhatsAppWeb}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Continue in WhatsApp
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
