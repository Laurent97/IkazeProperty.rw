'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  PaymentMethod, 
  PaymentMethodOption, 
  PaymentSummary, 
  CryptoType,
  UserWallet,
  PromotionPackage
} from '@/types/payment';
import { supabase } from '@/lib/supabase';

interface PaymentSelectionProps {
  amount: number;
  currency?: string;
  transactionType?: string;
  listingId?: string;
  adCampaignId?: string;
  description?: string;
  promotionPackage?: PromotionPackage;
  listingTitle?: string;
  onPaymentComplete?: (transaction: any) => void;
  onPaymentError?: (error: string) => void;
}

export default function PaymentSelection({
  amount,
  currency = 'RWF',
  transactionType,
  listingId,
  adCampaignId,
  description,
  promotionPackage,
  listingTitle,
  onPaymentComplete,
  onPaymentError
}: PaymentSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wallet');
  const [loading, setLoading] = useState(false);
  const [userWallet, setUserWallet] = useState<UserWallet | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('bitcoin');
  const [availableMethods, setAvailableMethods] = useState<PaymentMethodOption[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [methodConfig, setMethodConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    loadAvailableMethods();
    loadUserWallet();
  }, []);

  useEffect(() => {
    calculatePaymentSummary();
  }, [selectedMethod, amount, promotionPackage, methodConfig]);

  useEffect(() => {
    if (selectedMethod === 'crypto') {
      calculateCryptoAmount();
    }
  }, [selectedMethod, selectedCrypto, amount, paymentSummary]);

  useEffect(() => {
    const loadConfig = async () => {
      if (!['equity_bank', 'crypto', 'mtn_momo', 'airtel_money'].includes(selectedMethod)) {
        return;
      }
      try {
        const response = await fetch(`/api/payments/config/${selectedMethod}`);
        const data = await response.json();
        if (response.ok && data?.config) {
          setMethodConfig((prev) => ({ ...prev, [selectedMethod]: data.config }));
        }
      } catch (error) {
        console.error('Failed to load payment config:', error);
      }
    };

    loadConfig();
  }, [selectedMethod]);

  const loadAvailableMethods = async () => {
    try {
      const response = await fetch('/api/payments/methods');
      const data = await response.json();
      if (response.ok && data?.methods) {
        setAvailableMethods(data.methods.filter((m: PaymentMethodOption) => m.isActive));
        return;
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }

    // Fallback to local defaults if API fails
    setAvailableMethods([
      {
        id: 'wallet',
        name: 'wallet',
        displayName: 'Wallet Balance',
        icon: '/icons/wallet.svg',
        description: 'Use your available wallet balance',
        isActive: true
      },
      {
        id: 'mtn_momo',
        name: 'mtn_momo',
        displayName: 'MTN Mobile Money',
        icon: '/icons/mtn-momo.png',
        description: 'Pay with MTN Mobile Money',
        isActive: true,
        requiresPhone: true
      },
      {
        id: 'airtel_money',
        name: 'airtel_money',
        displayName: 'Airtel Money',
        icon: '/icons/airtel-money.png',
        description: 'Pay with Airtel Money',
        isActive: true,
        requiresPhone: true
      },
      {
        id: 'equity_bank',
        name: 'equity_bank',
        displayName: 'Equity Bank',
        icon: '/icons/equity-bank.png',
        description: 'Bank transfer to Equity Bank',
        isActive: true
      },
      {
        id: 'crypto',
        name: 'crypto',
        displayName: 'Cryptocurrency',
        icon: '/icons/crypto.png',
        description: 'Pay with Bitcoin, Ethereum, or USDT',
        isActive: true,
        requiresCryptoSelection: true,
        supportedCryptos: ['bitcoin', 'ethereum', 'usdt']
      }
    ]);
  };

  const loadUserWallet = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: wallet } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setUserWallet(wallet);
      }
    } catch (error) {
      console.error('Failed to load user wallet:', error);
    }
  };

  const calculatePaymentSummary = () => {
    let subtotal = amount;
    if (promotionPackage) {
      subtotal = promotionPackage.price;
    }

    let transactionFee = 0;
    
    if (selectedMethod !== 'wallet') {
      const cfg = methodConfig[selectedMethod] || {};
      const percent = Number(cfg.transaction_fee_percent || 0);
      const fixed = Number(cfg.fixed_fee || 0);
      if (percent || fixed) {
        transactionFee = subtotal * (percent / 100) + fixed;
      } else if (selectedMethod === 'crypto') {
        transactionFee = subtotal * 0.01;
      }
    }

    setPaymentSummary({
      subtotal,
      transactionFee,
      total: subtotal + transactionFee,
      currency,
      paymentMethod: selectedMethod,
      promotionPackage,
      listingTitle
    });
  };

  const calculateCryptoAmount = async () => {
    try {
      const map: Record<CryptoType, string> = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        usdt: 'USDT'
      };

      const response = await fetch(`/api/payments/exchange-rate?from=${map[selectedCrypto]}&to=RWF`);
      const data = await response.json();
      if (!response.ok || !data?.rate) {
        throw new Error(data?.error || 'Exchange rate unavailable');
      }

      const totalRwf = paymentSummary?.total || amount;
      const crypto = totalRwf / Number(data.rate);

      setCryptoAmount(crypto);
      setExchangeRate(Number(data.rate));
    } catch (error) {
      console.error('Failed to calculate crypto amount:', error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        onPaymentError?.('User not authenticated');
        return;
      }

      const paymentRequest = {
        payment_method: selectedMethod,
        amount: paymentSummary?.subtotal || amount,
        currency,
        transaction_type: transactionType || 'payment',
        listing_id: listingId,
        ad_campaign_id: adCampaignId,
        description: description || `Payment for ${transactionType}`,
        metadata: {
          promotion_package_id: promotionPackage?.id,
          listing_title: listingTitle
        },
        phone_number: phoneNumber,
        crypto_type: selectedCrypto
      };

      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(paymentRequest)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onPaymentComplete?.(result);
      } else {
        onPaymentError?.(result.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onPaymentError?.(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const canUseWallet = userWallet && userWallet.balance >= (paymentSummary?.total || amount);
  const equityConfig = methodConfig.equity_bank || {};
  const cryptoConfig = methodConfig.crypto || {};
  const cryptoWallets = {
    bitcoin: cryptoConfig?.bitcoin?.wallet_address,
    ethereum: cryptoConfig?.ethereum?.wallet_address,
    usdt: cryptoConfig?.usdt?.wallet_address
  };

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      {paymentSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {promotionPackage && (
              <div className="flex justify-between">
                <span>Promotion Package:</span>
                <span className="font-medium">{promotionPackage.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{paymentSummary.subtotal.toLocaleString()} {paymentSummary.currency}</span>
            </div>
            {paymentSummary.transactionFee > 0 && (
              <div className="flex justify-between">
                <span>Transaction Fee:</span>
                <span>{paymentSummary.transactionFee.toLocaleString()} {paymentSummary.currency}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-red-600">
                {paymentSummary.total.toLocaleString()} {paymentSummary.currency}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Balance Display */}
      {userWallet && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  {userWallet.balance.toLocaleString()} {userWallet.currency}
                </p>
                {userWallet.locked_balance > 0 && (
                  <p className="text-xs text-gray-500">
                    Pending: {userWallet.locked_balance.toLocaleString()} {userWallet.currency}
                  </p>
                )}
              </div>
              {canUseWallet ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Available
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Insufficient
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {availableMethods.map((method) => (
              <div
                key={method.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!canUseWallet && method.id === 'wallet' ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (method.id !== 'wallet' || canUseWallet) {
                    setSelectedMethod(method.id);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => {}}
                    disabled={!canUseWallet && method.id === 'wallet'}
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <img
                    src={method.icon}
                    alt={method.displayName}
                    className="h-8 w-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{method.displayName}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                  {method.isActive && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  )}
                </div>

                {/* Phone Number Input for Mobile Money */}
                {method.requiresPhone && selectedMethod === method.id && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`${method.id}_phone`}>Phone Number</Label>
                    <Input
                      id={`${method.id}_phone`}
                      type="tel"
                      placeholder="078X XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500">
                      You will receive a payment prompt on your phone
                    </p>
                  </div>
                )}

                {/* Crypto Selection */}
                {method.requiresCryptoSelection && selectedMethod === method.id && (
                  <div className="mt-4 space-y-4">
                    <Label htmlFor="crypto_type">Select Cryptocurrency</Label>
                    <Select value={selectedCrypto} onValueChange={(value: CryptoType) => setSelectedCrypto(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                        <SelectItem value="usdt">USDT</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Amount: </span>
                        {cryptoAmount.toFixed(8)} {selectedCrypto.toUpperCase()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">≈ </span>
                        {amount.toLocaleString()} {currency}
                      </p>
                      <p className="text-xs text-gray-500">
                        Exchange rate: 1 {selectedCrypto.toUpperCase()} ≈ {exchangeRate.toLocaleString()} RWF
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Send to:</Label>
                      <div className="bg-white border p-3 rounded font-mono text-sm">
                        {cryptoWallets[selectedCrypto] || 'Wallet address not configured'}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Copy Address
                      </Button>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Instructions */}
                {method.id === 'equity_bank' && selectedMethod === method.id && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Bank Transfer Instructions</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Bank:</span> Equity Bank Rwanda</p>
                        <p><span className="font-medium">Account Name:</span> {equityConfig.account_name || 'Not configured'}</p>
                        <p><span className="font-medium">Account Number:</span> {equityConfig.account_number || 'Not configured'}</p>
                        <p><span className="font-medium">Reference:</span> IKZ{Date.now()}</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Please include the reference number in your transfer description
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          disabled={loading || !selectedMethod || (selectedMethod === 'wallet' && !canUseWallet)}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          {loading ? 'Processing...' : `Pay ${paymentSummary?.total?.toLocaleString() || amount.toLocaleString()} ${currency}`}
        </Button>
      </div>
    </div>
  );
}
