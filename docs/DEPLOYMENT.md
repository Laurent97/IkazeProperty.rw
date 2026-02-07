# Deployment Guide

## Quick Start

### 1. Environment Setup
```bash
# Clone repository
git clone <repository-url>
cd ikaze-property

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Database Setup
```bash
# Apply main schema
supabase db push supabase/schema.sql

# Apply notification schema
supabase db push supabase/schema-notifications.sql
```

### 3. Environment Variables
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
AIRTEL_MONEY_CLIENT_ID=your_airtel_client_id
EQUITY_BANK_API_KEY=your_equity_key

# Security
CRON_API_KEY=your_secure_cron_key
```

### 4. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Production Checklist

- [ ] Database schemas applied
- [ ] Environment variables configured
- [ ] Payment providers set up
- [ ] Cloudinary buckets created
- [ ] Cron jobs scheduled
- [ ] SSL certificates installed
- [ ] Monitoring enabled
- [ ] Backup procedures tested

## Cron Jobs Setup

```bash
# Add to crontab
crontab -e

# Every 5 minutes - check payments
*/5 * * * * curl -X POST https://your-domain.com/api/cron/checkPendingPayments -H "x-api-key: $CRON_API_KEY"

# Daily at midnight - deactivate promotions
0 0 * * * curl -X POST https://your-domain.com/api/cron/deactivateExpiredPromotions -H "x-api-key: $CRON_API_KEY"

# Hourly - update exchange rates
0 * * * * curl -X POST https://your-domain.com/api/cron/updateExchangeRates -H "x-api-key: $CRON_API_KEY"
```

## Monitoring

Set up monitoring for:
- API response times
- Payment success rates
- Database performance
- Error rates
- User activity

## Backup Strategy

- Database: Daily automated backups
- File storage: Cloudinary redundancy
- Configuration: Git version control
- Logs: Centralized logging service
