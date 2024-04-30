module.exports = {
  apps: [
    {
      name: 'xiuxian-server',
      script: 'server/index.js',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './server/log/error.log',
      out_file: './server/log/out.log',
      instances: 6,
      min_uptime: '200s',
      max_restarts: 10,
      max_memory_restart: '1M',
      cron_restart: '1 0 * * *',
      watch: false,
      merge_logs: true,
      exec_interpreter: 'node',
      exec_mode: 'fork',
      autorestart: false,
      vizion: false
    }
  ]
}
