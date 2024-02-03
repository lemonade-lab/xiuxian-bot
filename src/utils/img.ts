import { createImage, importPath } from 'alemonjs'
const app = importPath(import.meta.url)
const Image = createImage(app.cwd())
/**
 * 图片发送
 * @param key 路由
 * @param params 数据
 * @returns
 */
export async function obtainingImages(KEY: string, params: any) {
  // 创建字符
  Image.create({
    late: KEY,
    data: params
  })
  console.log('开始创建...')
  // 截图
  const img = await Image.screenshot().catch((err: any) => {
    console.error(err)
    return false
  })
  if (typeof img == 'boolean') return '图片生成失败,请联系开发人员修复...'
  return img
}
