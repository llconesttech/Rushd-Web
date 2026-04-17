module.exports = {
  apps: [{
    name: 'rushd-web-ern',
    // Run the custom Express + Next server (server/index.js)
    script: 'server/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // Internal loopback URL so the Next.js proxy route can reach the
      // Express /api/v1 backend without guessing from request.url.
      API_BASE_URL: 'http://127.0.0.1:3000',
      // Public-facing URL (used by mobile BFF and any NEXT_PUBLIC references)
      NEXT_PUBLIC_API_URL: 'https://rushd-web.onesttech.com',
    }
  }]
}
