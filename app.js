import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
const argvs = [...process.argv].slice(2)
const index = argvs.indexOf('--run')
const Error = (app = 'index.ts') => {
  console.warn(`\n未找到执行脚本...\n参数标注启动方式为 --run ${app}\n`)
  process.exit()
}
if (index == -1) Error()
const script = argvs[index + 1]
if (!script || script == '') Error()
const dir = join(process.cwd(), script)
if (!existsSync(dir)) Error(script)
const child2 = spawn(
  `node --no-warnings=ExperimentalWarning --loader  ts-node/esm ${script}`,
  argvs,
  {
    shell: true,
    stdio: 'inherit'
  }
)
process.on('SIGINT', () => {
  if (child2.pid) process.kill(child2.pid)
  if (process.pid) process.exit()
})
