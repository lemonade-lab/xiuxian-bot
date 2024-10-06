import { spawn } from 'child_process'
const args = [...process.argv].slice(2)

/**
 *
 * @param input
 * @param output
 */
const startCssPost = (input: string, output: string) => {
  // 如果命令行参数中包含 --css-server
  // 启动 CSS 服务进程
  if (args.includes('--css-server')) {
    console.log('Starting CSS server...')
    const cssServerProcess = spawn(
      'npx',
      ['jsxp', 'dev', '--node-options', 'alemonjs/loader'],
      {
        stdio: 'inherit'
      }
    )
    cssServerProcess.on('error', err => {
      console.error('Failed to start CSS server:', err)
    })
  }

  //
  console.log('Starting Tailwind process...')

  const run = ['postcss', input, '-o', output]

  // 如果命令行参数中包含 --css-server 或 --css-watch
  // 启动键监听

  if (args.includes('--css-server') || args.includes('--css-watch')) {
    run.push('--watch')
  }
  if (args.includes('--css-minify')) {
    run.push('--css-minify')
  }
  // 启动 Tailwind 进程
  const cssPostProcess = spawn('npx', run, {
    stdio: 'inherit'
  })
  cssPostProcess.on('error', err => {
    console.error('Failed to start Tailwind process:', err)
  })
}

// 执行生产
startCssPost('src/input.css', 'public/output.css')
