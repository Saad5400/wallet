import { test, expect } from '@playwright/test';

// Constants for reusable selectors
const SELECTORS = {
  EMAIL_INPUT: '[data-testid="email-input"]',
  SUBMIT_BUTTON: '[data-testid="submit-button"]',
};

const OTP_SELECTORS = {
  OTP_INPUT: '[data-testid="otp-input"]',
  OTP_SUBMIT_BUTTON: '[data-testid="otp-submit-button"]',
  ERROR_MESSAGE: '[data-testid="error-message"]'
};

test('Enter Email and OTP Flow', async ({ page }) => {
  await page.goto('/welcome/email');

  await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
  await expect(page.locator(SELECTORS.SUBMIT_BUTTON)).toBeVisible();

  await page.locator(SELECTORS.EMAIL_INPUT).fill('invalid-email');
  await page.locator(SELECTORS.SUBMIT_BUTTON).click();
  await expect(page).toHaveURL(/\/welcome\/email$/);

  await page.locator(SELECTORS.EMAIL_INPUT).fill('valid@example.com');
  await page.locator(SELECTORS.SUBMIT_BUTTON).click();
  await expect(page).toHaveURL(/\/welcome\/email\/otp$/);

  await expect(page.locator(OTP_SELECTORS.OTP_INPUT)).toBeVisible();
  await expect(page.locator(OTP_SELECTORS.OTP_SUBMIT_BUTTON)).toBeVisible();

  const input = page.locator(OTP_SELECTORS.OTP_INPUT);
  
  await input.fill('123456');
  await page.locator(OTP_SELECTORS.OTP_SUBMIT_BUTTON).click();
  await expect(page.locator(OTP_SELECTORS.ERROR_MESSAGE)).toBeVisible();

  await input.clear();
  await input.fill('000000');
  await page.locator(OTP_SELECTORS.OTP_SUBMIT_BUTTON).click();
  
  // either /welcome/complete-profile or /{tenant} which is a uuid
  await expect(page).toHaveURL(/\/welcome\/complete-profile$|\/[a-f0-9-]{36}$/);

  // if we're on the complete profile page, let's test it and submit the form
});
