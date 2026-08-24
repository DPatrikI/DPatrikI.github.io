import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const origin = "https://dpatriki.github.io";
const routes = new Map([
  ["/", "index.html"],
  ["/projects/voleq/", "projects/voleq/index.html"],
  ["/privacy/", "privacy/index.html"],
  ["/privacy/voleq/", "privacy/voleq/index.html"],
  ["/support/voleq/", "support/voleq/index.html"],
  ["/404.html", "404.html"],
]);

const errors = [];
const titles = new Set();
const descriptions = new Set();
const documents = new Map();

const fail = (message) => errors.push(message);

for (const [route, file] of routes) {
  const path = resolve(dist, file);
  let html;
  try {
    html = await readFile(path, "utf8");
  } catch {
    fail(`${route}: missing ${file}`);
    continue;
  }

  const $ = load(html);
  documents.set(route, $);
  const title = $("title").text().trim();
  const description = $('meta[name="description"]').attr("content")?.trim();
  const canonical = $('link[rel="canonical"]').attr("href");
  const expectedCanonical = new URL(route, `${origin}/`).toString();

  if (!title) fail(`${route}: missing title`);
  if (titles.has(title)) fail(`${route}: duplicate title "${title}"`);
  titles.add(title);
  if (!description) fail(`${route}: missing description`);
  if (description && descriptions.has(description))
    fail(`${route}: duplicate description`);
  if (description) descriptions.add(description);
  if (canonical !== expectedCanonical) {
    fail(
      `${route}: expected canonical ${expectedCanonical}, found ${canonical ?? "none"}`,
    );
  }

  const metadata = [
    ['meta[property="og:title"]', "content"],
    ['meta[property="og:description"]', "content"],
    ['meta[property="og:url"]', "content"],
    ['meta[property="og:image"]', "content"],
    ['meta[property="og:image:width"]', "content"],
    ['meta[property="og:image:height"]', "content"],
    ['meta[property="og:image:alt"]', "content"],
    ['meta[name="twitter:card"]', "content"],
    ['meta[name="twitter:title"]', "content"],
    ['meta[name="twitter:description"]', "content"],
    ['meta[name="twitter:image"]', "content"],
    ['meta[name="twitter:image:alt"]', "content"],
    ['link[rel="icon"]', "href"],
  ];
  for (const [selector, attribute] of metadata) {
    if (!$(`${selector}`).attr(attribute))
      fail(`${route}: missing ${selector} ${attribute}`);
  }
  if ($('meta[property="og:image:width"]').attr("content") !== "1200") {
    fail(`${route}: Open Graph image width must be 1200`);
  }
  if ($('meta[property="og:image:height"]').attr("content") !== "630") {
    fail(`${route}: Open Graph image height must be 630`);
  }
  if ($("h1").length !== 1) fail(`${route}: expected exactly one h1`);
  if (!$("main#main-content").length)
    fail(`${route}: missing main landmark target`);
  if (!$('a.skip-link[href="#main-content"]').length)
    fail(`${route}: missing skip link`);

  if (
    /localhost|127\.0\.0\.1|\/Users\/|placeholder|sourceMappingURL/i.test(html)
  ) {
    fail(
      `${route}: production HTML contains local, placeholder, or source-map text`,
    );
  }
}

for (const route of ["/", "/projects/voleq/"]) {
  const $ = documents.get(route);
  const raw = $?.('script[type="application/ld+json"]').text();
  if (!raw) {
    fail(`${route}: missing JSON-LD`);
    continue;
  }
  try {
    const value = JSON.parse(raw);
    const expectedType = route === "/" ? "Person" : "SoftwareApplication";
    if (value["@type"] !== expectedType)
      fail(`${route}: JSON-LD must be ${expectedType}`);
    if ("offers" in value || "aggregateRating" in value)
      fail(`${route}: unsupported offer/rating data`);
  } catch {
    fail(`${route}: invalid JSON-LD`);
  }
}

function routeToFile(pathname) {
  if (pathname === "/") return resolve(dist, "index.html");
  if (extname(pathname)) return resolve(dist, pathname.slice(1));
  return resolve(dist, pathname.slice(1), "index.html");
}

for (const [sourceRoute, $] of documents) {
  for (const element of $("a[href], img[src], link[href]").toArray()) {
    const attribute = element.tagName === "img" ? "src" : "href";
    const value = $(element).attr(attribute);
    if (
      !value ||
      value.startsWith("http") ||
      value.startsWith("mailto:") ||
      value.startsWith("data:")
    ) {
      continue;
    }

    const target = new URL(value, `${origin}${sourceRoute}`);
    if (target.origin !== origin) continue;
    const file = routeToFile(target.pathname);
    try {
      await access(file);
    } catch {
      fail(`${sourceRoute}: broken internal ${attribute} ${value}`);
      continue;
    }

    if (target.hash) {
      const targetRoute = target.pathname.endsWith(".html")
        ? target.pathname
        : `${target.pathname}`;
      const targetDocument = documents.get(targetRoute);
      const fragment = decodeURIComponent(target.hash.slice(1));
      if (
        targetDocument &&
        !targetDocument(`[id="${fragment.replaceAll('"', '\\"')}"]`).length
      ) {
        fail(`${sourceRoute}: missing fragment target ${value}`);
      }
    }
  }
}

const robots = await readFile(resolve(dist, "robots.txt"), "utf8").catch(
  () => "",
);
if (
  !robots.includes("Allow: /") ||
  !robots.includes(`${origin}/sitemap-index.xml`)
) {
  fail("robots.txt must allow indexing and reference the production sitemap");
}

const sitemapFiles = (await readdir(dist)).filter(
  (name) => name.startsWith("sitemap") && name.endsWith(".xml"),
);
const sitemapXml = (
  await Promise.all(
    sitemapFiles.map((name) => readFile(resolve(dist, name), "utf8")),
  )
).join("\n");
for (const route of routes.keys()) {
  if (route === "/404.html") continue;
  const expected = new URL(route, `${origin}/`).toString();
  if (!sitemapXml.includes(expected)) fail(`sitemap is missing ${expected}`);
}

try {
  await access(resolve(dist, "app-ads.txt"));
  fail("app-ads.txt must be absent until an authorized record is supplied");
} catch {
  // Intentional absence.
}

const allHtml = [...documents.values()].map(($) => $.html()).join("\n");
if (!allHtml.includes("mailto:doczy.patrik410@gmail.com"))
  fail("missing public email link");

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `Verified ${routes.size} routes, metadata, links, assets, policies, and app-ads.txt absence.`,
);
