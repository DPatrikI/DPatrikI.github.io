import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const routes = [
  "/",
  "/projects/signalbriar/",
  "/projects/voleq/",
  "/privacy/",
  "/privacy/signalbriar/",
  "/privacy/voleq/",
  "/privacy/voleq-android/",
  "/support/voleq/",
  "/404.html",
];

const storeLinks = {
  voleqPlay:
    "https://play.google.com/store/apps/details?id=com.veryclevernamecompany.voleq",
  signalbriarAppStore: "https://apps.apple.com/app/signalbriar/id6805111298",
  signalbriarPlay:
    "https://play.google.com/store/apps/details?id=com.patrikistvandoczy.signalbriar",
};

const expectStoreLink = async (page: Page, href: string) => {
  expect(await page.locator(`a[href="${href}"]`).count()).toBeGreaterThan(0);
};

for (const route of routes) {
  test(`${route} has no detectable accessibility violations`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

const viewports = [
  { name: "phone", width: 320, height: 568 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide desktop", width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`homepage has no horizontal overflow at ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator("img")).toHaveCount(4);
    for (const image of await page.locator("img").all()) {
      await expect(image).toHaveJSProperty("complete", true);
      expect(
        await image.evaluate((node) => (node as HTMLImageElement).naturalWidth),
      ).toBeGreaterThan(0);
      const ratios = await image.evaluate((node) => {
        const image = node as HTMLImageElement;
        const bounds = image.getBoundingClientRect();
        return {
          displayed: bounds.width / bounds.height,
          intrinsic: image.naturalWidth / image.naturalHeight,
        };
      });
      expect(Math.abs(ratios.displayed - ratios.intrinsic)).toBeLessThan(0.02);
    }
  });
}

test("skip link is first and visibly operable from the keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.locator(".skip-link");
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("VolEq detail imagery preserves its official aspect ratio", async ({
  page,
}) => {
  await page.goto("/projects/voleq/");
  const image = page.locator(".product-shot img");
  const ratios = await image.evaluate((node) => {
    const screenshot = node as HTMLImageElement;
    const bounds = screenshot.getBoundingClientRect();
    return {
      displayed: bounds.width / bounds.height,
      intrinsic: screenshot.naturalWidth / screenshot.naturalHeight,
    };
  });
  expect(Math.abs(ratios.displayed - ratios.intrinsic)).toBeLessThan(0.02);
});

test("Signalbriar detail imagery preserves its official aspect ratio", async ({
  page,
}) => {
  await page.goto("/projects/signalbriar/");
  const image = page.locator(".product-shot img");
  const ratios = await image.evaluate((node) => {
    const screenshot = node as HTMLImageElement;
    const bounds = screenshot.getBoundingClientRect();
    return {
      displayed: bounds.width / bounds.height,
      intrinsic: screenshot.naturalWidth / screenshot.naturalHeight,
    };
  });
  expect(Math.abs(ratios.displayed - ratios.intrinsic)).toBeLessThan(0.02);
});

test("home page links both released projects and their stores", async ({
  page,
}) => {
  await page.goto("/");
  const projects = page.locator("#projects");
  await expect(projects.getByRole("heading", { level: 2 })).toHaveText(
    "Projects",
  );
  await expect(projects.locator('a[href="/projects/voleq/"]')).toHaveCount(1);
  await expect(
    projects.locator('a[href="/projects/signalbriar/"]'),
  ).toHaveCount(1);
  await expectStoreLink(page, storeLinks.voleqPlay);
  await expectStoreLink(page, storeLinks.signalbriarAppStore);
  await expectStoreLink(page, storeLinks.signalbriarPlay);
});

test("VolEq page links its Android release", async ({ page }) => {
  await page.goto("/projects/voleq/");
  await expectStoreLink(page, storeLinks.voleqPlay);
  await expect(
    page.getByRole("heading", { name: "VolEq for Android" }),
  ).toBeVisible();
});

test("Signalbriar page links both stores", async ({ page }) => {
  await page.goto("/projects/signalbriar/");
  await expectStoreLink(page, storeLinks.signalbriarAppStore);
  await expectStoreLink(page, storeLinks.signalbriarPlay);
});

test("reduced motion keeps the experience complete", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#projects")).toBeVisible();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
