import { BasePaymentProcessor } from '../base-processor';
import { 
  PaymentInitRequest, 
  PaymentInitResponse,
  PaymentVerificationResponse,
  RefundRequest,
  RefundResponse,
  MTNMobileMoneyConfig,
  PaymentStatus
} from '@/types/payment';
import { supabaseAdmin } from '@/lib/supabase';

// Note: Install axios with: npm install axios
// For now, using fetch API instead
// import axios from 'axios';

export class MTNMobileMoneyProcessor extends BasePaymentProcessor {
  protected paymentMethod = 'mtn_momo';
  private config: MTNMobileMoneyConfig | null = null;

  private async getConfig(): Promise<MTNMobileMoneyConfig> {
    if (!this.config) {
      this.config = await this.getPaymentConfig('mtn_momo');
    }
    if (!this.config) {
      throw new Error('MTN Mobile Money configuration not found');
    }
    return this.config;
  }

  async initiatePayment(request: PaymentInitRequest): Promise<PaymentInitResponse> {
    try {
      const config = await this.getConfig();
      
      // Validate phone number
      if (!request.phone_number) {
        throw new Error('Phone number is required for MTN Mobile Money payments');
      }

      // Check payment limits
      await this.checkPaymentLimits('mtn_momo', request.amount);

      // Calculate fees
      const transactionFee = this.calculateFees(
        request.amount, 
        config.transaction_fee_percent, 
        config.fixed_fee
      );
      const totalAmount = request.amount + transactionFee;

      // Generate reference
      const reference = this.generateReference();

      // Create transaction record
      const transaction = await this.createTransaction(request, reference);

      // Call MTN API
      const apiEndpoint = config.environment === 'production' 
        ? 'https://api.mtn.com/v1_0' 
        : 'https://sandbox.mtn.com/v1_0';

      const mtnRequest = {
        amount: totalAmount.toString(),
        currency: request.currency || 'RWF',
        externalId: transaction.our_reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: request.phone_number
        },
        payerMessage: request.description || `Payment for ${request.transaction_type}`,
        payeeNote: `IkazeProperty Payment - ${transaction.our_reference}`
      };

      const response = await fetch(`${apiEndpoint}/requesttopay`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': config.api_key,
          'X-Reference-Id': transaction.our_reference,
          'Content-Type': 'application/json',
          'X-Target-Environment': config.environment
        },
        body: JSON.stringify(mtnRequest)
      });

      const responseData = await response.json();

      // Update transaction with provider reference
      await this.updateTransactionStatus(
        transaction.our_reference, 
        'pending', 
        responseData
      );

      return {
        success: true,
        reference: transaction.our_reference,
        provider_reference: responseData.transactionId || transaction.our_reference,
        instructions: 'Please check your phone for the MTN Mobile Money payment prompt',
        expires_at: transaction.expires_at
      };

    } catch (error: any) {
      console.error('MTN Mobile Money payment initiation failed:', error);
      return {
        success: false,
        reference: '',
        error: error.message || 'Failed to initiate MTN Mobile Money payment'
      };
    }
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const config = await this.getConfig();
      const transaction = await this.getTransaction(reference);

      if (!transaction) {
        return {
          success: false,
          status: 'failed',
          error: 'Transaction not found'
        };
      }

      // If already completed, return current status
      if (transaction.status === 'completed') {
        return {
          success: true,
          status: 'completed',
          data: transaction.provider_response
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

      // Poll MTN API for status
      const apiEndpoint = config.environment === 'production' 
        ? 'https://api.mtn.com/v1_0' 
        : 'https://sandbox.mtn.com/v1_0';

      const response = await fetch(`${apiEndpoint}/requesttopay/${reference}`, {
        headers: {
          'Ocp-Apim-Subscription-Key': config.api_key,
          'X-Target-Environment': config.environment
        }
      });

      const responseData = await response.json();
      const status = responseData.status;

      if (status === 'SUCCESSFUL') {
        await this.updateTransactionStatus(reference, 'completed', responseData);
        return {
          success: true,
          status: 'completed',
          data: responseData
        };
      } else if (status === 'FAILED') {
        await this.updateTransactionStatus(reference, 'failed', responseData);
        return {
          success: false,
          status: 'failed',
          data: responseData
        };
      } else {
        // Still pending
        return {
          success: false,
          status: 'pending',
          data: responseData
        };
      }

    } catch (error: any) {
      console.error('MTN Mobile Money payment verification failed:', error);
      return {
        success: false,
        status: 'failed',
        error: error.message || 'Failed to verify payment'
      };
    }
  }

  async processWebhook(payload: any): Promise<void> {
    try {
      await this.logWebhook('mtn_momo', 'payment_callback', payload);

      const reference = payload.externalId;
      const status = payload.status;

      if (!reference) {
        throw new Error('Missing externalId in webhook payload');
      }

      let paymentStatus: PaymentStatus;

      switch (status) {
        case 'SUCCESSFUL':
          paymentStatus = 'completed';
          break;
        case 'FAILED':
          paymentStatus = 'failed';
          break;
        case 'EXPIRED':
          paymentStatus = 'expired';
          break;
        default:
          paymentStatus = 'pending';
      }

      await this.updateTransactionStatus(reference, paymentStatus, payload);

      // If payment is successful, you might want to trigger additional actions
      if (paymentStatus === 'completed') {
        const transaction = await this.getTransaction(reference);
        if (transaction) {
          // Activate promotion, send confirmation, etc.
          await this.handleSuccessfulPayment(transaction);
        }
      }

    } catch (error: any) {
      console.error('MTN Mobile Money webhook processing failed:', error);
      throw error;
    }
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const config = await this.getConfig();
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

      // Call MTN refund API
      const apiEndpoint = config.environment === 'production' 
        ? 'https://api.mtn.com/v1_0' 
        : 'https://sandbox.mtn.com/v1_0';

      const refundRequest = {
        amount: request.amount || originalTransaction.amount,
        currency: originalTransaction.currency,
        externalId: `REFUND_${this.generateReference()}`,
        payerMessage: `Refund for transaction ${originalTransaction.our_reference}`,
        payeeNote: request.reason
      };

      const response = await fetch(`${apiEndpoint}/refund`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': config.api_key,
          'X-Reference-Id': refundRequest.externalId,
          'Content-Type': 'application/json',
          'X-Target-Environment': config.environment
        },
        body: JSON.stringify(refundRequest)
      });

      const responseData = await response.json();

      // Create refund record
      const { data: refundRecord } = await supabaseAdmin
        .from('payment_refunds')
        .insert({
          original_transaction_id: request.original_transaction_id,
          amount: request.amount || originalTransaction.amount,
          reason: request.reason,
          status: 'pending',
          processed_by: request.processed_by
        })
        .select()
        .single();

      return {
        success: true,
        refund_transaction_id: refundRecord.id,
        status: 'pending'
      };

    } catch (error: any) {
      console.error('MTN Mobile Money refund failed:', error);
      return {
        success: false,
        status: 'failed',
        error: error.message || 'Failed to process refund'
      };
    }
  }

  private async handleSuccessfulPayment(transaction: any): Promise<void> {
    // This method can be extended to handle post-payment actions
    // such as activating promotions, sending notifications, etc.
    console.log('Payment successful:', transaction.our_reference);
    
    // Example: Activate promotion if this was a promotion payment
    if (transaction.transaction_type === 'ad_promotion' && transaction.listing_id) {
      // Implementation would go here
    }
  }
}
