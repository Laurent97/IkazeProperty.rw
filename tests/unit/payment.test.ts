import { PaymentProcessorFactory } from '@/lib/payment/factory';
import { PaymentInitRequest } from '@/types/payment';

// Mock the factory
jest.mock('@/lib/payment/factory');

describe('PaymentProcessorFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSupportedMethods', () => {
    it('should return all supported payment methods', () => {
      const mockFactory = PaymentProcessorFactory as jest.MockedClass<typeof PaymentProcessorFactory>;
      mockFactory.getSupportedMethods.mockReturnValue([
        'wallet',
        'mtn_momo',
        'airtel_money',
        'equity_bank',
        'crypto'
      ]);

      const methods = PaymentProcessorFactory.getSupportedMethods();
      
      expect(methods).toEqual([
        'wallet',
        'mtn_momo',
        'airtel_money',
        'equity_bank',
        'crypto'
      ]);
      expect(methods).toHaveLength(5);
    });
  });

  describe('initiatePayment', () => {
    it('should initiate payment successfully', async () => {
      const mockFactory = PaymentProcessorFactory as jest.MockedClass<typeof PaymentProcessorFactory>;
      const mockResponse = {
        success: true,
        reference: 'PAY20240207123456',
        instructions: 'Payment initiated successfully'
      };

      mockFactory.initiatePayment.mockResolvedValue(mockResponse);

      const request: PaymentInitRequest = {
        user_id: 'test-user-id',
        payment_method: 'wallet',
        amount: 15000,
        transaction_type: 'ad_promotion'
      };

      const result = await PaymentProcessorFactory.initiatePayment(request);

      expect(PaymentProcessorFactory.initiatePayment).toHaveBeenCalledWith(request);
      expect(result).toEqual(mockResponse);
    });

    it('should handle payment initiation failure', async () => {
      const mockFactory = PaymentProcessorFactory as jest.MockedClass<typeof PaymentProcessorFactory>;
      const mockResponse = {
        success: false,
        reference: '',
        error: 'Insufficient funds'
      };

      mockFactory.initiatePayment.mockResolvedValue(mockResponse);

      const request: PaymentInitRequest = {
        user_id: 'test-user-id',
        payment_method: 'wallet',
        amount: 15000,
        transaction_type: 'ad_promotion'
      };

      const result = await PaymentProcessorFactory.initiatePayment(request);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient funds');
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment successfully', async () => {
      const mockFactory = PaymentProcessorFactory as jest.MockedClass<typeof PaymentProcessorFactory>;
      const mockResponse = {
        success: true,
        status: 'completed',
        data: { transactionId: 'TX123456' }
      };

      mockFactory.verifyPayment.mockResolvedValue(mockResponse);

      const result = await PaymentProcessorFactory.verifyPayment('wallet', 'PAY20240207123456');

      expect(PaymentProcessorFactory.verifyPayment).toHaveBeenCalledWith('wallet', 'PAY20240207123456');
      expect(result).toEqual(mockResponse);
    });
  });
});
