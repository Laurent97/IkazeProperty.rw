'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User, Maximize2, Minimize2, BookOpen, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePaymentContext } from '@/contexts/PaymentContext'
import { Card, CardContent } from '@/components/ui/card'
import { customerGuidanceFlows, getGuidanceFlow, searchGuidanceFlows } from '@/lib/chat/customer-guidance'

// Utility function to generate stable IDs
const generateStableId = (() => {
  let counter = 0
  return () => `bot_msg_${counter++}`
})()

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatBotProps {
  isOpen?: boolean
  onToggle?: () => void
}

export default function ChatBot({ isOpen: controlledIsOpen, onToggle }: ChatBotProps) {
  const [isInternalOpen, setIsInternalOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🤖 Welcome to IkazeProperty.rw! I\'m your comprehensive AI assistant. I can explain everything about our platform and guide you through any process. Ask me about listings, payments, promotions, safety, or anything else!',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { getPlatformInfo } = usePaymentContext()
  const platformInfo = getPlatformInfo()

  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : isInternalOpen
  const toggleChat = isControlled ? onToggle : () => setIsInternalOpen(!isInternalOpen)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Check for guidance flow requests
    if (lowerMessage.includes('guide') || lowerMessage.includes('step by step') || lowerMessage.includes('walkthrough')) {
      const flows = searchGuidanceFlows(lowerMessage)
      if (flows.length > 0) {
        const flow = flows[0]
        return `📚 **${flow.title}**\n\n${flow.description}\n\n**Estimated time:** ${flow.estimatedTime}\n**Prerequisites:** ${flow.prerequisites.join(', ')}\n\n**Step 1: ${flow.steps[0].title}\n${flow.steps[0].description}\n\n${flow.steps[0].tips ? '💡 **Tips:** ' + flow.steps[0].tips.join(' • ') : ''}\n\nType "next" to continue or "help" for more guidance flows!`
      }
    }
    
    // Help command
    if (lowerMessage.includes('help') || lowerMessage.includes('flows') || lowerMessage.includes('guides')) {
      return '🤖 **Available Guidance Flows:**\n\n🏠 **First-Time Seller Guide** - Complete selling process\n🛒 **First-Time Buyer Guide** - Safe purchasing steps\n💳 **Payment Issues & Solutions** - Troubleshooting help\n🔒 **Safety & Security Guide** - Essential safety tips\n✅ **Account & Listing Verification** - Verification process\n\nType "guide [topic]" to start any flow (e.g., "guide seller" or "guide safety")'
    }
    
    // Next step in guidance
    if (lowerMessage === 'next' || lowerMessage.includes('continue')) {
      return '📖 To continue with a guidance flow, please specify which flow you\'re in (e.g., "next seller" or "continue buyer"). Or type "help" to see all available flows and start fresh!'
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return '👋 Welcome to IkazeProperty.rw! I\'m your AI assistant. I can help you with:\n• Property listings and searches\n• Buying and selling process\n• Account verification\n• Commission and payments\n• Safety guidelines\n• Technical support\n\nWhat would you like to know today?'
    }
    
    // Property listing questions
    if (lowerMessage.includes('list') || lowerMessage.includes('sell') || lowerMessage.includes('post')) {
      return '📝 **How to List a Property:**\n\n1️⃣ **Create Account**: Sign up and verify your identity\n2️⃣ **Click "List Item"**: Found in the header menu\n3️⃣ **Choose Category**: Houses, Cars, Land, or Other Items\n4️⃣ **Upload Details**: Add photos, description, price\n5️⃣ **Set Price**: Choose your asking price\n6️⃣ **Submit Review**: Our team reviews within 24 hours\n\n⏱️ *Process takes about 10 minutes*\n📸 *Add at least 3 clear photos for better visibility*'
    }
    
    // Buying process
    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('interested')) {
      return '🛒 **How to Buy on IkazeProperty.rw:**\n\n1️⃣ **Browse Listings**: Use search or categories\n2️⃣ **Click "Express Interest"**: On any listing you like\n3️⃣ **Admin Mediation**: Our team contacts both parties\n4️⃣ **Secure Payment**: Pay through our platform (30% commission)\n5️⃣ **Receive Item**: After successful transaction\n\n🔒 *All transactions are mediated for your safety*\n💳 *Payment only through our secure system*'
    }
    
    // Commission questions
    if (lowerMessage.includes('commission') || lowerMessage.includes('fee') || lowerMessage.includes('cost')) {
      return '💰 **Commission & Fees:**\n\n• **30% Commission** on successful transactions\n• **No upfront costs** - you only pay when you sell\n• **Includes**: Admin mediation, legal support, dispute resolution\n• **Payment**: Deducted automatically from transaction\n\n📞 *Need help with pricing? Contact our support team!*'
    }
    
    // Safety questions
    if (lowerMessage.includes('safe') || lowerMessage.includes('security') || lowerMessage.includes('fraud') || lowerMessage.includes('scam')) {
      return '🔒 Your safety is our #1 priority! We protect you with: • User identity verification • Admin-mediated all transactions • Encrypted payment processing • 24/7 monitoring • Dispute resolution support • NEVER share payment details outside platform • Always use our secure payment system • Report suspicious activity immediately. Your transactions are insured!'
    }
    
    // Promotion packages
    if (lowerMessage.includes('promote') || lowerMessage.includes('advertise') || lowerMessage.includes('featured')) {
      return '🚀 Boost your listing visibility with our promotion packages: 🔴 **Urgent Badge** (5,000 RWF - 14 days) - Red badge + priority ranking ⭐ **Featured Placement** (15,000 RWF - 7 days) - Top placement + 30% more views 👑 **Premium Package** (25,000 RWF - 10 days) - All features + WhatsApp broadcast + social media mention + priority support!'
    }
    
    // Verification process
    if (lowerMessage.includes('verify') || lowerMessage.includes('verification') || lowerMessage.includes('approved')) {
      return '✅ Account verification ensures trust and security: **Standard Verification** (1-2 business days): • Valid national ID • Proof of address (utility bill) **Property Listing Verification**: Additional ownership documents required • Title deed • Sale agreement • Tax clearance. Verification prevents fraud and builds buyer confidence!'
    }
    
    // Transaction process
    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('transaction')) {
      return '🛒 Secure buying process: 1) Browse listings with advanced filters 2) Click "Express Interest" on desired item 3) Our admin team contacts seller 4) Payment through our secure system 5) Admin mediates transfer/inspection 6) You receive item/service! All transactions are protected and monitored. No direct payments to sellers!'
    }
    
    // Technical support
    if (lowerMessage.includes('error') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('bug')) {
      return '🔧 Technical support available! Common fixes: • Clear browser cache and cookies • Update browser to latest version • Check internet connection • Disable VPN/Proxy • Try different browser. If issues persist: 📞 Call support 📧 Email technical team 📱 Live chat here 24/7. Describe your issue with screenshots for faster resolution!'
    }
    
    // Categories explanation
    if (lowerMessage.includes('categories') || lowerMessage.includes('types') || lowerMessage.includes('what can i')) {
      return '📋 We offer 4 main categories: 🏠 **Houses** - Residential, commercial, rental properties 🚗 **Cars** - New/used vehicles, all makes/models 🏞️ **Land** - Residential, commercial, agricultural land 📦 **Other** - Electronics, furniture, services, more. Each category has specific listing requirements and target audiences!'
    }
    
    // Mobile app
    if (lowerMessage.includes('mobile') || lowerMessage.includes('app') || lowerMessage.includes('phone')) {
      return '📱 Mobile app coming soon! Currently use our responsive website on any device. Features planned: • Push notifications • Location-based search • Instant messaging • Mobile payments • Offline mode. Sign up for our newsletter to get notified when the app launches!'
    }
    
    // Contact and support
    if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('call')) {
      return `📞 Multiple support channels available: • **24/7 AI Chat** (that's me!) • **Phone**: ${platformInfo.phone} • **Email**: ${platformInfo.email} • **Office**: ${platformInfo.address} • **WhatsApp**: Click the green WhatsApp button • **Emergency**: Available 24/7 for urgent issues. Response times: Chat - Instant, Email - 2-4 hours, Phone - Immediate during business hours!`
    }
    
    // Account issues
    if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('password') || lowerMessage.includes('register')) {
      return '👤 Account management: **Registration**: Email/phone verification required **Login**: Email + password or social login **Password Reset**: Click "Forgot Password" link **Account Types**: User (buyer/seller), Agent (professional), Admin (platform management). Keep your login details secure and enable 2FA when available!'
    }
    
    // Search functionality
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('filter')) {
      return '🔍 Advanced search capabilities: • **Location**: Province, district, sector • **Price range**: Min/max filters • **Category**: Houses, Cars, Land, Other • **Features**: Bedrooms, bathrooms, car specs • **Keywords**: Search titles and descriptions • **Sort**: Price, date, popularity • **Saved searches**: Get alerts for new listings. Use multiple filters for precise results!'
    }
    
    // Notifications
    if (lowerMessage.includes('notification') || lowerMessage.includes('alert') || lowerMessage.includes('updates')) {
      return '🔔 Stay updated with multi-channel notifications: • **Email**: Detailed updates and summaries • **SMS**: Important alerts and confirmations • **Push**: In-app instant notifications • **In-App**: Real-time message center. Customize your preferences in account settings. Get notified for: New matching listings, price changes, inquiry responses, payment confirmations!'
    }
    
    // Business hours
    if (lowerMessage.includes('hours') || lowerMessage.includes('time') || lowerMessage.includes('when')) {
      return '🕐 Business hours and availability: • **AI Chat** (me): 24/7 instant support • **Phone Support**: Mon-Fri 8AM-6PM, Sat 9AM-4PM • **Email Support**: 24/7 (2-4 hour response) • **Emergency Issues**: 24/7 hotline available • **Admin Mediation**: Business hours only. All automated systems (payments, listings) work 24/7!'
    }
    
    // Default comprehensive response
    return '🤖 I\'m your comprehensive IkazeProperty.rw assistant! I can help you with: 🏠 **Property/vehicle listings** - How to sell, requirements, process 💳 **Payments** - All 5 methods explained 🚀 **Promotions** - Boost your visibility 🔒 **Safety** - Secure transactions explained ✅ **Verification** - Account and listing verification 📞 **Support** - Contact options and hours 🔍 **Search** - Find exactly what you need 📱 **Account** - Management and troubleshooting. What specific topic would you like detailed help with?'
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: generateStableId(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate bot thinking time
    await new Promise(resolve => setTimeout(resolve, 1000))

    const botResponse: Message = {
      id: generateStableId(),
      text: generateBotResponse(inputText),
      sender: 'bot',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botResponse])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="ml-2">Chat with AI</span>
      </Button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80' : 'w-96'
    }`}>
      <Card className="shadow-2xl">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="h-5 w-5 mr-2" />
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-red-100">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-red-700 p-1"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              className="text-white hover:bg-red-700 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="p-4 h-96 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-xs ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' ? 'bg-red-600 ml-2' : 'bg-gray-200 mr-2'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className={`rounded-lg p-3 ${
                          message.sender === 'user' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${
                          message.sender === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-xs">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputText('help')}
                  className="text-xs"
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Help
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputText('guide seller')}
                  className="text-xs"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Seller Guide
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputText('guide buyer')}
                  className="text-xs"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Buyer Guide
                </Button>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-red-600 hover:bg-red-700 text-white p-2"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by AI • Available 24/7
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
