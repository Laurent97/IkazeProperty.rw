/**
 * Customer Guidance Flows for IkazeProperty.rw Chat Bots
 * Provides structured guidance for common customer journeys
 */

export interface GuidanceStep {
  id: string
  title: string
  description: string
  action?: string
  nextSteps?: string[]
  tips?: string[]
}

export interface CustomerFlow {
  id: string
  title: string
  description: string
  steps: GuidanceStep[]
  estimatedTime: string
  prerequisites: string[]
}

export const customerGuidanceFlows: CustomerFlow[] = [
  {
    id: 'first_time_seller',
    title: 'First-Time Seller Guide',
    description: 'Complete guide to listing your first property or vehicle',
    estimatedTime: '15-20 minutes',
    prerequisites: ['Valid ID', 'Proof of address', 'Property ownership documents'],
    steps: [
      {
        id: 'account_setup',
        title: 'Create & Verify Account',
        description: 'Start by creating your account and completing verification',
        action: 'Visit ikazeproperty.rw and click "Sign Up"',
        nextSteps: ['Fill personal information', 'Upload ID documents', 'Verify email/phone'],
        tips: [
          'Use clear, high-quality photos of your ID',
          'Proof of address can be utility bill or bank statement',
          'Verification takes 1-2 business days'
        ]
      },
      {
        id: 'prepare_listing',
        title: 'Prepare Your Listing',
        description: 'Gather all information and photos for your listing',
        action: 'Take photos and gather documents',
        nextSteps: [
          'Take 10+ high-quality photos',
          'Write detailed description',
          'Set competitive price',
          'Gather ownership documents'
        ],
        tips: [
          'Include photos from multiple angles',
          'Highlight unique features',
          'Research similar listings for pricing',
          'Be honest about condition'
        ]
      },
      {
        id: 'create_listing',
        title: 'Create Listing',
        description: 'Upload your listing to the platform',
        action: 'Click "List Property" in your dashboard',
        nextSteps: [
          'Select category (House/Car/Land/Other)',
          'Upload photos/videos',
          'Fill all required fields',
          'Set price and location',
          'Add optional promotion'
        ],
        tips: [
          'Fill all fields for better visibility',
          'Use keywords buyers search for',
          'Set accurate location on map',
          'Consider promotion for faster sale'
        ]
      },
      {
        id: 'review_publish',
        title: 'Review & Publish',
        description: 'Review your listing and publish it',
        action: 'Submit for admin review',
        nextSteps: [
          'Double-check all information',
          'Preview your listing',
          'Submit for review',
          'Wait for approval (usually within 24 hours)'
        ],
        tips: [
          'Check for typos and errors',
          'Ensure contact info is correct',
          'Respond promptly to inquiries',
          'Monitor your listing performance'
        ]
      }
    ]
  },
  {
    id: 'first_time_buyer',
    title: 'First-Time Buyer Guide',
    description: 'How to safely purchase your first property or vehicle',
    estimatedTime: '30-45 minutes for browsing, 1-3 days for transaction',
    prerequisites: ['Budget planning', 'Requirements clear', 'Payment method ready'],
    steps: [
      {
        id: 'browse_search',
        title: 'Browse & Search',
        description: 'Find listings that match your requirements',
        action: 'Use advanced search filters',
        nextSteps: [
          'Set location preferences',
          'Filter by price range',
          'Select category',
          'Use specific keywords',
          'Save interesting listings'
        ],
        tips: [
          'Use multiple filters for precise results',
          'Save searches for new listing alerts',
          'Compare multiple options',
          'Check listing dates for freshness'
        ]
      },
      {
        id: 'express_interest',
        title: 'Express Interest',
        description: 'Show interest in listings you like',
        action: 'Click "Express Interest" on selected listings',
        nextSteps: [
          'Log in to your account',
          'Click the interest button',
          'Provide brief message',
          'Wait for admin contact'
        ],
        tips: [
          'Be specific about your questions',
          'Mention your timeline',
          'Confirm you are ready to proceed',
          'Keep contact info updated'
        ]
      },
      {
        id: 'mediation_process',
        title: 'Admin Mediation',
        description: 'Our admin team facilitates the transaction',
        action: 'Work with our mediation team',
        nextSteps: [
          'Admin contacts seller',
          'Verify listing details',
          'Arrange inspection/viewing',
          'Negotiate terms if needed'
        ],
        tips: [
          'Respond promptly to admin communications',
          'Ask all questions before payment',
          'Request additional photos if needed',
          'Never pay outside our platform'
        ]
      },
      {
        id: 'secure_payment',
        title: 'Secure Payment',
        description: 'Complete payment through our secure system',
        action: 'Choose payment method and complete transaction',
        nextSteps: [
          'Select payment method',
          'Complete payment verification',
          'Wait for confirmation',
          'Receive receipt'
        ],
        tips: [
          'Choose your preferred payment method',
          'Keep payment confirmation safe',
          'Contact support if payment fails',
          'Transaction is insured and protected'
        ]
      },
      {
        id: 'receive_item',
        title: 'Receive Your Item',
        description: 'Complete the transfer and receive your purchase',
        action: 'Coordinate with admin for final transfer',
        nextSteps: [
          'Arrange pickup/delivery',
          'Inspect item thoroughly',
          'Confirm receipt',
          'Leave review'
        ],
        tips: [
          'Inspect before final acceptance',
          'Check all documents are in order',
          'Report issues immediately',
          'Leave honest feedback for seller'
        ]
      }
    ]
  },
  {
    id: 'payment_troubleshooting',
    title: 'Payment Issues & Solutions',
    description: 'Common payment problems and how to resolve them',
    estimatedTime: '5-15 minutes',
    prerequisites: ['Transaction ID', 'Payment method details'],
    steps: [
      {
        id: 'identify_issue',
        title: 'Identify the Issue',
        description: 'Determine what type of payment problem you are experiencing',
        action: 'Check payment status and error messages',
        nextSteps: [
          'Note any error messages',
          'Check payment status',
          'Verify payment method details',
          'Check internet connection'
        ],
        tips: [
          'Take screenshots of error messages',
          'Note the exact time of attempted payment',
          'Check if money was deducted',
          'Verify account balance'
        ]
      },
      {
        id: 'common_solutions',
        title: 'Try Common Solutions',
        description: 'Apply quick fixes for common payment issues',
        action: 'Follow these troubleshooting steps',
        nextSteps: [
          'Refresh the page and retry',
          'Clear browser cache',
          'Try different browser',
          'Check payment method details',
          'Verify sufficient funds'
        ],
        tips: [
          'MTN/Airtel: Check if USSD prompt appears',
          'Bank: Verify account details and limits',
          'Crypto: Double-check wallet address',
          'Wallet: Ensure sufficient balance'
        ]
      },
      {
        id: 'contact_support',
        title: 'Contact Support',
        description: 'Get help from our support team',
        action: 'Reach out through multiple channels',
        nextSteps: [
          'Use 24/7 AI chat for immediate help',
          'Call support hotline for urgent issues',
          'Email detailed problem description',
          'Provide transaction ID and screenshots'
        ],
        tips: [
          'Have transaction ID ready',
          'Include screenshots of errors',
          'Describe what you were trying to do',
          'Mention payment method used'
        ]
      },
      {
        id: 'follow_up',
        title: 'Follow Up & Resolution',
        description: 'Monitor resolution and confirm success',
        action: 'Track your support ticket',
        nextSteps: [
          'Note support ticket reference',
          'Check email for updates',
          'Verify payment completion',
          'Confirm receipt/service'
        ],
        tips: [
          'Response time is usually 2-4 hours',
          'Urgent issues get priority',
          'Escalate if not resolved in 24 hours',
          'Keep all communication records'
        ]
      }
    ]
  },
  {
    id: 'safety_guidelines',
    title: 'Safety & Security Guide',
    description: 'Essential safety tips for secure transactions',
    estimatedTime: '10 minutes to read',
    prerequisites: ['Account verification completed'],
    steps: [
      {
        id: 'account_security',
        title: 'Protect Your Account',
        description: 'Keep your account secure from unauthorized access',
        action: 'Implement strong security practices',
        nextSteps: [
          'Use strong, unique password',
          'Enable two-factor authentication',
          'Keep login details private',
          'Log out after each session'
        ],
        tips: [
          'Never share your password',
          'Use different passwords for different sites',
          'Be wary of phishing attempts',
          'Report suspicious account activity'
        ]
      },
      {
        id: 'transaction_safety',
        title: 'Secure Transaction Practices',
        description: 'Follow these rules for every transaction',
        action: 'Always use our secure platform',
        nextSteps: [
          'Never pay outside our platform',
          'Verify listing authenticity',
          'Use admin mediation always',
          'Check seller verification status'
        ],
        tips: [
          'If deal seems too good, be suspicious',
          'Verify ownership documents',
          'Meet in safe, public locations',
          'Bring someone for inspections'
        ]
      },
      {
        id: 'recognize_scams',
        title: 'Recognize and Avoid Scams',
        description: 'Learn to identify common scam patterns',
        action: 'Stay alert for red flags',
        nextSteps: [
          'Watch for urgency pressure tactics',
          'Avoid requests for personal info',
          'Be suspicious of fake documents',
          'Report suspicious behavior'
        ],
        tips: [
          'Scammers create fake urgency',
          'Never share financial details',
          'Verify all documents independently',
          'Trust your instincts'
        ]
      },
      {
        id: 'report_issues',
        title: 'Report Security Issues',
        description: 'Know how and when to report problems',
        action: 'Use our reporting systems',
        nextSteps: [
          'Report suspicious listings',
          'Flag fraudulent users',
          'Contact support for security concerns',
          'Document all communications'
        ],
        tips: [
          'Report immediately - don\'t wait',
          'Provide as much detail as possible',
          'Include screenshots and evidence',
          'Follow up on your report'
        ]
      }
    ]
  },
  {
    id: 'verification_process',
    title: 'Account & Listing Verification',
    description: 'Complete guide to verification processes',
    estimatedTime: '1-2 business days for account, 24 hours for listing',
    prerequisites: ['Valid documents ready'],
    steps: [
      {
        id: 'prepare_documents',
        title: 'Prepare Required Documents',
        description: 'Gather all necessary documents for verification',
        action: 'Collect and scan documents',
        nextSteps: [
          'National ID or passport',
          'Proof of address (utility bill, bank statement)',
          'Property ownership documents (for sellers)',
          'Business registration (for agents)'
        ],
        tips: [
          'Use clear, high-quality scans',
          'Ensure all text is readable',
          'Documents must be current (not expired)',
          'Use color scans when possible'
        ]
      },
      {
        id: 'submit_verification',
        title: 'Submit for Verification',
        description: 'Upload documents and submit for review',
        action: 'Complete verification form in your account',
        nextSteps: [
          'Log in to your account',
          'Go to verification section',
          'Upload all required documents',
          'Submit for review',
          'Wait for confirmation'
        ],
        tips: [
          'Double-check all uploads are clear',
          'Ensure document edges are visible',
          'Follow size and format requirements',
          'Note your verification reference'
        ]
      },
      {
        id: 'tracking_status',
        title: 'Track Verification Status',
        description: 'Monitor your verification progress',
        action: 'Check status in your dashboard',
        nextSteps: [
          'Check verification status daily',
          'Respond to additional document requests',
          'Contact support if delayed',
          'Complete any additional requirements'
        ],
        tips: [
          'Normal processing time: 1-2 business days',
          'You may be asked for additional documents',
          'Incomplete applications are rejected',
          'Support can help with status updates'
        ]
      },
      {
        id: 'post_verification',
        title: 'After Verification',
        description: 'What to do once verified',
        action: 'Start using your verified account',
        nextSteps: [
          'Create your first listing',
          'Express interest in items',
          'Apply for agent status if applicable',
          'Update profile information'
        ],
        tips: [
          'Verified status builds trust',
          'You get priority in searches',
          'Higher success rate for transactions',
          'Keep documents updated'
        ]
      }
    ]
  }
]

export function getGuidanceFlow(flowId: string): CustomerFlow | undefined {
  return customerGuidanceFlows.find(flow => flow.id === flowId)
}

export function getGuidanceStep(flowId: string, stepId: string): GuidanceStep | undefined {
  const flow = getGuidanceFlow(flowId)
  return flow?.steps.find(step => step.id === stepId)
}

export function searchGuidanceFlows(query: string): CustomerFlow[] {
  const lowerQuery = query.toLowerCase()
  return customerGuidanceFlows.filter(flow => 
    flow.title.toLowerCase().includes(lowerQuery) ||
    flow.description.toLowerCase().includes(lowerQuery) ||
    flow.steps.some(step => 
      step.title.toLowerCase().includes(lowerQuery) ||
      step.description.toLowerCase().includes(lowerQuery)
    )
  )
}
