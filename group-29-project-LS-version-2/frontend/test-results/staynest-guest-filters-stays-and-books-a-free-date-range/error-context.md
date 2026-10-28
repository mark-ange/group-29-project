# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: staynest.spec.ts >> guest filters stays and books a free date range
- Location: tests\e2e\staynest.spec.ts:17:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/(account|admin|bookings)?$/
Received string:  "http://127.0.0.1:3105/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator resolved to <html lang="en" class="lenis">…</html>
       - unexpected value "http://127.0.0.1:3105/login"

```

```yaml
- banner:
  - link "staynest.":
    - /url: /
  - link "Back to stays":
    - /url: /
- main:
  - paragraph: StayNest account
  - heading "Welcome back" [level=1]
  - paragraph: Sign in to continue to your StayNest account.
  - text: Email
  - textbox "Email": guest@example.com
  - text: Password
  - textbox "Password": GuestPasswordForTests2026!
  - button "Sign in"
  - paragraph:
    - text: New to StayNest?
    - link "Create an account":
      - /url: /register?returnTo=%2Faccount
- contentinfo:
  - link "staynest.":
    - /url: /
  - paragraph: Thoughtful homes for the places that stay with you.
  - link "Browse stays":
    - /url: /
- alert
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | async function signIn(page: import("@playwright/test").Page, email: string, password: string) {
  4  |   page.on("pageerror", (error) => console.log("PAGE_ERROR", error.name, error.stack?.slice(0, 400)));
  5  |   page.on("console", (message) => { if (message.type() === "error") console.log("CONSOLE_ERROR", message.text().slice(0, 300)); });
  6  |   page.on("requestfailed", (request) => console.log("REQUEST_FAILED", new URL(request.url()).pathname));
  7  |   page.on("response", (response) => { if (new URL(response.url()).pathname.includes("/api/auth")) console.log("AUTH_RESPONSE", response.status(), new URL(response.url()).pathname); });
  8  |   await page.goto("/login");
  9  |   await page.getByLabel("Email").fill(email);
  10 |   await page.getByLabel("Password").fill(password);
  11 |   await page.getByRole("button", { name: "Sign in" }).click();
  12 |   const alert = page.getByRole("alert");
  13 |   if (await alert.count()) console.log("AUTH_ALERT", (await alert.textContent())?.slice(0, 120));
> 14 |   await expect(page).toHaveURL(/\/(account|admin|bookings)?$/);
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  15 | }
  16 | 
  17 | test("guest filters stays and books a free date range", async ({ page }) => {
  18 |   await signIn(page, "guest@example.com", "GuestPasswordForTests2026!");
  19 |   await page.goto("/");
  20 |   await page.getByLabel("Destination").fill("Lisbon");
  21 |   await page.getByRole("button", { name: "Find stays" }).click();
  22 |   await page.getByRole("link", { name: /Alfama Sunroom House/ }).click();
  23 |   await expect(page.getByRole("heading", { name: "Alfama Sunroom House" })).toBeVisible();
  24 |   await page.getByLabel("Check-in").fill("2027-01-10");
  25 |   await page.getByLabel("Check-out").fill("2027-01-13");
  26 |   await page.getByRole("button", { name: "Reserve this stay" }).click();
  27 |   await expect(page.getByRole("heading", { name: "Your stay is requested" })).toBeVisible();
  28 | });
  29 | 
  30 | test("a second booking for the same dates is unavailable", async ({ page }) => {
  31 |   await signIn(page, "guest@example.com", "GuestPasswordForTests2026!");
  32 |   await page.goto("/stays/alfama-sunroom");
  33 |   await page.getByLabel("Check-in").fill("2027-01-10");
  34 |   await page.getByLabel("Check-out").fill("2027-01-13");
  35 |   await page.getByRole("button", { name: "Reserve this stay" }).click();
  36 |   await expect(page.getByRole("alert")).toContainText("unavailable");
  37 | });
  38 | 
  39 | test("logged-out users are sent to login before opening admin", async ({ page }) => {
  40 |   await page.goto("/admin");
  41 |   await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin/);
  42 | });
  43 | 
  44 | test("admin can create a listing, publish it, and find it on home", async ({ page }) => {
  45 |   await signIn(page, "admin@example.com", "AdminPasswordForTests2026!");
  46 |   await page.goto("/admin/properties/new");
  47 |   await page.getByLabel("Title").fill("Deadline Test House");
  48 |   await page.getByLabel("Slug").fill("deadline-test-house");
  49 |   await page.getByLabel("City").fill("Lisbon");
  50 |   await page.getByLabel("Country").fill("Portugal");
  51 |   await page.getByLabel("Price per night").fill("200");
  52 |   await page.getByLabel("Maximum guests").fill("4");
  53 |   await page.getByLabel("Bedrooms").fill("2");
  54 |   await page.getByLabel("Bathrooms").fill("1");
  55 |   await page.getByLabel("Description").fill("A comfortable test property created during the Playwright acceptance run.");
  56 |   await page.getByLabel("Amenities (comma separated)").fill("Wi-Fi, Kitchen");
  57 |   await page.getByRole("button", { name: "Save draft" }).click();
  58 |   await page.goto("/admin");
  59 |   await page.getByRole("button", { name: "Publish" }).last().click();
  60 |   await page.goto("/?destination=Lisbon");
  61 |   await expect(page.getByText("Deadline Test House")).toBeVisible();
  62 | });
  63 | 
```