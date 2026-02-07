module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase,
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
// Environment variables with fallbacks for development
const supabaseUrl = ("TURBOPACK compile-time value", "https://swshkufpktnacbotddpb.supabase.co") || 'https://swshkufpktnacbotddpb.supabase.co';
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTE4MzksImV4cCI6MjA4NjAyNzgzOX0.XjlJZscCno-_czhwXqwdSlKgUUpDZty6i37mtwqcnA8") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTE4MzksImV4cCI6MjA4NjAyNzgzOX0.XjlJZscCno-_czhwXqwdSlKgUUpDZty6i37mtwqcnA8';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1MTgzOSwiZXhwIjoyMDg2MDI3ODM5fQ.T_LnaxClQV-ddubCnBnVk0d0lgkmT0GUs1EsD1qVG3U';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceRoleKey);
}),
"[project]/src/lib/payment/base-processor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BasePaymentProcessor",
    ()=>BasePaymentProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
class BasePaymentProcessor {
    async createTransaction(request, providerReference) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_transactions').insert({
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
        }).select().single();
        if (error) {
            throw new Error(`Failed to create payment transaction: ${error.message}`);
        }
        return data;
    }
    async updateTransactionStatus(reference, status, providerData) {
        const updateData = {
            status,
            updated_at: new Date().toISOString()
        };
        if (status === 'completed') {
            updateData.completed_at = new Date().toISOString();
        }
        if (providerData) {
            updateData.provider_response = providerData;
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_transactions').update(updateData).eq('our_reference', reference).select().single();
        if (error) {
            throw new Error(`Failed to update transaction status: ${error.message}`);
        }
        return data;
    }
    async getTransaction(reference) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_transactions').select('*').eq('our_reference', reference).single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Not found
            }
            throw new Error(`Failed to get transaction: ${error.message}`);
        }
        return data;
    }
    async logWebhook(paymentMethod, eventType, payload) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_webhook_logs').insert({
            payment_method: paymentMethod,
            event_type: eventType,
            payload,
            status: 'received'
        });
    }
    async markWebhookProcessed(logId, error) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_webhook_logs').update({
            processed: true,
            error_message: error,
            status: error ? 'failed' : 'success'
        }).eq('id', logId);
    }
    generateReference() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        return `${this.paymentMethod.toUpperCase()}${timestamp}${random}`;
    }
    calculateFees(amount, feePercent, fixedFee) {
        return amount * feePercent / 100 + fixedFee;
    }
    async getPaymentConfig(paymentMethod) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_configurations').select('config_data, is_active').eq('payment_method', paymentMethod).single();
        if (error) {
            throw new Error(`Failed to get payment configuration: ${error.message}`);
        }
        if (!data.is_active) {
            throw new Error(`Payment method ${paymentMethod} is not active`);
        }
        return data.config_data;
    }
    async getUserWallet(userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('user_wallets').select('*').eq('user_id', userId).single();
        if (error) {
            throw new Error(`Failed to get user wallet: ${error.message}`);
        }
        return data;
    }
    async checkPaymentLimits(paymentMethod, amount, userTier = 'basic') {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_method_limits').select('*').eq('payment_method', paymentMethod).eq('user_tier', userTier).single();
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
        const { data: todayTransactions } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_transactions').select('amount').eq('payment_method', paymentMethod).eq('status', 'completed').gte('created_at', today);
        const todayTotal = todayTransactions?.reduce((sum, tx)=>sum + Number(tx.amount), 0) || 0;
        if (todayTotal + amount > data.daily_limit) {
            throw new Error(`Daily limit exceeded for ${paymentMethod}. Remaining: ${data.daily_limit - todayTotal} RWF`);
        }
        // Check monthly limit
        const thisMonth = new Date().toISOString().slice(0, 7);
        const { data: monthTransactions } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_transactions').select('amount').eq('payment_method', paymentMethod).eq('status', 'completed').gte('created_at', thisMonth);
        const monthTotal = monthTransactions?.reduce((sum, tx)=>sum + Number(tx.amount), 0) || 0;
        if (monthTotal + amount > data.monthly_limit) {
            throw new Error(`Monthly limit exceeded for ${paymentMethod}. Remaining: ${data.monthly_limit - monthTotal} RWF`);
        }
    }
}
}),
"[project]/src/lib/payment/processors/mtn-momo.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MTNMobileMoneyProcessor",
    ()=>MTNMobileMoneyProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$base$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/base-processor.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
class MTNMobileMoneyProcessor extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$base$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BasePaymentProcessor"] {
    paymentMethod = 'mtn_momo';
    config = null;
    async getConfig() {
        if (!this.config) {
            this.config = await this.getPaymentConfig('mtn_momo');
        }
        return this.config;
    }
    async initiatePayment(request) {
        try {
            const config = await this.getConfig();
            // Validate phone number
            if (!request.phone_number) {
                throw new Error('Phone number is required for MTN Mobile Money payments');
            }
            // Check payment limits
            await this.checkPaymentLimits('mtn_momo', request.amount);
            // Calculate fees
            const transactionFee = this.calculateFees(request.amount, config.transaction_fee_percent, config.fixed_fee);
            const totalAmount = request.amount + transactionFee;
            // Generate reference
            const reference = this.generateReference();
            // Create transaction record
            const transaction = await this.createTransaction(request, reference);
            // Call MTN API
            const apiEndpoint = config.environment === 'production' ? 'https://api.mtn.com/v1_0' : 'https://sandbox.mtn.com/v1_0';
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
            await this.updateTransactionStatus(transaction.our_reference, 'pending', responseData);
            return {
                success: true,
                reference: transaction.our_reference,
                provider_reference: responseData.transactionId || transaction.our_reference,
                instructions: 'Please check your phone for the MTN Mobile Money payment prompt',
                expires_at: transaction.expires_at
            };
        } catch (error) {
            console.error('MTN Mobile Money payment initiation failed:', error);
            return {
                success: false,
                reference: '',
                error: error.message || 'Failed to initiate MTN Mobile Money payment'
            };
        }
    }
    async verifyPayment(reference) {
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
            const apiEndpoint = config.environment === 'production' ? 'https://api.mtn.com/v1_0' : 'https://sandbox.mtn.com/v1_0';
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
        } catch (error) {
            console.error('MTN Mobile Money payment verification failed:', error);
            return {
                success: false,
                status: 'failed',
                error: error.message || 'Failed to verify payment'
            };
        }
    }
    async processWebhook(payload) {
        try {
            await this.logWebhook('mtn_momo', 'payment_callback', payload);
            const reference = payload.externalId;
            const status = payload.status;
            if (!reference) {
                throw new Error('Missing externalId in webhook payload');
            }
            let paymentStatus;
            switch(status){
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
        } catch (error) {
            console.error('MTN Mobile Money webhook processing failed:', error);
            throw error;
        }
    }
    async refundPayment(request) {
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
            const apiEndpoint = config.environment === 'production' ? 'https://api.mtn.com/v1_0' : 'https://sandbox.mtn.com/v1_0';
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
            const { data: refundRecord } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_refunds').insert({
                original_transaction_id: request.original_transaction_id,
                amount: request.amount || originalTransaction.amount,
                reason: request.reason,
                status: 'pending',
                processed_by: request.processed_by
            }).select().single();
            return {
                success: true,
                refund_transaction_id: refundRecord.id,
                status: 'pending'
            };
        } catch (error) {
            console.error('MTN Mobile Money refund failed:', error);
            return {
                success: false,
                status: 'failed',
                error: error.message || 'Failed to process refund'
            };
        }
    }
    async handleSuccessfulPayment(transaction) {
        // This method can be extended to handle post-payment actions
        // such as activating promotions, sending notifications, etc.
        console.log('Payment successful:', transaction.our_reference);
        // Example: Activate promotion if this was a promotion payment
        if (transaction.transaction_type === 'ad_promotion' && transaction.listing_id) {
        // Implementation would go here
        }
    }
}
}),
"[project]/src/lib/payment/processors/airtel-money.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AirtelMoneyProcessor",
    ()=>AirtelMoneyProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$base$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/base-processor.ts [app-route] (ecmascript)");
;
class AirtelMoneyProcessor extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$base$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BasePaymentProcessor"] {
    paymentMethod = 'airtel_money';
    config = null;
    async getConfig() {
        if (!this.config) {
            this.config = await this.getPaymentConfig('airtel_money');
        }
        return this.config;
    }
    async initiatePayment(request) {
        try {
            const config = await this.getConfig();
            // Validate phone number
            if (!request.phone_number) {
                throw new Error('Phone number is required for Airtel Money payments');
            }
            // Check payment limits
            await this.checkPaymentLimits('airtel_money', request.amount);
            // Calculate fees
            const transactionFee = this.calculateFees(request.amount, config.transaction_fee_percent, config.fixed_fee);
            const totalAmount = request.amount + transactionFee;
            // Generate reference
            const reference = this.generateReference();
            // Create transaction record
            const transaction = await this.createTransaction(request, reference);
            // TODO: Implement Airtel Money API integration
            // For now, return a mock response
            console.log('Airtel Money payment initiated:', {
                reference,
                amount: totalAmount,
                phone: request.phone_number
            });
            return {
                success: true,
                reference: transaction.our_reference,
                provider_reference: reference,
                instructions: 'Please check your phone for the Airtel Money payment prompt',
                expires_at: transaction.expires_at
            };
        } catch (error) {
            console.error('Airtel Money payment initiation failed:', error);
            return {
                success: false,
                reference: '',
                error: error.message || 'Failed to initiate Airtel Money payment'
            };
        }
    }
    async verifyPayment(reference) {
        try {
            const transaction = await this.getTransaction(reference);
            if (!transaction) {
                return {
                    success: false,
                    status: 'failed',
                    error: 'Transaction not found'
                };
            }
            // TODO: Implement Airtel Money verification
            // For now, return pending status
            return {
                success: false,
                status: 'pending',
                data: {
                    message: 'Airtel Money verification not yet implemented'
                }
            };
        } catch (error) {
            console.error('Airtel Money payment verification failed:', error);
            return {
                success: false,
                status: 'failed',
                error: error.message || 'Failed to verify payment'
            };
        }
    }
    async processWebhook(payload) {
        try {
            await this.logWebhook('airtel_money', 'payment_callback', payload);
            // TODO: Implement Airtel Money webhook processing
            console.log('Airtel Money webhook received:', payload);
        } catch (error) {
            console.error('Airtel Money webhook processing failed:', error);
            throw error;
        }
    }
    async refundPayment(request) {
        try {
            // TODO: Implement Airtel Money refund
            console.log('Airtel Money refund requested:', request);
            return {
                success: false,
                status: 'failed',
                error: 'Airtel Money refunds not yet implemented'
            };
        } catch (error) {
            console.error('Airtel Money refund failed:', error);
            return {
                success: false,
                status: 'failed',
                error: error.message || 'Failed to process refund'
            };
        }
    }
}
}),
"[project]/src/lib/payment/processors/equity-bank.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EquityBankProcessor",
    ()=>EquityBankProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$base$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/base-processor.ts [app-route] (ecmascript)");
;
class EquityBankProcessor extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$base$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BasePaymentProcessor"] {
    paymentMethod = 'equity_bank';
    config = null;
    async getConfig() {
        if (!this.config) {
            this.config = await this.getPaymentConfig('equity_bank');
        }
        return this.config;
    }
    async initiatePayment(request) {
        try {
            const config = await this.getConfig();
            // Check payment limits
            await this.checkPaymentLimits('equity_bank', request.amount);
            // Calculate fees
            const transactionFee = this.calculateFees(request.amount, config.transaction_fee_percent, config.fixed_fee);
            const totalAmount = request.amount + transactionFee;
            // Generate reference
            const reference = this.generateReference();
            // Create transaction record
            const transaction = await this.createTransaction(request, reference);
            // TODO: Implement Equity Bank API integration
            // For now, return bank transfer instructions
            console.log('Equity Bank payment initiated:', {
                reference,
                amount: totalAmount,
                account: config.account_number
            });
            return {
                success: true,
                reference: transaction.our_reference,
                provider_reference: reference,
                instructions: `Please transfer ${totalAmount} RWF to Equity Bank account ${config.account_number} (${config.account_name}). Reference: ${transaction.our_reference}`,
                expires_at: transaction.expires_at
            };
        } catch (error) {
            console.error('Equity Bank payment initiation failed:', error);
            return {
                success: false,
                reference: '',
                error: error.message || 'Failed to initiate Equity Bank payment'
            };
        }
    }
    async verifyPayment(reference) {
        try {
            const transaction = await this.getTransaction(reference);
            if (!transaction) {
                return {
                    success: false,
                    status: 'failed',
                    error: 'Transaction not found'
                };
            }
            // TODO: Implement Equity Bank verification
            // For now, return pending status
            return {
                success: false,
                status: 'pending',
                data: {
                    message: 'Equity Bank verification not yet implemented'
                }
            };
        } catch (error) {
            console.error('Equity Bank payment verification failed:', error);
            return {
                success: false,
                status: 'failed',
                error: error.message || 'Failed to verify payment'
            };
        }
    }
    async processWebhook(payload) {
        try {
            await this.logWebhook('equity_bank', 'payment_callback', payload);
            // TODO: Implement Equity Bank webhook processing
            console.log('Equity Bank webhook received:', payload);
        } catch (error) {
            console.error('Equity Bank webhook processing failed:', error);
            throw error;
        }
    }
    async refundPayment(request) {
        try {
            // TODO: Implement Equity Bank refund
            console.log('Equity Bank refund requested:', request);
            return {
                success: false,
                status: 'failed',
                error: 'Equity Bank refunds not yet implemented'
            };
        } catch (error) {
            console.error('Equity Bank refund failed:', error);
            return {
                success: false,
                status: 'failed',
                error: error.message || 'Failed to process refund'
            };
        }
    }
}
}),
"[project]/src/lib/payment/processors/crypto.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CryptoPaymentProcessor",
    ()=>CryptoPaymentProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$base$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/base-processor.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
class CryptoPaymentProcessor extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$base$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BasePaymentProcessor"] {
    paymentMethod = 'crypto';
    config = null;
    async getConfig() {
        if (!this.config) {
            this.config = await this.getPaymentConfig('crypto');
        }
        return this.config;
    }
    async getExchangeRate(fromCurrency, toCurrency) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('exchange_rates').select('rate').eq('from_currency', fromCurrency).eq('to_currency', toCurrency).eq('source', 'coinbase').single();
        if (error) {
            throw new Error(`Failed to get exchange rate: ${error.message}`);
        }
        return data.rate;
    }
    async convertToCrypto(amountRWF, cryptoType) {
        const config = await this.getConfig();
        if (config.exchange_rate_provider === 'manual' && config.manual_exchange_rate) {
            // Convert RWF to USD first, then to crypto
            const usdAmount = amountRWF / config.manual_exchange_rate;
            switch(cryptoType){
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
    getCryptoWalletAddress(cryptoType) {
        if (!this.config) {
            throw new Error('Crypto configuration not loaded');
        }
        switch(cryptoType){
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
    generateQRCode(address, amount) {
        // Simple QR code generation - in production, use a proper QR code library
        const qrData = amount ? `${address}?amount=${amount}` : address;
        const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-size="12">QR Code</text>
      <text x="100" y="120" text-anchor="middle" font-size="8">${address.substring(0, 20)}...</text>
    </svg>`;
        return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    }
    async initiatePayment(request) {
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
                amount: cryptoAmount,
                currency: request.crypto_type.toUpperCase(),
                qr_code_url: qrCodeUrl,
                exchange_rate: await this.getExchangeRate(request.crypto_type.toUpperCase(), 'RWF'),
                instructions: `Please send ${cryptoAmount} ${request.crypto_type.toUpperCase()} to the provided address`,
                expires_at: transaction.expires_at
            };
        } catch (error) {
            console.error('Crypto payment initiation failed:', error);
            return {
                success: false,
                reference: '',
                error: error.message || 'Failed to initiate crypto payment'
            };
        }
    }
    async verifyPayment(reference) {
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
                data: {
                    message: 'Crypto payment verification not yet implemented'
                }
            };
        } catch (error) {
            console.error('Crypto payment verification failed:', error);
            return {
                success: false,
                status: 'failed',
                error: error.message || 'Failed to verify crypto payment'
            };
        }
    }
    async processWebhook(payload) {
        try {
            await this.logWebhook('crypto', 'payment_callback', payload);
            // TODO: Implement crypto webhook processing
            console.log('Crypto webhook received:', payload);
        } catch (error) {
            console.error('Crypto webhook processing failed:', error);
            throw error;
        }
    }
    async refundPayment(request) {
        try {
            // TODO: Implement crypto refund
            console.log('Crypto refund requested:', request);
            return {
                success: false,
                status: 'failed',
                error: 'Crypto refunds not yet implemented'
            };
        } catch (error) {
            console.error('Crypto refund failed:', error);
            return {
                success: false,
                status: 'failed',
                error: error.message || 'Failed to process crypto refund'
            };
        }
    }
}
}),
"[project]/src/lib/payment/processors/wallet.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WalletPaymentProcessor",
    ()=>WalletPaymentProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$base$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/base-processor.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
class WalletPaymentProcessor extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$base$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BasePaymentProcessor"] {
    paymentMethod = 'wallet';
    async initiatePayment(request) {
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
        } catch (error) {
            console.error('Wallet payment initiation failed:', error);
            return {
                success: false,
                reference: '',
                error: error.message || 'Failed to process wallet payment'
            };
        }
    }
    async verifyPayment(reference) {
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
        } catch (error) {
            console.error('Wallet payment verification failed:', error);
            return {
                success: false,
                status: 'failed',
                error: error.message || 'Failed to verify wallet payment'
            };
        }
    }
    async processWebhook(payload) {
        // Wallet payments don't typically use webhooks since they're processed synchronously
        console.log('Wallet webhook received (unexpected):', payload);
    }
    async refundPayment(request) {
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
            const { data: refundRecord } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_refunds').insert({
                original_transaction_id: request.original_transaction_id,
                refund_transaction_id: refundTransaction.id,
                amount: request.amount || originalTransaction.amount,
                reason: request.reason,
                status: 'completed',
                processed_by: request.processed_by,
                processed_at: new Date().toISOString()
            }).select().single();
            return {
                success: true,
                refund_transaction_id: refundRecord.id,
                status: 'completed'
            };
        } catch (error) {
            console.error('Wallet refund failed:', error);
            return {
                success: false,
                status: 'failed',
                error: error.message || 'Failed to process wallet refund'
            };
        }
    }
}
}),
"[project]/src/lib/payment/factory.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PaymentProcessorFactory",
    ()=>PaymentProcessorFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$processors$2f$mtn$2d$momo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/processors/mtn-momo.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$processors$2f$airtel$2d$money$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/processors/airtel-money.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$processors$2f$equity$2d$bank$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/processors/equity-bank.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$processors$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/processors/crypto.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$processors$2f$wallet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/processors/wallet.ts [app-route] (ecmascript)");
;
;
;
;
;
class PaymentProcessorFactory {
    static processors = new Map();
    static createProcessor(method) {
        // Check if we already have an instance
        if (this.processors.has(method)) {
            return this.processors.get(method);
        }
        let processor;
        switch(method){
            case 'mtn_momo':
                processor = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$processors$2f$mtn$2d$momo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MTNMobileMoneyProcessor"]();
                break;
            case 'airtel_money':
                processor = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$processors$2f$airtel$2d$money$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AirtelMoneyProcessor"]();
                break;
            case 'equity_bank':
                processor = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$processors$2f$equity$2d$bank$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EquityBankProcessor"]();
                break;
            case 'crypto':
                processor = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$processors$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CryptoPaymentProcessor"]();
                break;
            case 'wallet':
                processor = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$processors$2f$wallet$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WalletPaymentProcessor"]();
                break;
            default:
                throw new Error(`Unsupported payment method: ${method}`);
        }
        // Cache the processor instance
        this.processors.set(method, processor);
        return processor;
    }
    static async initiatePayment(request) {
        const processor = this.createProcessor(request.payment_method);
        return await processor.initiatePayment(request);
    }
    static async verifyPayment(method, reference) {
        const processor = this.createProcessor(method);
        return await processor.verifyPayment(reference);
    }
    static async processWebhook(method, payload) {
        const processor = this.createProcessor(method);
        return await processor.processWebhook(payload);
    }
    static async refundPayment(method, request) {
        const processor = this.createProcessor(method);
        return await processor.refundPayment(request);
    }
    static getSupportedMethods() {
        return [
            'mtn_momo',
            'airtel_money',
            'equity_bank',
            'crypto',
            'wallet'
        ];
    }
    static async isMethodAvailable(method) {
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
}),
"[project]/src/app/api/payments/methods/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$factory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payment/factory.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
;
async function GET() {
    try {
        // Get supported payment methods
        const supportedMethods = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payment$2f$factory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PaymentProcessorFactory"].getSupportedMethods();
        // Get payment configurations to check active status
        const { data: configurations } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('payment_configurations').select('payment_method, is_active').in('payment_method', supportedMethods);
        const paymentMethodOptions = [
            {
                id: 'wallet',
                name: 'Wallet Balance',
                displayName: 'Wallet Balance',
                icon: '/icons/wallet.svg',
                description: 'Pay using your wallet balance',
                isActive: configurations?.find((c)=>c.payment_method === 'wallet')?.is_active ?? true,
                requiresPhone: false,
                requiresCryptoSelection: false
            },
            {
                id: 'mtn_momo',
                name: 'MTN Mobile Money',
                displayName: 'MTN Mobile Money',
                icon: '/icons/mtn-momo.png',
                description: 'Pay with MTN Mobile Money',
                isActive: configurations?.find((c)=>c.payment_method === 'mtn_momo')?.is_active ?? false,
                requiresPhone: true,
                requiresCryptoSelection: false
            },
            {
                id: 'airtel_money',
                name: 'Airtel Money',
                displayName: 'Airtel Money',
                icon: '/icons/airtel-money.png',
                description: 'Pay with Airtel Money',
                isActive: configurations?.find((c)=>c.payment_method === 'airtel_money')?.is_active ?? false,
                requiresPhone: true,
                requiresCryptoSelection: false
            },
            {
                id: 'equity_bank',
                name: 'Equity Bank',
                displayName: 'Equity Bank',
                icon: '/icons/equity-bank.png',
                description: 'Pay with Equity Bank account',
                isActive: configurations?.find((c)=>c.payment_method === 'equity_bank')?.is_active ?? false,
                requiresPhone: false,
                requiresCryptoSelection: false
            },
            {
                id: 'crypto',
                name: 'Cryptocurrency',
                displayName: 'Cryptocurrency',
                icon: '/icons/crypto.png',
                description: 'Pay with Bitcoin, Ethereum, or USDT',
                isActive: configurations?.find((c)=>c.payment_method === 'crypto')?.is_active ?? false,
                requiresPhone: false,
                requiresCryptoSelection: true,
                supportedCryptos: [
                    'bitcoin',
                    'ethereum',
                    'usdt'
                ]
            }
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            methods: paymentMethodOptions,
            supported: supportedMethods
        });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c21aa25a._.js.map