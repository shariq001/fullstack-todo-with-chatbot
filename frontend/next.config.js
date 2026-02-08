/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
  serverExternalPackages: ['ws'],
};

module.exports = nextConfig;
