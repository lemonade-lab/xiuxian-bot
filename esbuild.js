import { join } from 'path'
import { readdirSync } from 'fs'
import esbuild from 'esbuild'
import path from 'path'

/**
 * 获取指定目录下的所有 ts、js、jsx、tsx 文件
 * @param dir 目录路径
 * @returns 文件路径数组
 */
const getFiles = dir => {
  const results = []
  const list = readdirSync(dir, { withFileTypes: true })
  list.forEach(item => {
    const fullPath = join(dir, item.name)
    if (item.isDirectory()) {
      results.push(...getFiles(fullPath)) // 使用扩展运算符
    } else if (
      item.isFile() &&
      /\.(ts|js|jsx|tsx)$/.test(item.name) &&
      !item.name.endsWith('.d.ts')
    ) {
      results.push(fullPath)
    }
  })
  return results
}

/**
 * 用于在node中
 * 对图片文件进行处理
 * 把图片文件转换为相对路径
 * @param param0
 * @returns
 */
export const esBuildNodeImage = ({
  namespace = 'image',
  filter = /\.(png|jpg|jpeg|gif|svg)$/
} = {}) => {
  return {
    name: 'image-loader',
    setup(build) {
      const outputDirs = new Map()
      // 过滤图片文件
      build.onResolve({ filter }, args => {
        const dir = path.resolve(args.resolveDir, args.path)
        outputDirs.set(dir, args.importer)
        return {
          path: dir,
          namespace
        }
      })
      // 加载图片文件
      build.onLoad({ filter, namespace }, async args => {
        if (!outputDirs.has(args.path)) return null
        const outputDir = outputDirs.get(args.path)
        // 计算相对路径
        const relativePath = path.relative(path.dirname(outputDir), args.path)
        // 生成内容
        const contents = `
          const createUrl = (basePath, path) => {
            const platform = ['linux', 'android', 'darwin'];
            const T = platform.includes(process.platform);
            const reg = T ?  /^file:\\/\\// : /^file:\\/\\/\\//
            return new URL(path, basePath).href.replace(reg, '') 
          };
          export default createUrl(import.meta.url, '${relativePath}');
        `
        return {
          contents,
          loader: 'js'
        }
      })
    }
  }
}
const inputFiles = getFiles(join(process.cwd(), 'src'))
esbuild.build({
  entryPoints: inputFiles,
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'lib',
  plugins: [esBuildNodeImage()],
  external: ['*']
})
