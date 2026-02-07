# IkazeProperty - Complete Development Documentation

## Overview

IkazeProperty is a sophisticated Rwandan commercial vehicle marketplace platform with integrated payment systems and optional advertising promotions. The system features admin-mediated connections between buyers/sellers and operates on a 30% commission model.

## Technology Stack

### Frontend
- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS with custom black/white/red theme
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React hooks and Supabase real-time subscriptions

### Backend
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Supabase Auth
- **Storage**: Cloudinary for images/videos
- **API**: Next.js API routes with TypeScript

### Payment Systems
- **MTN Mobile Money**: API integration for Rwandan mobile payments
- **Airtel Money**: API integration for Airtel mobile payments
- **Equity Bank**: Direct bank transfer integration
- **Cryptocurrency**: Bitcoin, Ethereum, USDT support
- **Wallet System**: Internal wallet for instant payments

### Infrastructure
- **Deployment**: Vercel (recommended)
- **Monitoring**: Built-in error tracking and logging
- **Cron Jobs**: Automated payment verification and promotion management

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/                # API endpoints
│   │   ├── payments/       # Payment processing endpoints
│   │   ├── promotions/      # Promotion management
│   │   ├── notifications/   # Notification system
│   │   └── cron/          # Cron job triggers
│   ├── admin/              # Admin dashboard pages
│   ├── dashboard/          # User dashboard
│   └── create-listing/    # Listing creation flow
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   └── listing/           # Listing-specific components
├── lib/                   # Utility libraries
│   ├── payment/           # Payment processing logic
│   ├── notifications/     # Notification service
│   └── cron/             # Scheduled jobs
└── types/                 # TypeScript type definitions
```

## Database Schema

### Core Tables

#### Users
- User management with roles (admin, agent, user)
- Authentication integration with Supabase Auth
- Profile information and verification status

#### Listings
- Property/vehicle listings with 4 categories
- Location data with Rwanda-specific administrative divisions
- Commission tracking and status management

#### Payment System
- **payment_transactions**: All payment records
- **user_wallets**: Internal wallet system
- **payment_configurations**: Admin-managed payment settings
- **payment_method_limits**: Tier-based transaction limits

#### Promotion System
- **promotion_packages**: Available promotion options
- **listing_promotions**: Active promotions tracking
- **premium_features**: Additional paid features

#### Notification System
- **notifications**: Multi-channel notification records
- **notification_preferences**: User notification settings
- **notification_templates**: Admin-managed templates

## Payment Flow Architecture

### 1. Payment Initiation
```typescript
// User selects payment method and initiates payment
const paymentRequest = {
  user_id: 'user-uuid',
  payment_method: 'mtn_momo',
  amount: 15000,
  transaction_type: 'ad_promotion',
  listing_id: 'listing-uuid'
};

const result = await PaymentProcessorFactory.initiatePayment(paymentRequest);
```

### 2. Payment Processing
- **MTN/Airtel**: Mobile money API calls with USSD prompts
- **Equity Bank**: Direct bank transfer initiation
- **Crypto**: Generate payment address with real-time conversion
- **Wallet**: Instant balance deduction

### 3. Payment Verification
- Automatic webhook processing
- Cron job verification for pending transactions
- Manual admin override capabilities

### 4. Post-Payment Actions
- Promotion activation
- Notification dispatch
- Transaction logging

## Promotion System

### Available Packages
1. **Urgent Badge** (5,000 RWF - 14 days)
   - Red URGENT badge
   - Higher search ranking
   - Email alerts to subscribers

2. **Featured Placement** (15,000 RWF - 7 days)
   - Top of category pages
   - Featured badge
   - 30% more views guaranteed

3. **Premium Package** (25,000 RWF - 10 days)
   - All features combined
   - WhatsApp broadcast
   - Social media mention
   - Priority support

### Promotion Workflow
1. User creates listing
2. Optional promotion step appears
3. Package selection and payment
4. Automatic activation after payment confirmation
5. Performance tracking and analytics

## Security Implementation

### Row Level Security (RLS)
- All tables have comprehensive RLS policies
- Users can only access their own data
- Admins have full access to all records
- Automatic wallet creation for new users

### Payment Security
- Transaction limits per user tier
- Wallet balance locking during transactions
- Webhook signature verification
- Comprehensive audit logging

### Data Protection
- Encrypted sensitive data storage
- GDPR-compliant data handling
- Regular security audits
- Rate limiting on API endpoints

## Notification System

### Multi-Channel Support
- **Email**: HTML templates with responsive design
- **SMS**: Rwanda-specific SMS integration
- **Push**: In-app push notifications
- **In-App**: Real-time database updates

### Notification Types
- Payment confirmations and failures
- Promotion activation and expiry alerts
- Inquiry notifications and approvals
- Wallet top-up confirmations
- Refund processing updates

### Template System
- Admin-manageable notification templates
- Variable substitution for personalization
- Multi-language support ready

## Cron Jobs and Automation

### Scheduled Tasks
1. **Payment Verification** (Every 5 minutes)
   - Check pending transactions
   - Verify with payment providers
   - Update transaction status

2. **Promotion Expiry** (Daily)
   - Deactivate expired promotions
   - Send expiry notifications
   - Update listing status

3. **Exchange Rate Updates** (Hourly)
   - Update cryptocurrency rates
   - Sync with multiple exchanges
   - Cache for performance

4. **Failed Transaction Processing** (Daily)
   - Return locked wallet balances
   - Generate failure reports
   - Notify affected users

5. **Financial Reports** (Daily)
   - Generate transaction summaries
   - Revenue tracking
   - Method performance analytics

## API Documentation

### Payment Endpoints

#### Initiate Payment
```
POST /api/payments/initiate
Content-Type: application/json

{
  "user_id": "uuid",
  "payment_method": "mtn_momo",
  "amount": 15000,
  "transaction_type": "ad_promotion",
  "listing_id": "uuid",
  "phone_number": "+250788123456"
}
```

#### Verify Payment
```
POST /api/payments/verify
Content-Type: application/json

{
  "payment_method": "mtn_momo",
  "reference": "PAY20240207123456"
}
```

#### Process Webhook
```
POST /api/payments/webhook/[method]
Content-Type: application/json

{
  "externalId": "PAY20240207123456",
  "status": "SUCCESSFUL",
  "amount": 15000
}
```

### Promotion Endpoints

#### Get Packages
```
GET /api/promotions/packages
Response: { packages: [...] }
```

#### Purchase Promotion
```
POST /api/promotions/purchase
Content-Type: application/json

{
  "listing_id": "uuid",
  "package_id": "uuid",
  "payment_method": "wallet"
}
```

### Notification Endpoints

#### Get User Notifications
```
GET /api/notifications?limit=20&offset=0
Response: { notifications: [...] }
```

#### Mark as Read
```
POST /api/notifications/[id]/read
```

## Configuration

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Providers
MTN_MOMO_API_KEY=your_mtn_api_key
MTN_MOMO_API_SECRET=your_mtn_secret
AIRTEL_MONEY_CLIENT_ID=your_airtel_client_id
AIRTEL_MONEY_CLIENT_SECRET=your_airtel_secret
EQUITY_BANK_API_KEY=your_equity_key

# Cron Job Security
CRON_API_KEY=your_cron_api_key

# Notification Services
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_key
```

## Deployment Guide

### 1. Database Setup
```sql
-- Run main schema
\i supabase/schema.sql

-- Run notification schema
\i supabase/schema-notifications.sql
```

### 2. Environment Configuration
1. Set up Supabase project
2. Configure authentication providers
3. Set up storage buckets for images
4. Configure environment variables

### 3. Payment Provider Setup
1. Register with MTN Mobile Money API
2. Register with Airtel Money API
3. Set up Equity Bank merchant account
4. Configure cryptocurrency wallets

### 4. Notification Setup
1. Configure SendGrid for emails
2. Set up Twilio for SMS
3. Configure Firebase for push notifications

### 5. Cron Job Setup
```bash
# Example cron entries
*/5 * * * * curl -X POST https://your-domain.com/api/cron/checkPendingPayments -H "x-api-key: your_key"
0 0 * * * curl -X POST https://your-domain.com/api/cron/deactivateExpiredPromotions -H "x-api-key: your_key"
0 * * * * curl -X POST https://your-domain.com/api/cron/updateExchangeRates -H "x-api-key: your_key"
```

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Monitoring and Analytics

### Key Metrics
- Payment success rate (>95% target)
- Transaction processing time (<30 seconds)
- Promotion conversion rate
- User engagement metrics
- Revenue tracking

### Error Tracking
- Comprehensive error logging
- Payment failure analysis
- Performance monitoring
- User behavior analytics

## Compliance

### Rwanda-Specific
- RWF currency support
- Local payment method integration
- Kinyarwanda language support
- Local business hour awareness

### International Standards
- GDPR compliance
- PCI DSS for payment processing
- Data encryption standards
- Regular security audits

## Support and Maintenance

### Regular Tasks
- Daily transaction reconciliation
- Weekly performance reviews
- Monthly security updates
- Quarterly feature updates

### Emergency Procedures
- Payment failure recovery
- Database backup restoration
- Service outage response
- Security incident handling

## Future Enhancements

### Phase 1 (Next 3 months)
- Mobile app development
- Advanced analytics dashboard
- AI-powered recommendations
- Enhanced search capabilities

### Phase 2 (3-6 months)
- International expansion
- Additional payment methods
- Advanced fraud detection
- API for third-party integrations

### Phase 3 (6-12 months)
- Machine learning features
- Blockchain integration
- IoT device support
- Advanced automation

---

## Contact and Support

For technical support or questions about this implementation:
- Email: support@ikazeproperty.rw
- Documentation: https://docs.ikazeproperty.rw
- Issues: https://github.com/ikazeproperty/issues

---

*This documentation covers the complete implementation of the IkazeProperty platform as specified in the development requirements. All features, security measures, and operational procedures are documented for easy reference and maintenance.*
