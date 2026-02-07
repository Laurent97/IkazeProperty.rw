import { BasePaymentProcessor } from '../base-processor';
import { 
  PaymentInitRequest, 
  PaymentInitResponse,
  PaymentVerificationResponse,
  RefundRequest,
  RefundResponse,
  PaymentStatus
} from '@/types/payment';
import { supabaseAdmin } from '@/lib/supabase';

export class WalletPaymentProcessor extends BasePaymentProcessor {
  protected paymentMethod = 'wallet';

  async initiatePayment(request: PaymentInitRequest): Promise<PaymentInitResponse> {
    try {
      // Get user wallet
      const wallet = await this.getUserWallet(request.user_id);

      // Check if user has sufficient balance
      if (wallet.balance < request.amount) {
        return {
          success: false,
          reference: '',
          error: `Insufficient wallet balance. Available: ${wallet.balance} RWF, Required: ${request.amount} RWF`
        };
      }

      // Create transaction record
      const transaction = await this.createTransaction(request);

      // Process wallet payment immediately
      await this.updateTransactionStatus(transaction.our_reference, 'completed');

      return {
        success: true,
        reference: transaction.our_reference,
        instructions: 'Payment completed successfully using wallet balance'
      };

    } catch (error: any) {
      console.error('Wallet payment initiation failed:', error);
      return {
        success: false,
        reference: '',
        error: error.message || 'Failed to process wallet payment'
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

      return {
        success: true,
        status: transaction.status,
        data: transaction
      };

    } catch (error: any) {
      console.error('Wallet payment verification failed:', error);
      return {
        success: false,
        status: 'failed',
        error: error.message || 'Failed to verify wallet payment'
      };
    }
  }

  async processWebhook(payload: any): Promise<void> {
    // Wallet payments don't typically use webhooks since they're processed synchronously
    console.log('Wallet webhook received (unexpected):', payload);
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const originalTransaction = await this.getTransaction(request.original_transaction_id);

      if (!originalTransaction) {
        return {
          success: false,
          status: 'failed',
          error: 'Original transaction not found'
        };
      }

      if (originalTransaction.status !== 'completed') {
        return {
          success: false,
          status: 'failed',
          error: 'Cannot refund a non-completed transaction'
        };
      }

      // Create refund transaction
      const refundTransaction = await this.createTransaction({
        user_id: originalTransaction.user_id,
        payment_method: 'wallet',
        amount: request.amount || originalTransaction.amount,
        currency: originalTransaction.currency,
        transaction_type: 'refund',
        description: `Refund for transaction ${originalTransaction.our_reference}: ${request.reason}`,
        metadata: {
          original_transaction_id: originalTransaction.id,
          refund_reason: request.reason
        }
      });

      // Process refund immediately
      await this.updateTransactionStatus(refundTransaction.our_reference, 'completed');

      // Create refund record
      const { data: refundRecord } = await supabaseAdmin
        .from('payment_refunds')
        .insert({
          original_transaction_id: request.original_transaction_id,
          refund_transaction_id: refundTransaction.id,
          amount: request.amount || originalTransaction.amount,
          reason: request.reason,
          status: 'completed',
          processed_by: request.processed_by,
          processed_at: new Date().toISOString()
        })
        .select()
        .single();

      return {
        success: true,
        refund_transaction_id: refundRecord.id,
        status: 'completed'
      };

    } catch (error: any) {
      console.error('Wallet refund failed:', error);
      return {
        success: false,
        status: 'failed',
        error: error.message || 'Failed to process wallet refund'
      };
    }
  }
}
