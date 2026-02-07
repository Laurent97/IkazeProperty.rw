'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
      text: '👋 Hello! I\'m your AI assistant for IkazeProperty.rw. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! How can I assist you with your property needs today?'
    }
    
    // Property listing questions
    if (lowerMessage.includes('list') || lowerMessage.includes('sell') || lowerMessage.includes('post')) {
      return 'To list a property, you\'ll need to: 1) Create a verified account 2) Click "List Property" 3) Upload photos and details 4) Set your price 5) Submit for review. The process takes about 10 minutes!'
    }
    
    // Commission questions
    if (lowerMessage.includes('commission') || lowerMessage.includes('fee') || lowerMessage.includes('cost')) {
      return 'We charge a 30% commission on successful transactions. This includes admin mediation, legal support, and dispute resolution services. No upfront costs!'
    }
    
    // Safety questions
    if (lowerMessage.includes('safe') || lowerMessage.includes('security') || lowerMessage.includes('fraud')) {
      return 'Your safety is our priority! We verify all users, mediate all transactions, and have 24/7 support. Never share payment details outside our platform and always use our mediation service.'
    }
    
    // Verification questions
    if (lowerMessage.includes('verify') || lowerMessage.includes('verification')) {
      return 'Account verification takes 1-2 business days. You\'ll need a valid ID and proof of address. Property listings require additional ownership documents.'
    }
    
    // Transaction questions
    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('transaction')) {
      return 'To make a purchase: 1) Browse listings 2) Click "Express Interest" 3) Our admin team will mediate 4) Complete payment through our secure system 5) Receive your item/service!'
    }
    
    // Contact questions
    if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return 'You can reach our support team via: 📞 Phone: +250 788 123 456 📧 Email: support@ikazeproperty.rw 💬 Live chat on our website. We\'re here 24/7 for emergencies!'
    }
    
    // Default response
    return 'I can help you with: • Property listings • Transaction process • Safety information • Account verification • Commission details • Contact support. What would you like to know more about?'
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
          <div className="flex items-center">
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
