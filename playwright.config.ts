import { defineConfig, devices } from '@playwright/test';

// On machines without a bundled Chromium, drive an installed browser with
// PW_CHANNEL=msedge or PW_CHANNEL=chrome.
const channel = process.env.PW_CHANNEL || undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // One retry absorbs rare `net::ERR_ABORTED` navigation flakes when several
  // workers hit a single preview server at once; it never masks a real failure.
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    ...(channel ? { channel } : {}),
  },
  projects: [
    {
      name: channel ?? 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
