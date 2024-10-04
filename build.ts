import esbuild from 'esbuild'
import path from 'path'
import { unlinkSync } from 'fs'

/**
 * 别名执行，
 * 使用esbuild进行编译
 * 生产 xxx.js文件后
 * 再进行引入
 * 然后删除文件
 */

/**
 * 用于在node中
 * 对图片文件进行处理
 * 把图片文件转换为相对路径
 * @param param0
 * @returns
 */
const esBuildNodeImage = ({
  namespace = 'image',
  filter = /\.(png|jpg|jpeg|gif|svg)$/
} = {}) => {
  return {
    name: 'image-loader',
    setup(build) {
      // 过滤图片文件
      build.onResolve({ filter }, args => {
        return {
          path: path.resolve(args.resolveDir, args.path),
          namespace
        }
      })
      // 加载图片文件
      build.onLoad({ filter, namespace }, async args => {
        // 获取输出目录，确保使用的路径正确
        const outputDir = path.dirname(
          build.initialOptions.outfile ||
            path.join(build.initialOptions.outdir, 'index.js')
        )
        // 计算相对路径
        const relativePath = path.relative(outputDir, args.path)
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

/**
 * 引入ts文件
 * @param {y} url
 * @returns
 */
const Import = async url => {
  const outfile = `${url}.js`
  return esbuild
    .build({
      entryPoints: [url],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile: outfile,
      plugins: [esBuildNodeImage()],
      external: ['*']
    })
    .then(async () => {
      return await import(new URL(`file://${path.resolve(outfile)}`))
    })
    .catch(err => {
      console.error(url, err)
    })
    .finally(() => setTimeout(() => unlinkSync(outfile)))
}

// 自定义模块加载器
const originalImport = global.import
// 重写 import 方法
global.import = async function (modulePath) {
  console.log(modulePath)
  if (modulePath.endsWith('.tsx')) {
    return Import(modulePath)
  }
  return originalImport(modulePath)
}
