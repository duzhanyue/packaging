# JIETING Packaging

A responsive packaging brand website built with Next.js 16 and React 19.

## Run locally

```sh
npm run dev
```

Open http://localhost:3000. For production checks run `npm run build`, then `npm start`.

## Content

- `app/data.ts`: product names, categories, images and descriptions.
- `app/globals.css`: visual system and mobile layouts.
- `app/ui.tsx`: navigation, product filters and inquiry form.
- `public/images`: product photography downloaded from jietingpackage.com.

The inquiry form prepares an email draft for angel@jietingpackage.com; it does not send email or store submissions. Visitors review and send the draft in their own email client. Phone and WhatsApp use the contact number listed on the original website.

The original application code is preserved in `.reference/original-code-backup.zip`. Old unrelated assets and routes have been removed. The original HTML snapshots are in `.reference` for source verification. No deployment or domain changes have been made.

## Complete source catalogue

The product library mirrors all 11 categories and 141 products from the source website, including pagination. Product names and category names are preserved. Image assets are stored locally as WebP. Product detail pages provide an image gallery and available source specifications.

- `app/catalog.json`: imported product catalogue and source URLs.
- `scripts/import-catalog.mjs`: repeatable source importer, with cached pages and local image conversion.
- `scripts/verify-catalog.mjs`: validates category totals, product identity and local image files against the import report.
- `.reference/catalog/report.json`: import totals and any unavailable source files.

Run the importer with `node scripts/import-catalog.mjs` (requires network access), then run `node scripts/verify-catalog.mjs` and `npm run build`.
