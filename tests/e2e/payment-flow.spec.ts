import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should display payment methods', async ({ page }) => {
    await page.goto('/create-listing');
    
    // Fill listing form
    await page.fill('[data-testid="listing-title"]', 'Test Property');
    await page.fill('[data-testid="listing-price"]', '100000');
    await page.selectOption('[data-testid="listing-category"]', 'houses');
    
    // Proceed to promotion step
    await page.click('[data-testid="next-step"]');
    await page.waitForSelector('[data-testid="promotion-options"]');
    
    // Select promotion
    await page.click('[data-testid="promotion-urgent"]');
    await page.click('[data-testid="continue-to-payment"]');
    
    // Check payment methods are displayed
    await expect(page.locator('[data-testid="payment-methods"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-wallet"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-mtn-momo"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-airtel-money"]')).toBeVisible();
  });

  test('should process wallet payment successfully', async ({ page }) => {
    await page.goto('/create-listing');
    
    // Mock wallet balance
    await page.route('/api/payments/methods', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          methods: [
            {
              id: 'wallet',
              name: 'Wallet Balance',
              displayName: 'Wallet Balance',
              icon: '💰',
              description: 'Pay using your wallet balance',
              isActive: true,
              requiresPhone: false,
              requiresCryptoSelection: false
            }
          ]
        })
      });
    });

    // Mock payment initiation
    await page.route('/api/payments/initiate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          reference: 'PAY20240207123456',
          instructions: 'Payment completed successfully using wallet balance'
        })
      });
    });

    // Fill listing form and proceed
    await page.fill('[data-testid="listing-title"]', 'Test Property');
    await page.fill('[data-testid="listing-price"]', '100000');
    await page.selectOption('[data-testid="listing-category"]', 'houses');
    await page.click('[data-testid="next-step"]');
    
    // Select promotion
    await page.waitForSelector('[data-testid="promotion-options"]');
    await page.click('[data-testid="promotion-urgent"]');
    await page.click('[data-testid="continue-to-payment"]');
    
    // Select wallet payment
    await page.waitForSelector('[data-testid="payment-methods"]');
    await page.click('[data-testid="payment-wallet"]');
    await page.click('[data-testid="confirm-payment"]');
    
    // Verify success
    await expect(page.locator('[data-testid="payment-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Payment completed successfully');
  });

  test('should handle insufficient wallet balance', async ({ page }) => {
    await page.goto('/create-listing');
    
    // Mock insufficient balance response
    await page.route('/api/payments/initiate', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Insufficient wallet balance. Available: 5000 RWF, Required: 15000 RWF'
        })
      });
    });

    // Fill listing form and proceed
    await page.fill('[data-testid="listing-title"]', 'Test Property');
    await page.fill('[data-testid="listing-price"]', '100000');
    await page.selectOption('[data-testid="listing-category"]', 'houses');
    await page.click('[data-testid="next-step"]');
    
    // Select promotion
    await page.waitForSelector('[data-testid="promotion-options"]');
    await page.click('[data-testid="promotion-urgent"]');
    await page.click('[data-testid="continue-to-payment"]');
    
    // Select wallet payment
    await page.waitForSelector('[data-testid="payment-methods"]');
    await page.click('[data-testid="payment-wallet"]');
    await page.click('[data-testid="confirm-payment"]');
    
    // Verify error message
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Insufficient wallet balance');
  });

  test('should handle MTN Mobile Money payment', async ({ page }) => {
    await page.goto('/create-listing');
    
    // Mock MTN payment initiation
    await page.route('/api/payments/initiate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          reference: 'PAY20240207123456',
          provider_reference: 'MTN123456',
          instructions: 'Please check your phone for the MTN Mobile Money payment prompt'
        })
      });
    });

    // Fill listing form and proceed
    await page.fill('[data-testid="listing-title"]', 'Test Property');
    await page.fill('[data-testid="listing-price"]', '100000');
    await page.selectOption('[data-testid="listing-category"]', 'houses');
    await page.click('[data-testid="next-step"]');
    
    // Select promotion
    await page.waitForSelector('[data-testid="promotion-options"]');
    await page.click('[data-testid="promotion-urgent"]');
    await page.click('[data-testid="continue-to-payment"]');
    
    // Select MTN Mobile Money
    await page.waitForSelector('[data-testid="payment-methods"]');
    await page.click('[data-testid="payment-mtn-momo"]');
    
    // Phone number field should appear
    await expect(page.locator('[data-testid="phone-number"]')).toBeVisible();
    await page.fill('[data-testid="phone-number"]', '+250788123456');
    
    await page.click('[data-testid="confirm-payment"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="payment-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('MTN Mobile Money payment prompt');
  });
});
