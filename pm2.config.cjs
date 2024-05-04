/**
 * @type {import("pm2/pm2.config.cjs")}
 */

// 如果存在 index.js
const path = require('path')
const fs = require('fs')
const config = require('alemonjs/pm2.config.cjs')
const dir = path.join(process.cwd(), 'dist/index.js')
if (fs.existsSync(dir)) {
  // 修正 地址
  config.apps = config.apps.map(item => {
    item.script = 'dist/index.js'
    return item
  })
}
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
