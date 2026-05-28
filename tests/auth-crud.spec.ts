import { test, expect } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const email = process.env.TEST_EMAIL ?? "";
const password = process.env.TEST_PASSWORD ?? "";

test.describe("Auth + CRUD", () => {
  test("happy path", async ({ page }) => {
    test.skip(!email || !password, "TEST_EMAIL/TEST_PASSWORD not set");

    await page.goto(`${baseURL}/login`);
    await page.getByPlaceholder("you@example.com").fill(email);
    await page.getByPlaceholder("비밀번호").fill(password);
    await page.getByRole("button", { name: "로그인" }).click();
    await page.waitForURL("**/posts");

    await page.goto(`${baseURL}/posts/new`);
    const title = `E2E ${Date.now()}`;
    const content = `E2E content ${Date.now()} - This is test body.`;

    await page.getByPlaceholder("제목을 입력하세요").fill(title);
    await page.getByPlaceholder("내용을 입력하세요").fill(content);
    await page.getByRole("button", { name: "게시" }).click();

    await page.waitForURL(/\/posts\/.+/);
    await page.goto(`${baseURL}/posts`);
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  });

  test("reject path", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`${baseURL}/posts/new`);
    await page.waitForURL("**/login");
    await expect(page).toHaveURL(/\/login$/);

    await context.close();
  });
});
