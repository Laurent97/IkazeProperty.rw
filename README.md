# IkazeProperty - Commercial Vehicle Marketplace

A sophisticated Rwandan marketplace platform with integrated payment systems and optional advertising promotions for property listings.

## Features

### Core Marketplace
- **Multi-category Listings**: Houses, Cars, Land, and Other items
- **Admin-mediated Connections**: 30% commission model with secure transactions
- **Advanced Search**: Filter by location, price, category, and features
- **Real-time Messaging**: Secure communication between buyers and sellers

### Payment System
- **MTN Mobile Money**: Full API integration with USSD prompts
- **Airtel Money**: Complete mobile payment support
- **Equity Bank**: Direct bank transfer integration
- **Cryptocurrency**: Bitcoin, Ethereum, USDT support with real-time conversion
- **Internal Wallet**: Instant payments with balance management

### Promotion System
- **Urgent Badge** (5,000 RWF - 14 days): Red badge with priority ranking
- **Featured Placement** (15,000 RWF - 7 days): Top placement in categories
- **Premium Package** (25,000 RWF - 10 days): Complete promotion suite

### Advanced Features
- **Multi-channel Notifications**: Email, SMS, Push, In-app
- **Automated Cron Jobs**: Payment verification, promotion expiry, rate updates
- **Comprehensive Analytics**: Transaction tracking and performance metrics
- **Row-level Security**: Enterprise-grade data protection

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), Cloudinary Storage
- **Payments**: Custom payment processor factory with 5 payment methods
- **Testing**: Jest, Playwright E2E, 70% coverage target
- **Deployment**: Vercel-ready with environment configuration

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Cloudinary account
- Payment provider accounts (MTN, Airtel, Equity Bank)

## Quick Start

1. **Clone and Install**
```bash
git clone <repository-url>
cd ikaze-property
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env.local
# Configure your environment variables
```

3. **Database Setup**
```bash
# Apply main schema
supabase db push supabase/schema.sql

# Apply notification schema
supabase db push supabase/schema-notifications.sql
```

4. **Start Development**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

The application uses a comprehensive PostgreSQL schema with:

- **User Management**: Roles, authentication, profiles
- **Listing System**: Multi-category property/vehicle listings
- **Payment Infrastructure**: Transactions, wallets, configurations
- **Promotion Engine**: Packages, analytics, performance tracking
- **Notification System**: Multi-channel delivery with templates

## Configuration

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Providers
MTN_MOMO_API_KEY=your_mtn_api_key
AIRTEL_MONEY_CLIENT_ID=your_airtel_client_id
EQUITY_BANK_API_KEY=your_equity_key
```

### Payment Provider Setup
1. **MTN Mobile Money**: Register for API access and configure merchant details
2. **Airtel Money**: Set up developer account and obtain credentials
3. **Equity Bank**: Configure merchant account and API endpoints
4. **Cryptocurrency**: Set up wallet addresses for BTC, ETH, USDT

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run integration tests
npm run test:integration
```

## API Documentation

### Payment Endpoints
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/verify` - Verify payment status
- `POST /api/payments/webhook/[method]` - Process webhooks
- `GET /api/payments/methods` - Get available methods

### Promotion Endpoints
- `GET /api/promotions/packages` - Get promotion packages
- `POST /api/promotions/purchase` - Purchase promotion

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/[id]/read` - Mark as read

For complete API documentation, see [docs/API-REFERENCE.md](docs/API-REFERENCE.md).

## Cron Jobs

Automated tasks for system maintenance:

```bash
# Every 5 minutes - Check pending payments
*/5 * * * * curl -X POST /api/cron/checkPendingPayments

# Daily at midnight - Deactivate expired promotions
0 0 * * * curl -X POST /api/cron/deactivateExpiredPromotions

# Hourly - Update crypto exchange rates
0 * * * * curl -X POST /api/cron/updateExchangeRates
```

## Security Features

- **Row Level Security**: Database-level access control
- **Payment Encryption**: All sensitive data encrypted
- **Rate Limiting**: API endpoint protection
- **Audit Logging**: Complete transaction history
- **Webhook Verification**: Signature validation for payment callbacks

## Monitoring & Analytics

Key metrics tracked:
- Payment success rate (>95% target)
- Transaction processing time (<30 seconds)
- Promotion conversion rates
- User engagement analytics
- Revenue tracking and reporting

## Localization

Rwanda-specific features:
- **Currency**: RWF support with real-time conversion
- **Payment Methods**: Local mobile money integration
- **Language**: Kinyarwanda, French, English support
- **Geography**: Rwanda administrative divisions
- **Business Hours**: Local time zone awareness

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Docker
```bash
docker build -t ikaze-property .
docker run -p 3000:3000 ikaze-property
```

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Documentation

- [Main Documentation](docs/README.md) - Complete system overview
- [API Reference](docs/API-REFERENCE.md) - Detailed API documentation
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment steps

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- **Email**: support@ikazeproperty.rw
- **Documentation**: https://docs.ikazeproperty.rw
- **Issues**: https://github.com/ikazeproperty/issues

## Roadmap

### Phase 1 (Current)
- Core marketplace functionality
- Payment system integration
- Promotion system
- Notification system

### Phase 2 (Next 3 months)
- Mobile application
- Advanced analytics dashboard
- AI-powered recommendations
- Enhanced search capabilities

### Phase 3 (3-6 months)
- International expansion
- Additional payment methods
- Advanced fraud detection
- API for third-party integrations

---

**Built with ❤️ for the Rwandan market**
