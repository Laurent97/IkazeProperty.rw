# IkazeProperty API Reference

## Authentication

All API endpoints require authentication via Supabase Auth. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Payment API

### Initiate Payment

**Endpoint**: `POST /api/payments/initiate`

**Description**: Initiates a payment transaction using the specified payment method.

**Request Body**:
```json
{
  "user_id": "uuid",
  "payment_method": "mtn_momo" | "airtel_money" | "equity_bank" | "crypto" | "wallet",
  "amount": 15000,
  "currency": "RWF",
  "transaction_type": "ad_promotion" | "listing_fee" | "wallet_topup" | "premium_feature",
  "listing_id": "uuid",
  "ad_campaign_id": "uuid",
  "description": "Optional description",
  "metadata": {},
  "phone_number": "+250788123456",
  "crypto_type": "bitcoin" | "ethereum" | "usdt"
}
```

**Response**:
```json
{
  "success": true,
  "reference": "PAY20240207123456",
  "provider_reference": "MTN123456",
  "instructions": "Please check your phone for the MTN Mobile Money payment prompt",
  "expires_at": "2024-02-07T12:34:56Z",
  "wallet_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "crypto_amount": 0.0004,
  "crypto_currency": "BTC",
  "qr_code_url": "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "exchange_rate": 35000000
}
```

**Error Response**:
```json
{
  "error": "Insufficient wallet balance. Available: 5000 RWF, Required: 15000 RWF"
}
```

### Verify Payment

**Endpoint**: `POST /api/payments/verify`

**Description**: Verifies the status of a payment transaction.

**Request Body**:
```json
{
  "payment_method": "mtn_momo",
  "reference": "PAY20240207123456"
}
```

**Response**:
```json
{
  "success": true,
  "status": "completed",
  "data": {
    "transactionId": "MTN123456",
    "status": "SUCCESSFUL",
    "amount": "15000"
  },
  "confirmations": 6
}
```

### Process Webhook

**Endpoint**: `POST /api/payments/webhook/[method]`

**Description**: Processes payment provider webhooks for automated payment status updates.

**URL Parameters**:
- `method`: Payment method (mtn_momo, airtel_money, equity_bank, crypto)

**Request Body** (varies by provider):

**MTN Mobile Money**:
```json
{
  "externalId": "PAY20240207123456",
  "status": "SUCCESSFUL",
  "amount": "15000",
  "currency": "RWF",
  "transactionId": "MTN123456"
}
```

**Airtel Money**:
```json
{
  "transaction": {
    "id": "AIRTEL123456",
    "status": "SUCCESSFUL",
    "amount": 15000,
    "reference": "PAY20240207123456"
  }
}
```

**Cryptocurrency**:
```json
{
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "amount": "0.0004",
  "confirmations": 6,
  "txid": "1234567890abcdef...",
  "status": "confirmed"
}
```

### Refund Payment

**Endpoint**: `POST /api/payments/refund`

**Description**: Processes a refund for a completed transaction (Admin only).

**Request Body**:
```json
{
  "payment_method": "mtn_momo",
  "original_transaction_id": "uuid",
  "amount": 15000,
  "reason": "Customer requested refund",
  "processed_by": "admin-uuid"
}
```

**Response**:
```json
{
  "success": true,
  "refund_transaction_id": "refund-uuid",
  "status": "pending"
}
```

### Get Payment Methods

**Endpoint**: `GET /api/payments/methods`

**Description**: Returns available payment methods with their status.

**Response**:
```json
{
  "methods": [
    {
      "id": "wallet",
      "name": "Wallet Balance",
      "displayName": "Wallet Balance",
      "icon": "💰",
      "description": "Pay using your wallet balance",
      "isActive": true,
      "requiresPhone": false,
      "requiresCryptoSelection": false
    },
    {
      "id": "mtn_momo",
      "name": "MTN Mobile Money",
      "displayName": "MTN Mobile Money",
      "icon": "📱",
      "description": "Pay with MTN Mobile Money",
      "isActive": true,
      "requiresPhone": true,
      "requiresCryptoSelection": false
    }
  ],
  "supported": ["wallet", "mtn_momo", "airtel_money", "equity_bank", "crypto"]
}
```

## Promotion API

### Get Promotion Packages

**Endpoint**: `GET /api/promotions/packages`

**Description**: Returns all active promotion packages.

**Response**:
```json
{
  "packages": [
    {
      "id": "uuid",
      "name": "Urgent Badge",
      "description": "Red URGENT badge to attract immediate attention",
      "price": 5000,
      "duration_days": 14,
      "features": [
        "Red URGENT badge",
        "Higher ranking in search",
        "Email alerts to subscribers"
      ],
      "is_active": true,
      "sort_order": 1,
      "created_at": "2024-02-07T10:00:00Z",
      "updated_at": "2024-02-07T10:00:00Z"
    }
  ]
}
```

### Purchase Promotion

**Endpoint**: `POST /api/promotions/purchase`

**Description**: Purchases a promotion package for a listing.

**Request Body**:
```json
{
  "listing_id": "uuid",
  "package_id": "uuid",
  "payment_method": "wallet",
  "phone_number": "+250788123456",
  "crypto_type": "bitcoin"
}
```

**Response**:
```json
{
  "success": true,
  "payment": {
    "success": true,
    "reference": "PAY20240207123456",
    "instructions": "Payment completed successfully using wallet balance"
  },
  "promotion": {
    "id": "promotion-uuid",
    "listing_id": "listing-uuid",
    "package_id": "package-uuid",
    "status": "pending",
    "starts_at": "2024-02-07T12:00:00Z",
    "expires_at": "2024-02-21T12:00:00Z"
  }
}
```

### Create Promotion Package (Admin)

**Endpoint**: `POST /api/promotions/packages`

**Description**: Creates a new promotion package (Admin only).

**Request Body**:
```json
{
  "name": "Weekend Special",
  "description": "Special weekend promotion with maximum visibility",
  "price": 20000,
  "duration_days": 3,
  "features": [
    "Weekend featured placement",
    "Social media blast",
    "Priority support"
  ],
  "is_active": true,
  "sort_order": 4
}
```

## Notification API

### Get User Notifications

**Endpoint**: `GET /api/notifications`

**Description**: Retrieves notifications for the authenticated user.

**Query Parameters**:
- `limit`: Number of notifications to return (default: 20)
- `offset`: Number of notifications to skip (default: 0)

**Response**:
```json
{
  "notifications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "payment_completed",
      "title": "Payment Completed",
      "message": "Your payment of 15000 RWF via wallet has been completed successfully.",
      "data": {
        "amount": 15000,
        "payment_method": "wallet"
      },
      "channels": ["email", "in_app"],
      "priority": "high",
      "status": "sent",
      "read_at": null,
      "sent_at": "2024-02-07T12:00:00Z",
      "created_at": "2024-02-07T12:00:00Z"
    }
  ]
}
```

### Create Notification (Admin)

**Endpoint**: `POST /api/notifications`

**Description**: Creates a new notification (Admin only).

**Request Body**:
```json
{
  "user_id": "uuid",
  "type": "payment_completed",
  "title": "Custom Notification",
  "message": "This is a custom notification",
  "data": {},
  "channels": ["email", "in_app"],
  "priority": "medium"
}
```

### Mark Notification as Read

**Endpoint**: `POST /api/notifications/[id]/read`

**Description**: Marks a specific notification as read.

**URL Parameters**:
- `id`: Notification ID

**Response**:
```json
{
  "success": true
}
```

### Mark All Notifications as Read

**Endpoint**: `POST /api/notifications/mark-all-read`

**Description**: Marks all notifications for the user as read.

**Response**:
```json
{
  "success": true
}
```

## Cron Job API

### Trigger Cron Job

**Endpoint**: `POST /api/cron/[jobName]`

**Description**: Manually triggers a cron job (requires API key).

**Headers**:
- `x-api-key`: Cron job API key

**URL Parameters**:
- `jobName`: Name of the job to trigger

**Available Jobs**:
- `checkPendingPayments`
- `deactivateExpiredPromotions`
- `updateExchangeRates`
- `processFailedTransactions`
- `generateDailyReports`

**Response**:
```json
{
  "success": true,
  "job": "checkPendingPayments",
  "result": {
    "checked": 5,
    "completed": 2,
    "failed": 1
  },
  "timestamp": "2024-02-07T12:00:00Z"
}
```

## Error Codes

### Common Error Responses

**400 Bad Request**:
```json
{
  "error": "Missing required fields: user_id, payment_method, amount"
}
```

**401 Unauthorized**:
```json
{
  "error": "Unauthorized"
}
```

**403 Forbidden**:
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found**:
```json
{
  "error": "Promotion package not found or inactive"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

### Payment-Specific Errors

- `"Insufficient wallet balance. Available: X RWF, Required: Y RWF"`
- `"Minimum amount for mtn_momo is 100 RWF"`
- `"Maximum amount for mtn_momo is 500000 RWF"`
- `"Daily limit exceeded for mtn_momo. Remaining: X RWF"`
- `"Monthly limit exceeded for mtn_momo. Remaining: X RWF"`
- `"Payment method mtn_momo is not active"`

### Promotion-Specific Errors

- `"You can only promote your own listings"`
- `"This promotion is already active for this listing"`
- `"Promotion package not found or inactive"`

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Payment endpoints**: 10 requests per minute per user
- **Notification endpoints**: 30 requests per minute per user
- **General endpoints**: 100 requests per minute per user

## Webhook Security

All webhook endpoints verify the authenticity of incoming requests:

1. **MTN Mobile Money**: Signature verification using API secret
2. **Airtel Money**: HMAC validation with client secret
3. **Cryptocurrency**: Transaction validation against blockchain

## Testing

### Test Environment

Use the sandbox environment for testing:

```javascript
// Set environment to sandbox
process.env.NODE_ENV = 'development';

// Test payment initiation
const response = await fetch('/api/payments/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-token'
  },
  body: JSON.stringify({
    user_id: 'test-user-uuid',
    payment_method: 'wallet',
    amount: 5000,
    transaction_type: 'ad_promotion'
  })
});
```

### Mock Data

The system includes mock data for testing:

- **Test users**: Automatically created in development
- **Test listings**: Sample property listings
- **Test payments**: Mock payment responses

## SDK Examples

### JavaScript/TypeScript

```typescript
import { PaymentProcessorFactory } from '@/lib/payment/factory';

// Initiate payment
const paymentResult = await PaymentProcessorFactory.initiatePayment({
  user_id: 'user-uuid',
  payment_method: 'mtn_momo',
  amount: 15000,
  transaction_type: 'ad_promotion',
  phone_number: '+250788123456'
});

// Verify payment
const verification = await PaymentProcessorFactory.verifyPayment(
  'mtn_momo',
  paymentResult.reference
);
```

### cURL Examples

```bash
# Initiate payment
curl -X POST https://your-domain.com/api/payments/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "user_id": "uuid",
    "payment_method": "wallet",
    "amount": 15000,
    "transaction_type": "ad_promotion"
  }'

# Get promotion packages
curl -X GET https://your-domain.com/api/promotions/packages \
  -H "Authorization: Bearer your-jwt-token"

# Get notifications
curl -X GET https://your-domain.com/api/notifications?limit=10 \
  -H "Authorization: Bearer your-jwt-token"
```

---

For more detailed implementation examples and integration guides, refer to the main documentation.
