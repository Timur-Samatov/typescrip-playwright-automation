import { defineConfig, devices, expect } from '@playwright/test';
import { ZodType } from 'zod';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Custom matcher: validates an APIResponse body (or plain object) against a Zod schema
expect.extend({
  async toMatchSchema(received: unknown, schema: ZodType) {
    // Support both raw Playwright APIResponse and plain data objects
    const body =
      received !== null &&
      typeof received === 'object' &&
      typeof (received as { json?: unknown }).json === 'function'
        ? await (received as { json: () => Promise<any> }).json()
        : received;
    const result = await schema.safeParseAsync(body);
    if (result.success) {
      return {
        message: () => 'schema matched',
        pass: true,
      };
    } else {
      return {
        message: () =>
          'Result does not match schema:\n' +
          result.error.issues
            .map((issue) => `  - [${issue.path.join('.') || 'root'}] ${issue.message}`)
            .join('\n') +
          '\n\nDetails:\n' +
          JSON.stringify(result.error, null, 2),
        pass: false,
      };
    }
  },
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
