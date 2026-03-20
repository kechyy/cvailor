/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Temporary build safeguard until eslint-config-next is reinstalled at a Next 14-compatible version.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
}
module.exports = nextConfig
