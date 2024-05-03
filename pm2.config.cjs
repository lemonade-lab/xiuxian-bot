/**
 * @type {import("pm2/pm2.config.cjs")}
 */

const config = require('alemonjs/pm2.config.cjs')
const apps = [...config.apps]
if (process.argv.includes('no-bot')) {
  config.apps = []
}
if (process.argv.includes('server')) {
  const t = apps[0]
  config.apps.push({
    ...t,
    name: 'xiuxian-server',
    script: 'server/index.js',
    args: [],
    // args: app.args,
    error_file: `./logs/server/err.log`,
    out_file: `./logs/server/out.log`
  })
}
console.log('config', config)
module.exports = config
