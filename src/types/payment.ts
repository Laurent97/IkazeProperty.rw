export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'equity_bank' | 'crypto' | 'wallet';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'expired';
export type WalletTransactionType = 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'lock' | 'unlock';
export type CryptoType = 'bitcoin' | 'ethereum' | 'usdt';

// Payment Configuration Interfaces
export interface MTNMobileMoneyConfig {
  is_active: boolean;
  merchant_name: string;
  merchant_code: string;
  api_key: string;
  api_secret: string;
  phone_number: string;
  environment: 'sandbox' | 'production';
  callback_url: string;
  transaction_fee_percent: number;
  fixed_fee: number;
  min_amount: number;
  max_amount: number;
}

export interface AirtelMoneyConfig {
  is_active: boolean;
  client_id: string;
  client_secret: string;
  merchant_msisdn: string;
  country: string;
  currency: string;
  pin: string;
  transaction_fee_percent: number;
  fixed_fee: number;
  min_amount: number;
  max_amount: number;
}

export interface EquityBankConfig {
  is_active: boolean;
  api_endpoint: string;
  merchant_id: string;
  terminal_id: string;
  encryption_key: string;
  account_number: string;
  account_name: string;
  transaction_fee_percent: number;
  fixed_fee: number;
  min_amount: number;
  max_amount: number;
}

export interface CryptoConfig {
  is_active: boolean;
  bitcoin: {
    enabled: boolean;
    network_fee: number;
    confirmation_required: number;
    wallet_address: string;
  };
  ethereum: {
    enabled: boolean;
    network_fee: number;
    confirmation_required: number;
    wallet_address: string;
  };
  usdt: {
    enabled: boolean;
    network: 'ERC20' | 'TRC20';
    wallet_address: string;
  };
  exchange_rate_provider: 'coinbase' | 'binance' | 'manual';
  manual_exchange_rate?: number;
}

export interface PaymentMethodConfig {
  mtn_momo: MTNMobileMoneyConfig;
  airtel_money: AirtelMoneyConfig;
  equity_bank: EquityBankConfig;
  crypto: CryptoConfig;
}

// Payment Transaction Interfaces
export interface PaymentTransaction {
  id: string;
  user_id: string;
  listing_id?: string;
  ad_campaign_id?: string;
  payment_method: PaymentMethod;
  amount: number;
  currency: string;
  transaction_type?: string;
  status: PaymentStatus;
  provider_reference?: string;
  our_reference: string;
  provider_response?: any;
  callback_data?: any;
  description?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  expires_at?: string;
}

export interface PaymentInitRequest {
  user_id: string;
  payment_method: PaymentMethod;
  amount: number;
  currency?: string;
  transaction_type?: string;
  listing_id?: string;
  ad_campaign_id?: string;
  description?: string;
  metadata?: any;
  phone_number?: string; // For mobile money
  crypto_type?: CryptoType; // For crypto payments
}

export interface PaymentInitResponse {
  success: boolean;
  reference: string;
  provider_reference?: string;
  instructions?: string;
  expires_at?: string;
  wallet_address?: string;
  crypto_amount?: number;
  crypto_currency?: string;
  qr_code_url?: string;
  exchange_rate?: number;
  error?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  status: PaymentStatus;
  data?: any;
  confirmations?: number;
  error?: string;
}

export interface RefundRequest {
  payment_method: PaymentMethod;
  original_transaction_id: string;
  amount?: number;
  reason: string;
  processed_by?: string;
}

export interface RefundResponse {
  success: boolean;
  refund_transaction_id?: string;
  status: string;
  error?: string;
}

// Wallet Interfaces
export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  locked_balance: number;
  currency: string;
  btc_address?: string;
  eth_address?: string;
  usdt_address?: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  transaction_type: WalletTransactionType;
  amount: number;
  previous_balance: number;
  new_balance: number;
  reference?: string;
  description?: string;
  metadata?: any;
  created_at: string;
}

export interface WalletTopUpRequest {
  user_id: string;
  amount: number;
  payment_method: PaymentMethod;
  description?: string;
  metadata?: any;
}

// Promotion Interfaces
export interface PromotionPackage {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ListingPromotion {
  id: string;
  listing_id: string;
  package_id: string;
  payment_transaction_id?: string;
  status: 'active' | 'expired' | 'cancelled';
  starts_at: string;
  expires_at: string;
  views_before_promotion: number;
  views_during_promotion: number;
  inquiries_before_promotion: number;
  inquiries_during_promotion: number;
  created_at: string;
  updated_at: string;
}

export interface PromotionRequest {
  listing_id: string;
  package_id: string;
  payment_method: PaymentMethod;
  phone_number?: string;
  crypto_type?: CryptoType;
}

// Exchange Rate Interfaces
export interface ExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  source: string;
  updated_at: string;
}

// Payment Method Limits
export interface PaymentMethodLimit {
  id: string;
  payment_method: PaymentMethod;
  user_tier: 'basic' | 'verified' | 'premium';
  min_amount: number;
  max_amount: number;
  daily_limit: number;
  monthly_limit: number;
  transaction_fee_percent: number;
  fixed_fee: number;
  created_at: string;
  updated_at: string;
}

// Webhook Interfaces
export interface PaymentWebhookLog {
  id: string;
  payment_method: PaymentMethod;
  event_type: string;
  payload: any;
  status: string;
  processed: boolean;
  error_message?: string;
  created_at: string;
}

// Payment Processor Interface
export interface IPaymentProcessor {
  initiatePayment(request: PaymentInitRequest): Promise<PaymentInitResponse>;
  verifyPayment(reference: string): Promise<PaymentVerificationResponse>;
  processWebhook(payload: any): Promise<void>;
  refundPayment(request: RefundRequest): Promise<RefundResponse>;
}

// Payment Configuration Database Record
export interface PaymentConfigurationRecord {
  id: string;
  payment_method: PaymentMethod;
  is_active: boolean;
  config_data: any;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

// Payment Method Selection for UI
export interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  displayName: string;
  icon: string;
  description: string;
  isActive: boolean;
  requiresPhone?: boolean;
  requiresCryptoSelection?: boolean;
  supportedCryptos?: CryptoType[];
}

// Payment Summary for UI
export interface PaymentSummary {
  subtotal: number;
  transactionFee: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod;
  promotionPackage?: PromotionPackage;
  listingTitle?: string;
}

// Transaction History Filters
export interface TransactionFilters {
  payment_method?: PaymentMethod;
  status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  transaction_type?: string;
  limit?: number;
  offset?: number;
}

// Payment Analytics
export interface PaymentAnalytics {
  totalRevenue: number;
  transactionCount: number;
  averageTransactionValue: number;
  successRate: number;
  methodBreakdown: Record<PaymentMethod, {
    count: number;
    revenue: number;
    successRate: number;
  }>;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
}

// Compliance Interfaces
export interface ComplianceCheck {
  allowed: boolean;
  reason?: string;
  requiresVerification?: boolean;
  requiresKyc?: boolean;
}

export interface ComplianceReport {
  largeTransactions: PaymentTransaction[];
  suspiciousActivities: any[];
  userVerifications: any[];
  generatedAt: string;
}
