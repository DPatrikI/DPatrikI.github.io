# Patrik Dóczy — personal website

Static portfolio and policy site for [Patrik Dóczy](https://github.com/DPatrikI), published at <https://dpatriki.github.io/>. The first release features the open-source VolEq Community project.

## Requirements

- Node.js 24 LTS
- npm 11 or newer

## Local development

```sh
npm ci
npm run dev
```

The main site content lives in `src/pages`, shared presentation lives in `src/components` and `src/styles`, and public assets live in `public`.

## Verification

```sh
npm run verify
npm audit
```

`npm run verify` checks formatting, Astro and TypeScript, the production build, deterministic social cards, routes and metadata, internal links, responsive overflow, and automated accessibility rules. Browser tests require the Playwright Chromium runtime (`npx playwright install chromium`).

The production build is written to `dist/`; it is generated and must not be committed.

## Deployment

Pull requests and pushes to `master` run the **Site verification** workflow. Pushes to `master` also trigger a separate clean GitHub Pages deployment. GitHub Actions—not a `docs` directory or `gh-pages` branch—is the publishing source.

The canonical production origin is centralized in `astro.config.mjs` and `src/layouts/BaseLayout.astro`. If a custom domain is selected later, update those URL helpers, metadata expectations, `robots.txt`, and the repository Pages settings together.

## Policy and product updates

The HTML VolEq privacy policy and support content are convenience renderings of the current canonical files in [`DPatrikI/voleq-community`](https://github.com/DPatrikI/voleq-community). Re-check the public default branch, latest release, `PRIVACY.md`, `SECURITY.md`, `TRADEMARKS.md`, and compatibility documentation before changing product claims or policy text. Record any refreshed asset provenance in `ASSET_NOTICE.md`.

## Deferred `app-ads.txt`

The initial site intentionally has no `app-ads.txt`. Do not add an empty, sample, placeholder, or comment-only file.

When Patrik supplies the exact authorized-seller record from AdMob:

1. Copy that line byte-for-byte into `public/app-ads.txt`.
2. End the file with one trailing newline; add no HTML, comments, placeholders, or unrelated seller entries.
3. Build and deploy the site.
4. Verify `https://dpatriki.github.io/app-ads.txt` returns HTTP `200`, a plain-text content type, and content exactly matching the supplied record.
5. Only after that verification describe the site as ready for AdMob `app-ads.txt` discovery.

This publisher-level file would not imply that VolEq contains advertising.

## Licensing

Website source is MIT-licensed. VolEq names, branding, and copied official imagery are separately governed; see `ASSET_NOTICE.md`.
