/** @type {import('next').NextConfig} */

// Remote images (listing photos, avatars, category images, etc.) are served
// from the Laravel backend. In development the backend runs locally on port
// 8000 under the browser's hostname; in production it lives on a separate API
// subdomain over HTTPS. An empty allow-list makes Next happy while still
// requiring the backend to be the origin (all API URLs go through lib/api.ts).
const nextConfig = {
  images: {
    remotePatterns: [
      // Dev: http://<host>:8000 (localhost, 127.0.0.1, LAN IP)
      { protocol: "http", hostname: "**", port: "8000" },
      // Production: https://<api-subdomain>.<domain> (any port, default 443)
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
