import { test, expect } from '@playwright/test';

const url = 'http://localhost:8000';

test('Has index', async ({ page }) => {
  await page.goto(url);

  const title = await page.title();

  expect(title).toBe('Playwright');
});
