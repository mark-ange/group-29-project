import { expect, test } from "@playwright/test";

async function signIn(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/(account|admin|bookings)?$/);
}

test("guest filters stays and books a free date range", async ({ page }) => {
  await signIn(page, "guest@example.com", "GuestPasswordForTests2026!");
  await page.goto("/");
  await page.getByLabel("Destination").fill("Lisbon");
  await page.getByRole("button", { name: "Find stays" }).click();
  await page.getByRole("link", { name: /Alfama Sunroom House/ }).click();
  await expect(page.getByRole("heading", { name: "Alfama Sunroom House" })).toBeVisible();
  await page.getByLabel("Check-in").fill("2027-01-10");
  await page.getByLabel("Check-out").fill("2027-01-13");
  await page.getByRole("button", { name: "Reserve this stay" }).click();
  await expect(page.getByRole("heading", { name: "Your stay is requested" })).toBeVisible();
});

test("a second booking for the same dates is unavailable", async ({ page }) => {
  await signIn(page, "guest@example.com", "GuestPasswordForTests2026!");
  await page.goto("/stays/alfama-sunroom");
  await page.getByLabel("Check-in").fill("2027-01-10");
  await page.getByLabel("Check-out").fill("2027-01-13");
  await page.getByRole("button", { name: "Reserve this stay" }).click();
  await expect(page.getByRole("alert")).toContainText("unavailable");
});

test("logged-out users are sent to login before opening admin", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin/);
});

test("admin can create a listing, publish it, and find it on home", async ({ page }) => {
  await signIn(page, "admin@example.com", "AdminPasswordForTests2026!");
  await page.goto("/admin/properties/new");
  await page.getByLabel("Title").fill("Deadline Test House");
  await page.getByLabel("Slug").fill("deadline-test-house");
  await page.getByLabel("City").fill("Lisbon");
  await page.getByLabel("Country").fill("Portugal");
  await page.getByLabel("Price per night").fill("200");
  await page.getByLabel("Maximum guests").fill("4");
  await page.getByLabel("Bedrooms").fill("2");
  await page.getByLabel("Bathrooms").fill("1");
  await page.getByLabel("Description").fill("A comfortable test property created during the Playwright acceptance run.");
  await page.getByLabel("Amenities (comma separated)").fill("Wi-Fi, Kitchen");
  await page.getByRole("button", { name: "Save draft" }).click();
  await page.goto("/admin");
  await page.getByRole("button", { name: "Publish" }).last().click();
  await page.goto("/?destination=Lisbon");
  await expect(page.getByText("Deadline Test House")).toBeVisible();
});
