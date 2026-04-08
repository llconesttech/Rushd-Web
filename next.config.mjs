/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: false,
  output: 'standalone',
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.7.77:3000'],
};

export default nextConfig;
