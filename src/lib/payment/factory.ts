import { 
  PaymentMethod, 
  IPaymentProcessor, 
  PaymentInitRequest, 
  PaymentInitResponse,
  PaymentVerificationResponse,
  RefundRequest,
  RefundResponse
} from '@/types/payment';
import { MTNMobileMoneyProcessor } from './processors/mtn-momo';
import { AirtelMoneyProcessor } from './processors/airtel-money';
import { EquityBankProcessor } from './processors/equity-bank';
import { CryptoPaymentProcessor } from './processors/crypto';
import { WalletPaymentProcessor } from './processors/wallet';

export class PaymentProcessorFactory {
  private static processors: Map<PaymentMethod, IPaymentProcessor> = new Map();

  static createProcessor(method: PaymentMethod): IPaymentProcessor {
    // Check if we already have an instance
    if (this.processors.has(method)) {
      return this.processors.get(method)!;
    }

    let processor: IPaymentProcessor;

    switch (method) {
      case 'mtn_momo':
        processor = new MTNMobileMoneyProcessor();
        break;
      case 'airtel_money':
        processor = new AirtelMoneyProcessor();
        break;
      case 'equity_bank':
        processor = new EquityBankProcessor();
        break;
      case 'crypto':
        processor = new CryptoPaymentProcessor();
        break;
      case 'wallet':
        processor = new WalletPaymentProcessor();
        break;
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }

    // Cache the processor instance
    this.processors.set(method, processor);
    return processor;
  }

  static async initiatePayment(request: PaymentInitRequest): Promise<PaymentInitResponse> {
    const processor = this.createProcessor(request.payment_method);
    return await processor.initiatePayment(request);
  }

  static async verifyPayment(method: PaymentMethod, reference: string): Promise<PaymentVerificationResponse> {
    const processor = this.createProcessor(method);
    return await processor.verifyPayment(reference);
  }

  static async processWebhook(method: PaymentMethod, payload: any): Promise<void> {
    const processor = this.createProcessor(method);
    return await processor.processWebhook(payload);
  }

  static async refundPayment(method: PaymentMethod, request: RefundRequest): Promise<RefundResponse> {
    const processor = this.createProcessor(method);
    return await processor.refundPayment(request);
  }

  static getSupportedMethods(): PaymentMethod[] {
    return ['mtn_momo', 'airtel_money', 'equity_bank', 'crypto', 'wallet'];
  }

  static async isMethodAvailable(method: PaymentMethod): Promise<boolean> {
    try {
      const processor = this.createProcessor(method);
      // You could add a health check method to each processor
      return true;
    } catch (error) {
      console.error(`Payment method ${method} not available:`, error);
      return false;
    }
  }
}
