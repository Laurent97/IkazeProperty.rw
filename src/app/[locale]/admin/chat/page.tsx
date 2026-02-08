'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Users, Send, Search, Filter, Phone, Mail, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Conversation {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  lastMessage: string
  lastMessageTime: Date
  status: 'active' | 'waiting' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  messages: Message[]
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'admin' | 'bot'
  timestamp: Date
  senderName?: string
}

interface AdminChatCenterProps {}

export default function AdminChatCenter({}: AdminChatCenterProps) {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'John Mukiza',
      userEmail: 'john@example.com',
      userPhone: '+250 XXX XXX XXX',
      lastMessage: 'I need help with my property listing',
      lastMessageTime: new Date('2024-02-07T16:35:00'),
      status: 'active',
      priority: 'high',
      assignedTo: 'Admin 1',
      messages: [
        {
          id: 'm1',
          text: 'Hello, I need help with my property listing',
          sender: 'user',
          timestamp: new Date('2024-02-07T16:30:00'),
          senderName: 'John Mukiza'
        },
        {
          id: 'm2',
          text: 'Hello John! I\'d be happy to help you with your property listing. What specific issue are you facing?',
          sender: 'admin',
          timestamp: new Date('2024-02-07T16:32:00'),
          senderName: 'Admin 1'
        },
        {
          id: 'm3',
          text: 'I\'m trying to upload photos but they keep failing',
          sender: 'user',
          timestamp: new Date('2024-02-07T16:35:00'),
          senderName: 'John Mukiza'
        }
      ]
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah Uwimana',
      userEmail: 'sarah@example.com',
      userPhone: '+250 788 234 567',
      lastMessage: 'Thank you for the help!',
      lastMessageTime: new Date('2024-02-07T16:10:00'),
      status: 'resolved',
      priority: 'low',
      assignedTo: 'Admin 2',
      messages: [
        {
          id: 'm4',
          text: 'How do I verify my account?',
          sender: 'user',
          timestamp: new Date('2024-02-07T15:55:00'),
          senderName: 'Sarah Uwimana'
        },
        {
          id: 'm5',
          text: 'To verify your account, you need to upload a valid ID and proof of address. The process takes 1-2 business days.',
          sender: 'admin',
          timestamp: new Date('2024-02-07T16:00:00'),
          senderName: 'Admin 2'
        },
        {
          id: 'm6',
          text: 'Thank you for the help!',
          sender: 'user',
          timestamp: new Date('2024-02-07T16:10:00'),
          senderName: 'Sarah Uwimana'
        }
      ]
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Eric Niyonzima',
      userEmail: 'eric@example.com',
      userPhone: '+250 788 345 678',
      lastMessage: 'Is there a commission fee?',
      lastMessageTime: new Date('2024-02-07T15:40:00'),
      status: 'waiting',
      priority: 'medium',
      messages: [
        {
          id: 'm7',
          text: 'Is there a commission fee?',
          sender: 'user',
          timestamp: new Date('2024-02-07T15:40:00'),
          senderName: 'Eric Niyonzima'
        }
      ]
    }
  ])

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0])
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-orange-100 text-orange-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: `admin_msg_${Date.now()}_${Math.random()}`,
      text: messageInput,
      sender: 'admin',
      timestamp: new Date(),
      senderName: 'Current Admin'
    }

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          lastMessageTime: new Date()
        }
      }
      return conv
    }))

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: messageInput,
      lastMessageTime: new Date()
    } : null)

    setMessageInput('')
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || conv.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: conversations.length,
    active: conversations.filter(c => c.status === 'active').length,
    waiting: conversations.filter(c => c.status === 'waiting').length,
    resolved: conversations.filter(c => c.status === 'resolved').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Chat Center</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Total: {stats.total} | Active: {stats.active} | Waiting: {stats.waiting}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="waiting">Waiting</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="all">All Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.id === conversation.id ? 'bg-red-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{conversation.userName}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(conversation.priority)}`}>
                          {conversation.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-2">{conversation.lastMessage}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(conversation.status)}`}>
                          {conversation.status}
                        </span>
                        <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedConversation ? (
              <Card className="h-full">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedConversation.userName}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {selectedConversation.userEmail}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {selectedConversation.userPhone}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedConversation.status)}`}>
                          {selectedConversation.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedConversation.priority)}`}>
                          {selectedConversation.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          message.sender === 'admin' ? 'text-right' : 'text-left'
                        }`}>
                          <div className={`rounded-lg p-3 ${
                            message.sender === 'admin' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.senderName} • {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your response..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <Button onClick={handleSendMessage} className="bg-red-600 hover:bg-red-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a Conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start chatting
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
