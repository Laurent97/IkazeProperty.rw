import { supabaseAdmin } from '@/lib/supabase';
import { PaymentProcessorFactory } from '@/lib/payment/factory';

export class CronJobs {
  // Check pending payment transactions every 5 minutes
  static async checkPendingPayments() {
    try {
      const { data: pendingTransactions, error } = await supabaseAdmin
        .from('payment_transactions')
        .select('*')
        .eq('status', 'pending')
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Error fetching pending transactions:', error);
        return;
      }

      for (const transaction of pendingTransactions) {
        // Verify payment status with provider
        const verification = await PaymentProcessorFactory.verifyPayment(
          transaction.payment_method,
          transaction.our_reference
        );

        if (verification.status === 'completed' && transaction.status !== 'completed') {
          // Activate promotion if this was a promotion payment
          await this.activatePromotion(transaction);
        } else if (verification.status === 'failed' && transaction.status !== 'failed') {
          // Mark as failed
          await supabaseAdmin
            .from('payment_transactions')
            .update({ status: 'failed' })
            .eq('id', transaction.id);
        }
      }

      console.log(`Checked ${pendingTransactions?.length || 0} pending payments`);
    } catch (error) {
      console.error('Error in checkPendingPayments:', error);
    }
  }

  // Deactivate expired promotions daily
  static async deactivateExpiredPromotions() {
    try {
      const { data: expiredPromotions, error } = await supabaseAdmin
        .from('listing_promotions')
        .select('*')
        .eq('status', 'active')
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Error fetching expired promotions:', error);
        return;
      }

      for (const promotion of expiredPromotions) {
        await supabaseAdmin
          .from('listing_promotions')
          .update({ status: 'expired' })
          .eq('id', promotion.id);

        console.log(`Deactivated promotion ${promotion.id} for listing ${promotion.listing_id}`);
      }

      console.log(`Deactivated ${expiredPromotions?.length || 0} expired promotions`);
    } catch (error) {
      console.error('Error in deactivateExpiredPromotions:', error);
    }
  }

  // Update crypto exchange rates hourly
  static async updateExchangeRates() {
    try {
      const cryptoTypes = ['BTC', 'ETH', 'USDT'];
      const targetCurrency = 'RWF';

      for (const crypto of cryptoTypes) {
        // Mock exchange rate - in production, integrate with real crypto APIs
        const mockRate = crypto === 'BTC' ? 35000000 : 
                        crypto === 'ETH' ? 2500000 : 
                        3500;

        const { error } = await supabaseAdmin
          .from('exchange_rates')
          .upsert({
            from_currency: crypto,
            to_currency: targetCurrency,
            rate: mockRate,
            source: 'coinbase',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'from_currency,to_currency,source'
          });

        if (error) {
          console.error(`Error updating ${crypto} rate:`, error);
        }
      }

      console.log('Updated crypto exchange rates');
    } catch (error) {
      console.error('Error in updateExchangeRates:', error);
    }
  }

  // Process failed wallet transactions
  static async processFailedTransactions() {
    try {
      const { data: failedTransactions, error } = await supabaseAdmin
        .from('payment_transactions')
        .select('*')
        .eq('status', 'failed')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching failed transactions:', error);
        return;
      }

      for (const transaction of failedTransactions) {
        // Check if wallet balance was locked and needs to be returned
        if (transaction.payment_method === 'wallet') {
          const { data: wallet } = await supabaseAdmin
            .from('user_wallets')
            .select('*')
            .eq('user_id', transaction.user_id)
            .single();

          if (wallet && wallet.locked_balance >= transaction.amount) {
            await supabaseAdmin
              .from('user_wallets')
              .update({
                balance: wallet.balance + transaction.amount,
                locked_balance: wallet.locked_balance - transaction.amount
              })
              .eq('id', wallet.id);

            console.log(`Returned ${transaction.amount} to wallet ${wallet.id}`);
          }
        }
      }

      console.log(`Processed ${failedTransactions?.length || 0} failed transactions`);
    } catch (error) {
      console.error('Error in processFailedTransactions:', error);
    }
  }

  // Generate daily financial reports
  static async generateDailyReports() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's transactions
      const { data: transactions, error } = await supabaseAdmin
        .from('payment_transactions')
        .select('*')
        .eq('status', 'completed')
        .gte('created_at', today);

      if (error) {
        console.error('Error fetching transactions for report:', error);
        return;
      }

      const totalAmount = transactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
      const transactionCount = transactions?.length || 0;

      // Group by payment method
      const byMethod = transactions?.reduce((acc, tx) => {
        acc[tx.payment_method] = (acc[tx.payment_method] || 0) + Number(tx.amount);
        return acc;
      }, {} as Record<string, number>) || {};

      const report = {
        date: today,
        total_amount: totalAmount,
        transaction_count: transactionCount,
        by_payment_method: byMethod,
        generated_at: new Date().toISOString()
      };

      // Store report (you could create a reports table)
      console.log('Daily Financial Report:', JSON.stringify(report, null, 2));

      return report;
    } catch (error) {
      console.error('Error in generateDailyReports:', error);
    }
  }

  // Activate promotion after successful payment
  private static async activatePromotion(transaction: any) {
    try {
      if (transaction.transaction_type === 'ad_promotion' && transaction.listing_id) {
        // Find pending promotion for this transaction
        const { data: promotion } = await supabaseAdmin
          .from('listing_promotions')
          .select('*')
          .eq('payment_transaction_id', transaction.our_reference)
          .eq('status', 'pending')
          .single();

        if (promotion) {
          await supabaseAdmin
            .from('listing_promotions')
            .update({ status: 'active' })
            .eq('id', promotion.id);

          console.log(`Activated promotion ${promotion.id} for listing ${promotion.listing_id}`);
        }
      }
    } catch (error) {
      console.error('Error activating promotion:', error);
    }
  }
}

// API endpoint for manual triggering (for testing)
export async function triggerCronJob(jobName: string) {
  switch (jobName) {
    case 'checkPendingPayments':
      await CronJobs.checkPendingPayments();
      break;
    case 'deactivateExpiredPromotions':
      await CronJobs.deactivateExpiredPromotions();
      break;
    case 'updateExchangeRates':
      await CronJobs.updateExchangeRates();
      break;
    case 'processFailedTransactions':
      await CronJobs.processFailedTransactions();
      break;
    case 'generateDailyReports':
      return await CronJobs.generateDailyReports();
    default:
      throw new Error(`Unknown cron job: ${jobName}`);
  }
}
