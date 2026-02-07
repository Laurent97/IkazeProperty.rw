-- Seed default payment configurations
INSERT INTO payment_configurations (payment_method, is_active, config_data)
VALUES
  ('wallet', true, '{}'::jsonb),
  ('mtn_momo', false, '{
    "is_active": false,
    "merchant_name": "",
    "merchant_code": "",
    "api_key": "",
    "api_secret": "",
    "phone_number": "",
    "environment": "sandbox",
    "callback_url": "",
    "transaction_fee_percent": 2.5,
    "fixed_fee": 100,
    "min_amount": 100,
    "max_amount": 500000
  }'::jsonb),
  ('airtel_money', false, '{
    "is_active": false,
    "client_id": "",
    "client_secret": "",
    "merchant_msisdn": "",
    "country": "RW",
    "currency": "RWF",
    "pin": "",
    "transaction_fee_percent": 2.5,
    "fixed_fee": 100,
    "min_amount": 100,
    "max_amount": 500000
  }'::jsonb),
  ('equity_bank', false, '{
    "is_active": false,
    "api_endpoint": "",
    "merchant_id": "",
    "terminal_id": "",
    "encryption_key": "",
    "account_number": "",
    "account_name": "",
    "transaction_fee_percent": 1.5,
    "fixed_fee": 500,
    "min_amount": 100,
    "max_amount": 2000000
  }'::jsonb),
  ('crypto', false, '{
    "is_active": false,
    "bitcoin": {
      "enabled": false,
      "network_fee": 0,
      "confirmation_required": 2,
      "wallet_address": ""
    },
    "ethereum": {
      "enabled": false,
      "network_fee": 0,
      "confirmation_required": 10,
      "wallet_address": ""
    },
    "usdt": {
      "enabled": false,
      "network": "TRC20",
      "wallet_address": ""
    },
    "exchange_rate_provider": "manual",
    "manual_exchange_rate": 1200
  }'::jsonb)
ON CONFLICT (payment_method) DO UPDATE
  SET is_active = EXCLUDED.is_active,
      config_data = EXCLUDED.config_data;
