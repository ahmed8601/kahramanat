/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    // Allow loading of images from the public folder. External images are not used.
    unoptimized: true
  }
};

module.exports = nextConfig;