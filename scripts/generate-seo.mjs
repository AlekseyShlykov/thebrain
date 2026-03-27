/**
 * Generates robots.txt and sitemap.xml into the out/ directory after build.
 * Reads NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_BASE_PATH from environment to
 * produce correct absolute URLs for any deployment target.
 */

import { writeFileSync } from "fs";
import { join } from "path";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://buildtounderstand.dev";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const origin = `${siteUrl}${basePath}`;
const outDir = join(process.cwd(), "out");

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

const now = new Date().toISOString().split("T")[0];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

writeFileSync(join(outDir, "robots.txt"), robotsTxt);
writeFileSync(join(outDir, "sitemap.xml"), sitemapXml);

console.log(`✓ robots.txt  → ${origin}/robots.txt`);
console.log(`✓ sitemap.xml → ${origin}/sitemap.xml`);
