import { browser } from "k6/experimental/browser";

export const options = {
  scenarios: {
    ui: {
      executor: "shared-iterations",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

export default async function () {
  const page = browser.newPage();
  await page.goto("https://test.k6.io/my_messages.php");

  page.locator('input[name="login"]').type("admin");
  page.locator('input[name="password"]').type("123");
  await page.locator('input[type="submit"]').click();
  await page.waitForNavigation();
}
