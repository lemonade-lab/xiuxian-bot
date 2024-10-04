import path from 'path'
// 尝试从参数中，得到更高优先级的配置
const argv = [...process.argv].slice(2)
/**
 * @param {*} url
 * @param {*} context
 * @param {*} defaultLoad
 * @returns
 */
export async function load(url, context, defaultLoad) {
  // 禁用loader
  if (argv.includes('--esms-no-path')) {
    return defaultLoad(url, context)
  }
  // 支持别名引用。
  if (/^@\//.test(url)) {
    const dir = path.replace('@/', '')
    return {
      format: 'module',
      source: `
       export default (await import(${new URL(dir, import.meta.url)}))?.default';
      `,
      // 防止进一步处理
      shortCircuit: true
    }
  }
  return defaultLoad(url, context)
}
