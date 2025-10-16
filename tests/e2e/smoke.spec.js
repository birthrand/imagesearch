import { expect, test } from '@playwright/test';

const baseUrl = process.env.E2E_BASE_URL || 'about:blank';

test.describe('ImageSearch end-to-end flow', () => {
  test.skip(baseUrl === 'about:blank', 'E2E_BASE_URL is not configured for end-to-end tests.');

  test('allows users to submit a search query and see results', async ({ page }) => {
    await page.goto(baseUrl);

    await page.getByLabel('Search query').fill('aurora');
    await page.getByRole('button', { name: /search images/i }).click();

    await expect(page.getByText(/curated results/i)).toBeVisible();
    await expect(page.getByRole('list')).toBeVisible();
  });
});
