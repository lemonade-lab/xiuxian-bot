/**
 * @type {import("pm2/pm2.config.cjs")}
 */

const config = require('alemonjs/pm2.config.cjs')
if (process.argv.includes('no-bot')) {
  config.apps = []
}
if (process.argv.includes('server')) {
  config.apps.push({
    name: 'xiuxian-server',
    script: 'server/index.js',
    // args: app.args,
    error_file: `./server/xiuxian-server/err.log`,
    out_file: `./server/xiuxian-server/out.log`
  })
}
console.log('config', config)
module.exports = config
