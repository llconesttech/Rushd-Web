/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow loading `/_next/*` dev assets when the app is opened via LAN IP (not localhost).
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  compress: false,
  output: 'standalone',
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
