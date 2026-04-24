import type { NextConfig } from "next";

/** Set for itch.io / local file:// static bundles so asset URLs are relative. */
const itchHtmlExport = process.env.ITCH_HTML_EXPORT === "1";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  ...(itchHtmlExport ? { assetPrefix: "./" } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
