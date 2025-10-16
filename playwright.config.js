// @ts-check
const { defineConfig } = require('@playwright/test');

const baseURL = process.env.E2E_BASE_URL || 'about:blank';

module.exports = defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000
  },
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    headless: true
  }
});
