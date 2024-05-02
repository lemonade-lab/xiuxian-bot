import { ABuffer, importPath } from 'alemonjs'
import { readFileSync } from 'fs'
import { join } from 'path'

import ImageComponent from '../image/index'

const helpData = {}
const app = importPath(import.meta.url)
const dir = app.cwd()

function getJson(name: string) {
  return JSON.parse(
    readFileSync(join(dir, 'public', 'defset', `${name}.json`), 'utf-8')
  )
}

/**
 * 帮助图缓存
 * @param name
 * @returns
 */
export async function urlHelpCache(name: string) {
  // 缓存不存在
  if (!Object.prototype.hasOwnProperty.call(helpData, name)) {
    // 得数据
    helpData[name] = await ImageComponent.help(await getJson(name)).catch(
      (err: any) => {
        // 发生错误
        console.error(err)
        return false
      }
    )
  }
  // 返回
  return helpData[name]
}

/**
 * 缓存型的本地图片
 * @param name
 * @returns
 */
export function lcalCacheImage(name: string) {
  // 缓存不存在
  if (!Object.prototype.hasOwnProperty.call(helpData, name)) {
    const img = ABuffer.getPath(`${dir}${name}`)
    if (!img) return
    helpData[name] = img
  }
  // 返回
  return helpData[name]
}
