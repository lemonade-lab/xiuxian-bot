/**
 * @type {import("pm2/pm2.config.cjs")}
 */

const config = require('alemonjs/pm2.config.cjs')
console.log('config', config)
if (process.argv.includes('no-bot')) {
  config.apps = []
}
if (process.argv.includes('server')) {
  config.apps.push({
    name: 'alemonb-xiuxian-server',
    script: 'server/index.js',
    instances: 1,
    autorestart: false,
    exec_mode: 'cluster',
    max_memory_restart: '2G',
    cron_restart: '0 */6 * * *',
    watch: false,
    autodump: true,
    merge_logs: true,
    error_file: `./server/logs/err.log`,
    out_file: `./server/logs/out.log`,
    log_max_size: '10M',
    log_rotate_interval: 'daily',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    env: {
      NODE_ENV: 'production'
    },
    kill_timeout: 5000,
    listen_timeout: 3000,
    max_restarts: 10
  })
}
module.exports = config
