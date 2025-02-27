import { test, expect } from '@playwright/test';

// Constants for reusable selectors
const SELECTORS = {
  HEADING: '[data-testid="welcome-heading"]',
  DESCRIPTION: '[data-testid="welcome-description"]',
  HERO_IMAGE: '[data-testid="welcome-hero-image"]',
  START_BUTTON: '[data-testid="welcome-start-button"]',
  DISCLAIMER: '[data-testid="welcome-disclaimer"]'
};

test.beforeEach(async ({ page }) => {
  await page.goto('/welcome');
});

test('should display all welcome page elements correctly', async ({ page }) => {
  await expect(page.locator(SELECTORS.HEADING)).toBeVisible();
  await expect(page.locator(SELECTORS.DESCRIPTION)).toBeVisible();
  await expect(page.locator(SELECTORS.HERO_IMAGE)).toBeVisible();
  await expect(page.locator(SELECTORS.START_BUTTON)).toBeVisible();
  await expect(page.locator(SELECTORS.DISCLAIMER)).toBeVisible();
});

test('should navigate to enter email page when start button is clicked', async ({ page }) => {
  await page.locator(SELECTORS.START_BUTTON).click();
  await expect(page).toHaveURL(/\/welcome\/email$/);
});
