import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local/dev host IPs used by remote dev tools to access Next dev server
  // (add any addresses shown in the dev server warning)
  experimental: {
    // Next.js may require allowedDevOrigins in newer versions; include the observed IP.
    // If your Next version doesn't recognize this key it's harmless.
    allowedDevOrigins: ["10.0.13.53"],
  },
};

export default nextConfig;
