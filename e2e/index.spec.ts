import { test, expect } from '@playwright/test';

const url = 'http://localhost:8000';

test.beforeEach(async ({ page }) => {
  await page.goto(url);
});

test('Index loads', async ({ page }) => {
  expect(await page.title()).toContain('محفظتنا');
});

test('Index has logo', async ({ page }) => {
  const logo = await page.$('img[alt="محفظتنا"]');
  expect(logo).toBeTruthy();
});

test('Index has a continue button', async ({ page }) => {
  const button = page.getByText('ابدأ');
  expect(button).toBeTruthy();

  await button!.click();

  await page.waitForURL('**/welcome/email');
  expect(await page.title()).toContain('محفظتنا');
});
