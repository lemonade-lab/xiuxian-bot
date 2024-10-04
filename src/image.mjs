import path from 'path'
/**
 * 处理png|jpg|jpeg|gif|svg文件
 * @param {*} url
 * @param {*} context
 * @param {*} defaultLoad
 * @returns
 */
export async function load(url, context, defaultLoad) {
  // 匹配图片文件的正则表达式
  const imageRegex = /\.(png|jpg|jpeg|gif|svg)$/
  //
  if (imageRegex.test(url)) {
    // 获取输出目录
    const outputDir = path.dirname(context.parentURL || 'index.js')
    // 计算相对路径
    const relativePath = path.relative(outputDir, url)
    // 生成模块内容
    const contents = `
      const createUrl = (basePath, path) => {
        const platform = ['linux', 'android', 'darwin'];
        const T = platform.includes(process.platform);
        const reg = T ? /^file:\\/\\// : /^file:\\/\\/\\//;
        return new URL(path, basePath).href.replace(reg, '');
      };
      export default createUrl(import.meta.url, '${relativePath}');
    `
    return {
      format: 'module',
      source: contents,
      shortCircuit: true // 防止进一步处理
    }
  }
  // 调用默认加载器处理其他模块
  return defaultLoad(url, context)
}
