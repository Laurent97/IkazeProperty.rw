import '@testing-library/jest-dom'

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
    })),
  },
}))

// Mock Cloudinary
jest.mock('@/lib/cloudinary', () => ({
  uploadImage: jest.fn(),
  uploadVideo: jest.fn(),
  deleteResource: jest.fn(),
}))

// Mock PaymentProcessorFactory
jest.mock('@/lib/payment/factory', () => ({
  PaymentProcessorFactory: {
    initiatePayment: jest.fn(),
    verifyPayment: jest.fn(),
    processWebhook: jest.fn(),
    refundPayment: jest.fn(),
    getSupportedMethods: jest.fn(() => ['wallet', 'mtn_momo', 'airtel_money', 'equity_bank', 'crypto']),
  },
}))

// Mock NotificationService
jest.mock('@/lib/notifications/service', () => ({
  NotificationService: {
    createNotification: jest.fn(),
    getUserNotifications: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
  },
}))

// Global test utilities
global.fetch = jest.fn()

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
