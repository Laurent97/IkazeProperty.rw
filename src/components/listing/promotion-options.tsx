'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PromotionPackage, 
  PaymentMethod,
  CryptoType
} from '@/types/payment';
import { supabase } from '@/lib/supabase';

interface PromotionOptionsProps {
  listingId: string;
  listingTitle: string;
  onPromotionSelected?: (promotion: PromotionPackage) => void;
  onPromotionSkipped?: () => void;
  onPaymentComplete?: (result: any) => void;
  onPaymentError?: (error: string) => void;
}

export default function PromotionOptions({
  listingId,
  listingTitle,
  onPromotionSelected,
  onPromotionSkipped,
  onPaymentComplete,
  onPaymentError
}: PromotionOptionsProps) {
  const [packages, setPackages] = useState<PromotionPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PromotionPackage | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    loadPromotionPackages();
  }, []);

  const loadPromotionPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('promotion_packages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Failed to load promotion packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg: PromotionPackage) => {
    setSelectedPackage(pkg);
    onPromotionSelected?.(pkg);
  };

  const handlePayment = async (paymentMethod: PaymentMethod, phoneNumber?: string, cryptoType?: CryptoType) => {
    if (!selectedPackage) return;

    setPaymentLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        onPaymentError?.('User not authenticated');
        return;
      }

      const response = await fetch('/api/promotions/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          listing_id: listingId,
          package_id: selectedPackage.id,
          payment_method: paymentMethod,
          phone_number: phoneNumber,
          crypto_type: cryptoType
        })
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
      setPaymentLoading(false);
    }
  };

  const getPackageIcon = (packageName: string) => {
    if (packageName.toLowerCase().includes('urgent')) {
      return '🔥';
    } else if (packageName.toLowerCase().includes('featured')) {
      return '⭐';
    } else if (packageName.toLowerCase().includes('premium')) {
      return '💎';
    }
    return '📈';
  };

  const getPackageColor = (packageName: string) => {
    if (packageName.toLowerCase().includes('urgent')) {
      return 'border-red-200 bg-red-50';
    } else if (packageName.toLowerCase().includes('featured')) {
      return 'border-blue-200 bg-blue-50';
    } else if (packageName.toLowerCase().includes('premium')) {
      return 'border-purple-200 bg-purple-50';
    }
    return 'border-gray-200 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading promotion options...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Boost Your Listing</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get more views and inquiries by promoting your listing. Choose a package that fits your budget and goals.
        </p>
      </div>

      {/* Promotion Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPackage?.id === pkg.id 
                ? 'ring-2 ring-red-500' 
                : getPackageColor(pkg.name)
            }`}
            onClick={() => handlePackageSelect(pkg)}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <span className="text-4xl">{getPackageIcon(pkg.name)}</span>
              </div>
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <p className="text-sm text-gray-600">{pkg.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {pkg.price.toLocaleString()} RWF
                </p>
                <p className="text-sm text-gray-500">
                  for {pkg.duration_days} days
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <p className="text-sm font-medium">What you get:</p>
                <ul className="text-sm space-y-1">
                  {((pkg.features || '[]') as string[]).split(',').filter(Boolean).map((feature: string, index: number) => (
                </ul>
              </div>

              {pkg.sort_order === 3 && (
                <Badge className="w-full justify-center bg-purple-100 text-purple-800">
                  Most Popular
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skip Option */}
      <div className="text-center">
        <button
          onClick={onPromotionSkipped}
          className="text-gray-500 hover:text-gray-700 underline"
        >
          Continue without promotion
        </button>
        <p className="text-sm text-gray-400 mt-1">
          You can always promote this listing later from your dashboard
        </p>
      </div>

      {/* Payment Modal */}
      {selectedPackage && showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span>Package:</span>
                <span className="font-medium">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Duration:</span>
                <span>{selectedPackage.duration_days} days</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-red-600">{selectedPackage.price.toLocaleString()} RWF</span>
              </div>
            </div>

            <PaymentMethodSelection
              amount={selectedPackage.price}
              description={`Promotion: ${selectedPackage.name}`}
              onPaymentMethodSelect={(method, phone) => handlePayment(method, phone)}
              loading={paymentLoading}
            />

            <div className="flex space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="flex-1"
                disabled={paymentLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Package Actions */}
      {selectedPackage && !showPayment && (
        <div className="text-center">
          <Button
            onClick={() => setShowPayment(true)}
            className="bg-red-600 hover:bg-red-700 px-8"
            size="lg"
          >
            Continue with {selectedPackage.name} - {selectedPackage.price.toLocaleString()} RWF
          </Button>
        </div>
      )}
    </div>
  );
}

// Payment Method Selection Component
interface PaymentMethodSelectionProps {
  amount: number;
  description?: string;
  onPaymentMethodSelect: (method: PaymentMethod, phoneNumber?: string, cryptoType?: CryptoType) => void;
  loading: boolean;
}

function PaymentMethodSelection({ 
  amount, 
  description, 
  onPaymentMethodSelect, 
  loading 
}: PaymentMethodSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mtn_momo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('bitcoin');

  const handleContinue = () => {
    if (selectedMethod === 'mtn_momo' || selectedMethod === 'airtel_money') {
      if (!phoneNumber.trim()) {
        alert('Please enter your phone number');
        return;
      }
      onPaymentMethodSelect(selectedMethod, phoneNumber);
      return;
    } else {
      onPaymentMethodSelect(selectedMethod, undefined, selectedMethod === 'crypto' ? selectedCrypto : undefined);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Select Payment Method</h4>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment_method"
            value="mtn_momo"
            checked={selectedMethod === 'mtn_momo'}
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
            className="text-red-600"
          />
          <div className="flex-1">
            <div className="font-medium">MTN Mobile Money</div>
            <div className="text-sm text-gray-600">Fast and secure mobile payment</div>
          </div>
        </label>

        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment_method"
            value="airtel_money"
            checked={selectedMethod === 'airtel_money'}
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
            className="text-red-600"
          />
          <div className="flex-1">
            <div className="font-medium">Airtel Money</div>
            <div className="text-sm text-gray-600">Quick mobile payment option</div>
          </div>
        </label>

        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment_method"
            value="equity_bank"
            checked={selectedMethod === 'equity_bank'}
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
            className="text-red-600"
          />
          <div className="flex-1">
            <div className="font-medium">Bank Transfer</div>
            <div className="text-sm text-gray-600">Direct bank deposit</div>
          </div>
        </label>

        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment_method"
            value="crypto"
            checked={selectedMethod === 'crypto'}
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
            className="text-red-600"
          />
          <div className="flex-1">
            <div className="font-medium">Cryptocurrency</div>
            <div className="text-sm text-gray-600">Bitcoin, Ethereum, or USDT</div>
          </div>
        </label>

        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment_method"
            value="wallet"
            checked={selectedMethod === 'wallet'}
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
            className="text-red-600"
          />
          <div className="flex-1">
            <div className="font-medium">Wallet Balance</div>
            <div className="text-sm text-gray-600">Use your wallet funds</div>
          </div>
        </label>
      </div>

      {(selectedMethod === 'mtn_momo' || selectedMethod === 'airtel_money') && (
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            placeholder="078X XXX XXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>
      )}

      {selectedMethod === 'crypto' && (
        <div>
          <label className="block text-sm font-medium mb-2">Cryptocurrency</label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value as CryptoType)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="bitcoin">Bitcoin (BTC)</option>
            <option value="ethereum">Ethereum (ETH)</option>
            <option value="usdt">USDT</option>
          </select>
        </div>
      )}

      <Button
        onClick={handleContinue}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        {loading ? 'Processing...' : `Pay ${amount.toLocaleString()} RWF`}
      </Button>
    </div>
  );
}
