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
    }
  }]
}
