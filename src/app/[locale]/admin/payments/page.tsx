'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  PaymentConfigurationRecord, 
  PaymentMethod, 
  MTNMobileMoneyConfig as MTNMobileMoneyConfigType,
  AirtelMoneyConfig as AirtelMoneyConfigType,
  EquityBankConfig as EquityBankConfigType,
  CryptoConfig as CryptoConfigType
} from '@/types/payment';
import { supabase } from '@/lib/supabase';

export default function AdminPaymentsPage() {
  const [configurations, setConfigurations] = useState<PaymentConfigurationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('mtn_momo');

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_configurations')
        .select('*')
        .order('payment_method');

      if (error) throw error;
      setConfigurations(data || []);
    } catch (error) {
      console.error('Failed to load payment configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async (method: PaymentMethod, config: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('payment_configurations')
        .upsert({
          payment_method: method,
          is_active: config.is_active,
          config_data: config,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      
      await loadConfigurations();
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const getConfig = (method: PaymentMethod): any => {
    const config = configurations.find(c => c.payment_method === method);
    return config?.config_data || {};
  };

  const isActive = (method: PaymentMethod): boolean => {
    const config = configurations.find(c => c.payment_method === method);
    return config?.is_active || false;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading payment configurations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payment Configuration</h1>
        <Badge variant="outline">
          {configurations.filter(c => c.is_active).length} Active Methods
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="mtn_momo">MTN MoMo</TabsTrigger>
          <TabsTrigger value="airtel_money">Airtel Money</TabsTrigger>
          <TabsTrigger value="equity_bank">Equity Bank</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="mtn_momo">
          <MTNMobileMoneyConfig 
            config={getConfig('mtn_momo')}
            isActive={isActive('mtn_momo')}
            onSave={(config) => saveConfiguration('mtn_momo', config)}
            loading={saving}
          />
        </TabsContent>

        <TabsContent value="airtel_money">
          <AirtelMoneyConfig 
            config={getConfig('airtel_money')}
            isActive={isActive('airtel_money')}
            onSave={(config) => saveConfiguration('airtel_money', config)}
            loading={saving}
          />
        </TabsContent>

        <TabsContent value="equity_bank">
          <EquityBankConfig 
            config={getConfig('equity_bank')}
            isActive={isActive('equity_bank')}
            onSave={(config) => saveConfiguration('equity_bank', config)}
            loading={saving}
          />
        </TabsContent>

        <TabsContent value="crypto">
          <CryptoConfig 
            config={getConfig('crypto')}
            isActive={isActive('crypto')}
            onSave={(config) => saveConfiguration('crypto', config)}
            loading={saving}
          />
        </TabsContent>

        <TabsContent value="wallet">
          <WalletConfig 
            config={getConfig('wallet')}
            isActive={isActive('wallet')}
            onSave={(config) => saveConfiguration('wallet', config)}
            loading={saving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// MTN Mobile Money Configuration Component
function MTNMobileMoneyConfig({ config, isActive, onSave, loading }: {
  config: MTNMobileMoneyConfigType;
  isActive: boolean;
  onSave: (config: MTNMobileMoneyConfigType) => void;
  loading: boolean;
}) {
  const [localConfig, setLocalConfig] = useState<MTNMobileMoneyConfigType>({
    is_active: false,
    merchant_name: '',
    merchant_code: '',
    api_key: '',
    api_secret: '',
    phone_number: '',
    environment: 'sandbox',
    callback_url: '',
    transaction_fee_percent: 2.5,
    fixed_fee: 100,
    min_amount: 100,
    max_amount: 500000,
    ...config
  });

  const updateConfig = (updates: Partial<MTNMobileMoneyConfigType>) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          MTN Mobile Money Configuration
          <Switch
            checked={localConfig.is_active}
            onCheckedChange={(checked: boolean) => 
              updateConfig({ is_active: checked })
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mtn_merchant_name">Merchant Name</Label>
            <Input
              id="mtn_merchant_name"
              value={localConfig.merchant_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ merchant_name: e.target.value })}
              placeholder="IkazeProperty Ltd"
            />
          </div>
          <div>
            <Label htmlFor="mtn_merchant_code">Merchant Code</Label>
            <Input
              id="mtn_merchant_code"
              value={localConfig.merchant_code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ merchant_code: e.target.value })}
              placeholder="MERCHANT001"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="mtn_phone">Merchant Phone Number</Label>
          <Input
            id="mtn_phone"
            value={localConfig.phone_number}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ phone_number: e.target.value })}
            placeholder="0788123456"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mtn_api_key">API Key</Label>
            <Input
              id="mtn_api_key"
              type="password"
              value={localConfig.api_key}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ api_key: e.target.value })}
              placeholder="Enter MTN API Key"
            />
          </div>
          <div>
            <Label htmlFor="mtn_api_secret">API Secret</Label>
            <Input
              id="mtn_api_secret"
              type="password"
              value={localConfig.api_secret}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ api_secret: e.target.value })}
              placeholder="Enter MTN API Secret"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mtn_environment">Environment</Label>
            <Select
              value={localConfig.environment}
              onValueChange={(value: 'sandbox' | 'production') => updateConfig({ environment: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="mtn_callback">Callback URL</Label>
            <Input
              id="mtn_callback"
              value={localConfig.callback_url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ callback_url: e.target.value })}
              placeholder="https://your-domain.com/api/webhooks/mtn-momo"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mtn_fee_percent">Transaction Fee (%)</Label>
            <Input
              id="mtn_fee_percent"
              type="number"
              step="0.1"
              value={localConfig.transaction_fee_percent}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ transaction_fee_percent: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="mtn_fixed_fee">Fixed Fee (RWF)</Label>
            <Input
              id="mtn_fixed_fee"
              type="number"
              value={localConfig.fixed_fee}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ fixed_fee: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mtn_min_amount">Minimum Amount (RWF)</Label>
            <Input
              id="mtn_min_amount"
              type="number"
              value={localConfig.min_amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ min_amount: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="mtn_max_amount">Maximum Amount (RWF)</Label>
            <Input
              id="mtn_max_amount"
              type="number"
              value={localConfig.max_amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ max_amount: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={() => onSave(localConfig)} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Placeholder components for other payment methods
function AirtelMoneyConfig({ config, isActive, onSave, loading }: {
  config: AirtelMoneyConfigType;
  isActive: boolean;
  onSave: (config: AirtelMoneyConfigType) => void;
  loading: boolean;
}) {
  const [localConfig, setLocalConfig] = useState<AirtelMoneyConfigType>({
    is_active: false,
    client_id: '',
    client_secret: '',
    merchant_msisdn: '',
    country: 'RW',
    currency: 'RWF',
    pin: '',
    transaction_fee_percent: 2.5,
    fixed_fee: 100,
    min_amount: 100,
    max_amount: 500000,
    ...config
  });

  const updateConfig = (updates: Partial<AirtelMoneyConfigType>) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Airtel Money Configuration
          <Switch
            checked={localConfig.is_active}
            onCheckedChange={(checked: boolean) => updateConfig({ is_active: checked })}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="airtel_client_id">Client ID</Label>
            <Input
              id="airtel_client_id"
              value={localConfig.client_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ client_id: e.target.value })}
              placeholder="Enter Airtel client ID"
            />
          </div>
          <div>
            <Label htmlFor="airtel_client_secret">Client Secret</Label>
            <Input
              id="airtel_client_secret"
              type="password"
              value={localConfig.client_secret}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ client_secret: e.target.value })}
              placeholder="Enter Airtel client secret"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="airtel_msisdn">Merchant MSISDN</Label>
            <Input
              id="airtel_msisdn"
              value={localConfig.merchant_msisdn}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ merchant_msisdn: e.target.value })}
              placeholder="0788XXXXXX"
            />
          </div>
          <div>
            <Label htmlFor="airtel_pin">PIN</Label>
            <Input
              id="airtel_pin"
              type="password"
              value={localConfig.pin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ pin: e.target.value })}
              placeholder="Enter PIN"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="airtel_country">Country</Label>
            <Input
              id="airtel_country"
              value={localConfig.country}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ country: e.target.value })}
              placeholder="RW"
            />
          </div>
          <div>
            <Label htmlFor="airtel_currency">Currency</Label>
            <Input
              id="airtel_currency"
              value={localConfig.currency}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ currency: e.target.value })}
              placeholder="RWF"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="airtel_fee_percent">Transaction Fee (%)</Label>
            <Input
              id="airtel_fee_percent"
              type="number"
              step="0.1"
              value={localConfig.transaction_fee_percent}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ transaction_fee_percent: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="airtel_fixed_fee">Fixed Fee (RWF)</Label>
            <Input
              id="airtel_fixed_fee"
              type="number"
              value={localConfig.fixed_fee}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ fixed_fee: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="airtel_min_amount">Minimum Amount (RWF)</Label>
            <Input
              id="airtel_min_amount"
              type="number"
              value={localConfig.min_amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ min_amount: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="airtel_max_amount">Maximum Amount (RWF)</Label>
            <Input
              id="airtel_max_amount"
              type="number"
              value={localConfig.max_amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ max_amount: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={() => onSave(localConfig)} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EquityBankConfig({ config, isActive, onSave, loading }: {
  config: EquityBankConfigType;
  isActive: boolean;
  onSave: (config: EquityBankConfigType) => void;
  loading: boolean;
}) {
  const [localConfig, setLocalConfig] = useState<EquityBankConfigType>({
    is_active: false,
    api_endpoint: '',
    merchant_id: '',
    terminal_id: '',
    encryption_key: '',
    account_number: '',
    account_name: '',
    transaction_fee_percent: 1.5,
    fixed_fee: 500,
    min_amount: 100,
    max_amount: 2000000,
    ...config
  });

  const updateConfig = (updates: Partial<EquityBankConfigType>) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Equity Bank Configuration
          <Switch
            checked={localConfig.is_active}
            onCheckedChange={(checked: boolean) => updateConfig({ is_active: checked })}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="equity_api_endpoint">API Endpoint</Label>
            <Input
              id="equity_api_endpoint"
              value={localConfig.api_endpoint}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ api_endpoint: e.target.value })}
              placeholder="https://api.equitybank..."
            />
          </div>
          <div>
            <Label htmlFor="equity_merchant_id">Merchant ID</Label>
            <Input
              id="equity_merchant_id"
              value={localConfig.merchant_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ merchant_id: e.target.value })}
              placeholder="MERCHANT_ID"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="equity_terminal_id">Terminal ID</Label>
            <Input
              id="equity_terminal_id"
              value={localConfig.terminal_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ terminal_id: e.target.value })}
              placeholder="TERMINAL_ID"
            />
          </div>
          <div>
            <Label htmlFor="equity_encryption_key">Encryption Key</Label>
            <Input
              id="equity_encryption_key"
              type="password"
              value={localConfig.encryption_key}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ encryption_key: e.target.value })}
              placeholder="Enter encryption key"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="equity_account_number">Account Number</Label>
            <Input
              id="equity_account_number"
              value={localConfig.account_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ account_number: e.target.value })}
              placeholder="1234567890"
            />
          </div>
          <div>
            <Label htmlFor="equity_account_name">Account Name</Label>
            <Input
              id="equity_account_name"
              value={localConfig.account_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ account_name: e.target.value })}
              placeholder="IkazeProperty Ltd"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="equity_fee_percent">Transaction Fee (%)</Label>
            <Input
              id="equity_fee_percent"
              type="number"
              step="0.1"
              value={localConfig.transaction_fee_percent}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ transaction_fee_percent: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="equity_fixed_fee">Fixed Fee (RWF)</Label>
            <Input
              id="equity_fixed_fee"
              type="number"
              value={localConfig.fixed_fee}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ fixed_fee: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="equity_min_amount">Minimum Amount (RWF)</Label>
            <Input
              id="equity_min_amount"
              type="number"
              value={localConfig.min_amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ min_amount: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="equity_max_amount">Maximum Amount (RWF)</Label>
            <Input
              id="equity_max_amount"
              type="number"
              value={localConfig.max_amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ max_amount: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={() => onSave(localConfig)} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CryptoConfig({ config, isActive, onSave, loading }: {
  config: CryptoConfigType;
  isActive: boolean;
  onSave: (config: CryptoConfigType) => void;
  loading: boolean;
}) {
  const [localConfig, setLocalConfig] = useState<CryptoConfigType>({
    is_active: false,
    bitcoin: {
      enabled: false,
      network_fee: 0,
      confirmation_required: 2,
      wallet_address: ''
    },
    ethereum: {
      enabled: false,
      network_fee: 0,
      confirmation_required: 10,
      wallet_address: ''
    },
    usdt: {
      enabled: false,
      network: 'TRC20',
      wallet_address: ''
    },
    exchange_rate_provider: 'manual',
    manual_exchange_rate: 1200,
    ...config
  });

  const updateConfig = (updates: Partial<CryptoConfigType>) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Cryptocurrency Configuration
          <Switch
            checked={localConfig.is_active}
            onCheckedChange={(checked: boolean) => updateConfig({ is_active: checked })}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <Label>Bitcoin Wallet</Label>
            <Input
              value={localConfig.bitcoin.wallet_address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({
                bitcoin: { ...localConfig.bitcoin, wallet_address: e.target.value }
              })}
              placeholder="1ABC..."
            />
            <div className="flex items-center justify-between">
              <Label className="text-sm">Enable</Label>
              <Switch
                checked={localConfig.bitcoin.enabled}
                onCheckedChange={(checked: boolean) => updateConfig({
                  bitcoin: { ...localConfig.bitcoin, enabled: checked }
                })}
              />
            </div>
            <Input
              type="number"
              value={localConfig.bitcoin.confirmation_required}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({
                bitcoin: { ...localConfig.bitcoin, confirmation_required: parseInt(e.target.value) }
              })}
              placeholder="Confirmations"
            />
          </div>

          <div className="space-y-3">
            <Label>Ethereum Wallet</Label>
            <Input
              value={localConfig.ethereum.wallet_address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({
                ethereum: { ...localConfig.ethereum, wallet_address: e.target.value }
              })}
              placeholder="0xABC..."
            />
            <div className="flex items-center justify-between">
              <Label className="text-sm">Enable</Label>
              <Switch
                checked={localConfig.ethereum.enabled}
                onCheckedChange={(checked: boolean) => updateConfig({
                  ethereum: { ...localConfig.ethereum, enabled: checked }
                })}
              />
            </div>
            <Input
              type="number"
              value={localConfig.ethereum.confirmation_required}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({
                ethereum: { ...localConfig.ethereum, confirmation_required: parseInt(e.target.value) }
              })}
              placeholder="Confirmations"
            />
          </div>

          <div className="space-y-3">
            <Label>USDT Wallet</Label>
            <Input
              value={localConfig.usdt.wallet_address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({
                usdt: { ...localConfig.usdt, wallet_address: e.target.value }
              })}
              placeholder="TABC..."
            />
            <div className="flex items-center justify-between">
              <Label className="text-sm">Network</Label>
              <Select
                value={localConfig.usdt.network}
                onValueChange={(value: 'ERC20' | 'TRC20') => updateConfig({
                  usdt: { ...localConfig.usdt, network: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ERC20">ERC20</SelectItem>
                  <SelectItem value="TRC20">TRC20</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Enable</Label>
              <Switch
                checked={localConfig.usdt.enabled}
                onCheckedChange={(checked: boolean) => updateConfig({
                  usdt: { ...localConfig.usdt, enabled: checked }
                })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Exchange Rate Provider</Label>
            <Select
              value={localConfig.exchange_rate_provider}
              onValueChange={(value: 'coinbase' | 'binance' | 'manual') => updateConfig({ exchange_rate_provider: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coinbase">Coinbase</SelectItem>
                <SelectItem value="binance">Binance</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {localConfig.exchange_rate_provider === 'manual' && (
            <div>
              <Label>Manual Exchange Rate (RWF per USD)</Label>
              <Input
                type="number"
                value={localConfig.manual_exchange_rate || 1200}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ manual_exchange_rate: parseInt(e.target.value) })}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={() => onSave(localConfig)} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WalletConfig({ config, isActive, onSave, loading }: {
  config: Record<string, any>;
  isActive: boolean;
  onSave: (config: Record<string, any>) => void;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Wallet is always available for internal transactions. No external configuration is required.
        </p>
        <div className="flex justify-end mt-4">
          <Button 
            onClick={() => onSave({ is_active: true })} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
