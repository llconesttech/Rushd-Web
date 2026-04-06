/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow loading `/_next/*` dev assets when the app is opened via LAN IP (not localhost).
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  allowedDevOrigins: ["http://192.168.7.39"],
};

export default nextConfig;
