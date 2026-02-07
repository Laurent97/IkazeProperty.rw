import { BasePaymentProcessor } from '../base-processor';
import { 
  PaymentInitRequest, 
  PaymentInitResponse,
  PaymentVerificationResponse,
  RefundRequest,
  RefundResponse,
  CryptoConfig,
  CryptoType
} from '@/types/payment';
import { supabaseAdmin } from '@/lib/supabase';

export class CryptoPaymentProcessor extends BasePaymentProcessor {
  protected paymentMethod = 'crypto';
  private config: CryptoConfig | null = null;

  private async getConfig(): Promise<CryptoConfig> {
    if (!this.config) {
      this.config = await this.getPaymentConfig('crypto');
    }
    if (!this.config) {
      throw new Error('Crypto configuration not found');
    }
    return this.config;
  }

  private async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const { data, error } = await supabaseAdmin
      .from('exchange_rates')
      .select('rate')
      .eq('from_currency', fromCurrency)
      .eq('to_currency', toCurrency)
      .eq('source', 'coinbase')
      .single();

    if (error) {
      throw new Error(`Failed to get exchange rate: ${error.message}`);
    }

    return data.rate;
  }

  private async convertToCrypto(amountRWF: number, cryptoType: CryptoType): Promise<number> {
    const config = await this.getConfig();
    
    if (config.exchange_rate_provider === 'manual' && config.manual_exchange_rate) {
      // Convert RWF to USD first, then to crypto
      const usdAmount = amountRWF / config.manual_exchange_rate;
      
      switch (cryptoType) {
        case 'bitcoin':
          return usdAmount / 45000; // Approximate BTC price
        case 'ethereum':
          return usdAmount / 2500; // Approximate ETH price
        case 'usdt':
          return usdAmount; // USDT is pegged to USD
        default:
          throw new Error(`Unsupported crypto type: ${cryptoType}`);
      }
    } else {
      // Get real exchange rates
      const usdRate = await this.getExchangeRate('USD', 'RWF');
      const usdAmount = amountRWF / usdRate;
      
      const cryptoRate = await this.getExchangeRate(cryptoType.toUpperCase(), 'USD');
      return usdAmount / cryptoRate;
    }
  }

  private getCryptoWalletAddress(cryptoType: CryptoType): string {
    if (!this.config) {
      throw new Error('Crypto configuration not loaded');
    }

    switch (cryptoType) {
      case 'bitcoin':
        return this.config.bitcoin.wallet_address;
      case 'ethereum':
        return this.config.ethereum.wallet_address;
      case 'usdt':
        return this.config.usdt.wallet_address;
      default:
        throw new Error(`Unsupported crypto type: ${cryptoType}`);
    }
  }

  private generateQRCode(address: string, amount?: number): string {
    // Simple QR code generation - in production, use a proper QR code library
    const qrData = amount ? `${address}?amount=${amount}` : address;
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-size="12">QR Code</text>
      <text x="100" y="120" text-anchor="middle" font-size="8">${address.substring(0, 20)}...</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  async initiatePayment(request: PaymentInitRequest): Promise<PaymentInitResponse> {
    try {
      const config = await this.getConfig();

      if (!request.crypto_type) {
        throw new Error('Crypto type is required for crypto payments');
      }

      if (!config[request.crypto_type].enabled) {
        throw new Error(`${request.crypto_type} payments are not enabled`);
      }

      // Check payment limits
      await this.checkPaymentLimits('crypto', request.amount);

      // Convert RWF amount to crypto
      const cryptoAmount = await this.convertToCrypto(request.amount, request.crypto_type);
      const walletAddress = this.getCryptoWalletAddress(request.crypto_type);

      // Generate reference
      const reference = this.generateReference();

      // Create transaction record
      const transaction = await this.createTransaction(request, reference);

      // Generate QR code
      const qrCodeUrl = this.generateQRCode(walletAddress, cryptoAmount);

      return {
        success: true,
        reference: transaction.our_reference,
        wallet_address: walletAddress,
        crypto_amount: cryptoAmount,
        crypto_currency: request.crypto_type.toUpperCase(),
        qr_code_url: qrCodeUrl,
        exchange_rate: await this.getExchangeRate(request.crypto_type.toUpperCase(), 'RWF'),
        instructions: `Please send ${cryptoAmount} ${request.crypto_type.toUpperCase()} to the provided address`,
        expires_at: transaction.expires_at
      };

    } catch (error: any) {
      console.error('Crypto payment initiation failed:', error);
      return {
        success: false,
        reference: '',
        error: error.message || 'Failed to initiate crypto payment'
      };
    }
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const transaction = await this.getTransaction(reference);

      if (!transaction) {
        return {
          success: false,
          status: 'failed',
          error: 'Transaction not found'
        };
      }

      // Check if expired
      if (transaction.expires_at && new Date() > new Date(transaction.expires_at)) {
        await this.updateTransactionStatus(reference, 'expired');
        return {
          success: false,
          status: 'expired',
          error: 'Transaction has expired'
        };
      }

      // TODO: Implement blockchain monitoring
      // For now, return pending status
      return {
        success: false,
        status: 'pending',
        data: { message: 'Crypto payment verification not yet implemented' }
      };

    } catch (error: any) {
      console.error('Crypto payment verification failed:', error);
      return {
        success: false,
        status: 'failed',
        error: error.message || 'Failed to verify crypto payment'
      };
    }
  }

  async processWebhook(payload: any): Promise<void> {
    try {
      await this.logWebhook('crypto', 'payment_callback', payload);

      // TODO: Implement crypto webhook processing
      console.log('Crypto webhook received:', payload);

    } catch (error: any) {
      console.error('Crypto webhook processing failed:', error);
      throw error;
    }
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      // TODO: Implement crypto refund
      console.log('Crypto refund requested:', request);

      return {
        success: false,
        status: 'failed',
        error: 'Crypto refunds not yet implemented'
      };

    } catch (error: any) {
      console.error('Crypto refund failed:', error);
      return {
        success: false,
        status: 'failed',
        error: error.message || 'Failed to process crypto refund'
      };
    }
  }
}
