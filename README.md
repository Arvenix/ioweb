# Arvenix SEO Service Pages

Drop-in package for the existing `ioweb` repository.

## Included

Seven SEO service pages, shared CSS, internal cross-links, illustrative SaaS dashboard snapshots, service schema markup, sitemap, robots.txt, and an index-page integration snippet.

## Suggested repo structure

```text
ioweb/
├── index.html
├── robots.txt
├── sitemap.xml
├── assets/
│   └── services.css
├── services/
│   ├── inventory-management.html
│   ├── capacity-planning.html
│   ├── backlog-management.html
│   ├── scheduling-optimization.html
│   ├── purchasing-optimization.html
│   ├── technician-workforce.html
│   └── operational-analytics.html
└── arvenix-roi-calculator/
```

## Install

1. Copy `services/` into the root of `ioweb`.
2. Copy `assets/services.css` into `ioweb/assets/`.
3. Copy `robots.txt` and `sitemap.xml` to the root.
4. Open `index-integration-snippet.html` and merge its navigation links and `#solutions` section into your existing `index.html`.
5. Commit and push to `main`.
6. Verify each service URL.
7. Submit `https://arvenix.io/sitemap.xml` in Google Search Console.

All performance examples are clearly marked illustrative. Replace them with validated customer results when available.
