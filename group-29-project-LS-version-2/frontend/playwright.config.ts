import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3105";
const testEnv = {
  ...process.env,
  DATABASE_URL: "file:./test.db",
  AUTH_SECRET: "playwright-only-secret-for-local-e2e-tests",
  AUTH_URL: baseURL,
  APP_URL: baseURL,
  PORT: "3105",
  NODE_ENV: "development",
  SEED_ADMIN_PASSWORD: "AdminPasswordForTests2026!",
  SEED_GUEST_PASSWORD: "GuestPasswordForTests2026!",
};

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: false,
  reporter: "list",
  use: { ...devices["Desktop Chrome"], baseURL, trace: "retain-on-failure" },
  webServer: { command: "npm run dev", url: baseURL, env: testEnv, reuseExistingServer: false, timeout: 60_000 },
});
