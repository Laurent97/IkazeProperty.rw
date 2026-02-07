import { 
  IPaymentProcessor, 
  PaymentInitRequest, 
  PaymentInitResponse,
  PaymentVerificationResponse,
  RefundRequest,
  RefundResponse,
  PaymentTransaction,
  PaymentStatus
} from '@/types/payment';
import { supabaseAdmin } from '@/lib/supabase';

export abstract class BasePaymentProcessor implements IPaymentProcessor {
  protected abstract paymentMethod: string;

  abstract initiatePayment(request: PaymentInitRequest): Promise<PaymentInitResponse>;
  abstract verifyPayment(reference: string): Promise<PaymentVerificationResponse>;
  abstract processWebhook(payload: any): Promise<void>;
  abstract refundPayment(request: RefundRequest): Promise<RefundResponse>;

  protected async createTransaction(request: PaymentInitRequest, providerReference?: string): Promise<PaymentTransaction> {
    const { data, error } = await supabaseAdmin
      .from('payment_transactions')
      .insert({
        user_id: request.user_id,
        listing_id: request.listing_id,
        ad_campaign_id: request.ad_campaign_id,
        payment_method: request.payment_method,
        amount: request.amount,
        currency: request.currency || 'RWF',
        transaction_type: request.transaction_type,
        status: 'pending',
        provider_reference: providerReference,
        description: request.description,
        metadata: request.metadata,
        expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes expiry
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create payment transaction: ${error.message}`);
    }

    return data;
  }

  protected async updateTransactionStatus(
    reference: string, 
    status: PaymentStatus, 
    providerData?: any
  ): Promise<PaymentTransaction> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    if (providerData) {
      updateData.provider_response = providerData;
    }

    const { data, error } = await supabaseAdmin
      .from('payment_transactions')
      .update(updateData)
      .eq('our_reference', reference)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update transaction status: ${error.message}`);
    }

    return data;
  }

  protected async getTransaction(reference: string): Promise<PaymentTransaction | null> {
    const { data, error } = await supabaseAdmin
      .from('payment_transactions')
      .select('*')
      .eq('our_reference', reference)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to get transaction: ${error.message}`);
    }

    return data;
  }

  protected async logWebhook(paymentMethod: string, eventType: string, payload: any): Promise<void> {
    await supabaseAdmin
      .from('payment_webhook_logs')
      .insert({
        payment_method: paymentMethod,
        event_type: eventType,
        payload,
        status: 'received'
      });
  }

  protected async markWebhookProcessed(logId: string, error?: string): Promise<void> {
    await supabaseAdmin
      .from('payment_webhook_logs')
      .update({
        processed: true,
        error_message: error,
        status: error ? 'failed' : 'success'
      })
      .eq('id', logId);
  }

  protected generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `${this.paymentMethod.toUpperCase()}${timestamp}${random}`;
  }

  protected calculateFees(amount: number, feePercent: number, fixedFee: number): number {
    return (amount * feePercent / 100) + fixedFee;
  }

  protected async getPaymentConfig(paymentMethod: string): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('payment_configurations')
      .select('config_data, is_active')
      .eq('payment_method', paymentMethod)
      .single();

    if (error) {
      throw new Error(`Failed to get payment configuration: ${error.message}`);
    }

    if (!data.is_active) {
      throw new Error(`Payment method ${paymentMethod} is not active`);
    }

    return data.config_data;
  }

  protected async getUserWallet(userId: string): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to get user wallet: ${error.message}`);
    }

    return data;
  }

  protected async checkPaymentLimits(
    paymentMethod: string, 
    amount: number, 
    userTier: string = 'basic'
  ): Promise<void> {
    const { data, error } = await supabaseAdmin
      .from('payment_method_limits')
      .select('*')
      .eq('payment_method', paymentMethod)
      .eq('user_tier', userTier)
      .single();

    if (error) {
      throw new Error(`Failed to get payment limits: ${error.message}`);
    }

    if (amount < data.min_amount) {
      throw new Error(`Minimum amount for ${paymentMethod} is ${data.min_amount} RWF`);
    }

    if (amount > data.max_amount) {
      throw new Error(`Maximum amount for ${paymentMethod} is ${data.max_amount} RWF`);
    }

    // Check daily limit
    const today = new Date().toISOString().split('T')[0];
    const { data: todayTransactions } = await supabaseAdmin
      .from('payment_transactions')
      .select('amount')
      .eq('payment_method', paymentMethod)
      .eq('status', 'completed')
      .gte('created_at', today);

    const todayTotal = todayTransactions?.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0) || 0;
    
    if (todayTotal + amount > data.daily_limit) {
      throw new Error(`Daily limit exceeded for ${paymentMethod}. Remaining: ${data.daily_limit - todayTotal} RWF`);
    }

    // Check monthly limit
    const thisMonth = new Date().toISOString().slice(0, 7);
    const { data: monthTransactions } = await supabaseAdmin
      .from('payment_transactions')
      .select('amount')
      .eq('payment_method', paymentMethod)
      .eq('status', 'completed')
      .gte('created_at', thisMonth);

    const monthTotal = monthTransactions?.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0) || 0;
    
    if (monthTotal + amount > data.monthly_limit) {
      throw new Error(`Monthly limit exceeded for ${paymentMethod}. Remaining: ${data.monthly_limit - monthTotal} RWF`);
    }
  }
}
