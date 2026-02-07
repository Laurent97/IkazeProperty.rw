'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  UserWallet, 
  WalletTransaction, 
  WalletTransactionType,
  PaymentMethod,
  PaymentInitRequest
} from '@/types/payment';
import { supabase } from '@/lib/supabase';

export default function WalletDashboard() {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadWalletData();
  }, []);

  useEffect(() => {
    if (wallet) {
      loadTransactions();
    }
  }, [wallet, filterType, filterDate]);

  const loadWalletData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load wallet
      const { data: walletData } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setWallet(walletData);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!wallet) return;

    try {
      let query = supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filterType !== 'all') {
        query = query.eq('transaction_type', filterType);
      }

      if (filterDate) {
        query = query.gte('created_at', filterDate);
      }

      const { data: transactionsData } = await query;
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setTopUpLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert('User not authenticated');
        return;
      }

      const paymentRequest: PaymentInitRequest = {
        user_id: session.user.id,
        payment_method: selectedPaymentMethod,
        amount: parseFloat(topUpAmount),
        transaction_type: 'wallet_topup',
        description: 'Wallet top-up',
        phone_number: phoneNumber
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
        alert('Payment initiated successfully! Please complete the payment.');
        setShowTopUpModal(false);
        setTopUpAmount('');
        setPhoneNumber('');
        // Reload wallet after a delay
        setTimeout(loadWalletData, 5000);
      } else {
        alert(`Payment failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Top-up error:', error);
      alert(`Top-up failed: ${error.message}`);
    } finally {
      setTopUpLoading(false);
    }
  };

  const getTransactionIcon = (type: WalletTransactionType) => {
    switch (type) {
      case 'deposit':
        return '📥';
      case 'withdrawal':
        return '📤';
      case 'payment':
        return '💳';
      case 'refund':
        return '💰';
      case 'lock':
        return '🔒';
      case 'unlock':
        return '🔓';
      default:
        return '📄';
    }
  };

  const getTransactionColor = (type: WalletTransactionType) => {
    switch (type) {
      case 'deposit':
      case 'unlock':
        return 'text-green-600';
      case 'withdrawal':
      case 'payment':
      case 'lock':
        return 'text-red-600';
      case 'refund':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatAmount = (amount: number, type: WalletTransactionType) => {
    const sign = (type === 'deposit' || type === 'refund' || type === 'unlock') ? '+' : '-';
    return `${sign}${Math.abs(amount).toLocaleString()} RWF`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading wallet data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">My Wallet</h1>

      {/* Wallet Balance Card */}
      {wallet && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-3xl font-bold text-green-600">
                  {wallet.balance.toLocaleString()} {wallet.currency}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Locked Balance</p>
                <p className="text-2xl font-bold text-orange-600">
                  {wallet.locked_balance.toLocaleString()} {wallet.currency}
                </p>
                <p className="text-xs text-gray-500">Pending transactions</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(wallet.balance + wallet.locked_balance).toLocaleString()} {wallet.currency}
                </p>
              </div>
            </div>

            {/* Crypto Wallet Addresses */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Cryptocurrency Addresses</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {wallet.btc_address && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">Bitcoin</p>
                    <p className="font-mono text-xs break-all">{wallet.btc_address}</p>
                  </div>
                )}
                {wallet.eth_address && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">Ethereum</p>
                    <p className="font-mono text-xs break-all">{wallet.eth_address}</p>
                  </div>
                )}
                {wallet.usdt_address && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">USDT</p>
                    <p className="font-mono text-xs break-all">{wallet.usdt_address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top-up Button */}
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => setShowTopUpModal(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Add Funds
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex space-x-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getTransactionIcon(transaction.transaction_type)}
                    </span>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleString()}
                      </p>
                      {transaction.reference && (
                        <p className="text-xs text-gray-400">
                          Ref: {transaction.reference}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                      {formatAmount(transaction.amount, transaction.transaction_type)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Balance: {transaction.new_balance.toLocaleString()} RWF
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top-up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Funds to Wallet</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="topup_amount">Amount (RWF)</Label>
                <Input
                  id="topup_amount"
                  type="number"
                  placeholder="Enter amount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  min="100"
                />
              </div>

              <div>
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select value={selectedPaymentMethod} onValueChange={(value) => setSelectedPaymentMethod(value as PaymentMethod)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mtn_momo">MTN Mobile Money</SelectItem>
                    <SelectItem value="airtel_money">Airtel Money</SelectItem>
                    <SelectItem value="equity_bank">Equity Bank</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(selectedPaymentMethod === 'mtn_momo' || selectedPaymentMethod === 'airtel_money') && (
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="078X XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Amount:</span> {parseFloat(topUpAmount || '0').toLocaleString()} RWF
                </p>
                <p className="text-xs text-gray-500">
                  Transaction fees may apply depending on payment method
                </p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowTopUpModal(false)}
                className="flex-1"
                disabled={topUpLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleTopUp}
                disabled={topUpLoading || !topUpAmount || parseFloat(topUpAmount) <= 0}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {topUpLoading ? 'Processing...' : 'Add Funds'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
