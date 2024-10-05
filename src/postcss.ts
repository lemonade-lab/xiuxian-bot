import { spawn } from 'child_process'
// 不是生产环境
if (process.env.NODE_ENV !== 'production') {
  // 如果命令行参数中包含 --css-server
  if (process.argv.includes('--css-server')) {
    console.log('Starting CSS server...')
    const cssServerProcess = spawn('npx', ['tsxp', 'dev'], {
      stdio: 'inherit',
      env: Object.assign({}, process.env, {
        NODE_OPTIONS: '--loader alemonjs/loader --no-warnings'
      })
    })
    cssServerProcess.on('error', err => {
      console.error('Failed to start CSS server:', err)
    })
  }
  console.log('Starting Tailwind process...')
  const run = ['postcss', 'src/input.css', '-o', 'public/output.css']
  if (
    process.argv.includes('--css-server') ||
    process.argv.includes('--css-watch')
  ) {
    run.push('--watch')
  }
  if (process.argv.includes('--minify')) {
    run.push('--minify')
  }
  // 启动 Tailwind 进程
  const CSS = spawn('npx', run, {
    stdio: 'inherit'
  })
  CSS.on('error', err => {
    console.error('Failed to start Tailwind process:', err)
  })
}
