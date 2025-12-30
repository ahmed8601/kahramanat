/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow loading of images from the public folder. External images are not used.
    unoptimized: true
  }
};

module.exports = nextConfig;