/** @type {import("next").NextConfig} */

await import('./src/env.mjs');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
};

export default nextConfig;
