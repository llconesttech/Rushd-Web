module.exports = {
  apps: [{
    name: 'rushd-web-ern',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max', // Use 'max' for cluster mode
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
