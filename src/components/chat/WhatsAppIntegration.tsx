'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Phone, Send, X, Check, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
  phoneNumber = '+250788123456', 
  businessName = 'IkazeProperty.rw',
  isOpen: controlledIsOpen,
  onToggle 
}: WhatsAppIntegrationProps) {
  const [isInternalOpen, setIsInternalOpen] = useState(false)
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: '1',
      text: '👋 Welcome to IkazeProperty.rw! How can we help you today?',
      sender: 'business',
      timestamp: new Date(),
      status: 'delivered'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

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
    
    if (lowerMessage.includes('property') || lowerMessage.includes('house') || lowerMessage.includes('land')) {
      return 'I can help you find the perfect property! Visit our website at ikazeproperty.rw to browse our listings, or tell me what type of property you\'re looking for and I\'ll assist you.'
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('commission')) {
      return 'Our commission is 30% on successful transactions. This includes admin mediation, legal support, and dispute resolution. No upfront costs!'
    }
    
    if (lowerMessage.includes('verify') || lowerMessage.includes('account')) {
      return 'Account verification takes 1-2 business days. You\'ll need a valid ID and proof of address. Visit our website to start the verification process.'
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('office')) {
      return 'You can reach us at: 📞 +250 788 123 456 📧 support@ikazeproperty.rw 📍 KN 123 St, Kiyovu, Kigali'
    }
    
    return 'Thank you for your message! For detailed assistance, please visit our website at ikazeproperty.rw or call us at +250 788 123 456. Our team is ready to help you!'
  }

  const openWhatsAppWeb = () => {
    const message = encodeURIComponent('Hello! I need help with IkazeProperty.rw services.')
    window.open(`https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${message}`, '_blank')
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
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
