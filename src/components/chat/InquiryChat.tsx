'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, User, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id: string
  text: string
  sender: 'admin' | 'customer'
  timestamp: Date | string | null | undefined
  senderName?: string
}

interface InquiryChatProps {
  inquiryId: string
  customerId: string
  customerName: string
  customerEmail: string
  isOpen?: boolean
  onToggle?: () => void
  userType?: 'admin' | 'customer'
}

export default function InquiryChat({ 
  inquiryId, 
  customerId, 
  customerName, 
  customerEmail, 
  isOpen: controlledIsOpen, 
  onToggle,
  userType = 'customer'
}: InquiryChatProps) {
  const { user } = useAuth()
  const [isInternalOpen, setIsInternalOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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

  useEffect(() => {
    if (isOpen && inquiryId) {
      loadMessages()
    }
  }, [isOpen, inquiryId])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      
      // Get session token for API call
      const { getSupabaseClient } = await import('@/lib/supabase-client')
      const { data, error } = await getSupabaseClient().auth.getSession()
      
      if (!data.session?.access_token) {
        console.error('No session token found')
        return
      }

      // Load chat messages for this inquiry
      const response = await fetch(`/api/inquiries/${inquiryId}/chat`, {
        headers: {
          'Authorization': `Bearer ${data.session.access_token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        // Map database fields to component interface
        const mappedMessages = (result.data || []).map((msg: any) => ({
          ...msg,
          sender: msg.sender_type, // Map sender_type to sender
          text: msg.message, // Map message field to text
          timestamp: msg.created_at // Map created_at to timestamp
        }))
        setMessages(mappedMessages)
      } else {
        const errorData = await response.json()
        console.error('Chat API error:', errorData)
        // Show user-friendly error message
        if (response.status === 503) {
          console.error('Chat table not set up. Please contact administrator.')
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputText.trim() || !user) return

    // Use the userType prop to determine sender type
    const senderType = userType

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: senderType,
      timestamp: new Date(),
      senderName: user.email
    }

    try {
      setIsTyping(true)
      setInputText('')

      // Get session token for API call
      const { getSupabaseClient } = await import('@/lib/supabase-client')
      const { data, error } = await getSupabaseClient().auth.getSession()
      
      if (!data.session?.access_token) {
        throw new Error('No session token')
      }

      // Send message via API
      const response = await fetch(`/api/inquiries/${inquiryId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.session.access_token}`
        },
        body: JSON.stringify({
          message: newMessage.text,
          sender: senderType
        })
      })

      if (response.ok) {
        const result = await response.json()
        // Use the server response with proper field mapping
        const serverMessage = {
          ...result.data,
          sender: result.data.sender_type, // Map sender_type to sender
          text: result.data.message, // Map message field to text
          timestamp: result.data.created_at // Map created_at to timestamp
        }
        setMessages(prev => [...prev, serverMessage])
      } else {
        const errorData = await response.json()
        console.error('Send message API error:', errorData)
        throw new Error(errorData.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Revert the input if sending failed
      setInputText(newMessage.text)
      // Show error message to user
      alert('Failed to send message. Please try again.')
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date | string | null | undefined) => {
    try {
      // Handle null, undefined, or empty values
      if (!date) {
        return 'Unknown time'
      }
      
      const dateObj = typeof date === 'string' ? new Date(date) : date
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid time'
      }
      
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (error) {
      console.error('Error formatting time:', error, 'Input:', date)
      return 'Invalid time'
    }
  }

  const formatDate = (date: Date | string | null | undefined) => {
    try {
      // Handle null, undefined, or empty values
      if (!date) {
        return 'Unknown date'
      }
      
      const today = new Date()
      const messageDate = typeof date === 'string' ? new Date(date) : date
      
      // Check if the date is valid
      if (isNaN(messageDate.getTime())) {
        return 'Invalid date'
      }
      
      if (messageDate.toDateString() === today.toDateString()) {
        return 'Today'
      }
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday'
      }
      
      return messageDate.toLocaleDateString()
    } catch (error) {
      console.error('Error formatting date:', error, 'Input:', date)
      return 'Invalid date'
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [date: string]: Message[] } = {}
    
    messages.forEach(message => {
      try {
        // Skip messages with invalid timestamps
        if (!message.timestamp) {
          if (!groups['Unknown Date']) {
            groups['Unknown Date'] = []
          }
          groups['Unknown Date'].push(message)
          return
        }
        
        // Handle both string and Date timestamps
        const date = new Date(message.timestamp).toDateString()
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(message)
      } catch (error) {
        console.error('Error grouping message by date:', error, message)
        // Put invalid dates in a separate group
        if (!groups['Invalid Date']) {
          groups['Invalid Date'] = []
        }
        groups['Invalid Date'].push(message)
      }
    })
    
    return groups
  }

  if (!isOpen) {
    return null
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Inquiry Chat</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                {customerName}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            <p>Customer: {customerName} ({customerEmail})</p>
            <p>Inquiry ID: {inquiryId}</p>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              Object.entries(messageGroups).map(([date, dateMessages]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-xs text-gray-600 font-medium">
                        {formatDate(new Date(date))}
                      </span>
                    </div>
                  </div>
                  
                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.sender === 'admin' ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          {message.sender === 'admin' ? (
                            <div className="flex items-center space-x-1 text-xs text-blue-600 font-medium">
                              <Shield className="h-3 w-3" />
                              <span>Admin</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-xs text-green-600 font-medium">
                              <User className="h-3 w-3" />
                              <span>{message.senderName || 'Customer'}</span>
                            </div>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.sender === 'admin'
                              ? 'bg-blue-600 text-white border border-blue-700'
                              : 'bg-gray-100 text-gray-900 border border-gray-300'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isTyping || !user}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputText.trim() || isTyping || !user}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!user && (
              <p className="text-xs text-red-600 mt-2">You must be logged in to send messages</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
