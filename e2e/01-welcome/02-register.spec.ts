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

const PROFILE_SELECTORS = {
  NAME_INPUT: '[data-testid="name-input"]',
  NAME_ERROR: '[data-testid="name-error"]',
  SUBMIT_BUTTON: '[data-testid="submit-button"]',
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
  const currentUrl = page.url();
  if (currentUrl.includes('complete-profile')) {
    // Test the complete profile form
    await expect(page.locator(PROFILE_SELECTORS.NAME_INPUT)).toBeVisible();
    await expect(page.locator(PROFILE_SELECTORS.SUBMIT_BUTTON)).toBeVisible();

    // Test validation - empty name
    await page.locator(PROFILE_SELECTORS.NAME_INPUT).isVisible();
    await page.evaluate(() => {
      const input = document.querySelector('[data-testid="name-input"]');
      input!.removeAttribute('required');
    });
    await page.locator(PROFILE_SELECTORS.SUBMIT_BUTTON).click();
    await expect(page.locator(PROFILE_SELECTORS.NAME_ERROR)).toBeVisible();

    // Test successful submission
    await page.locator(PROFILE_SELECTORS.NAME_INPUT).fill('Test User');
    await page.locator(PROFILE_SELECTORS.SUBMIT_BUTTON).click();

    // Should redirect to tenant dashboard
    await expect(page).toHaveURL(/\/[a-f0-9-]{36}$/);
  }
});
