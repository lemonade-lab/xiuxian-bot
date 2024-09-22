import { getHash as hash, BufferData } from 'chat-space'

import { readFileSync } from 'fs'
import { join } from 'path'
import { pictureRender } from 'xiuxian-img'

const helpData = {}

/**
 *
 * @param name
 * @returns
 */
function getJson(name: string) {
  return JSON.parse(
    readFileSync(
      join(process.cwd(), 'public', 'defset', `${name}.json`),
      'utf-8'
    )
  )
}

/**
 * 帮助图缓存
 * @param name
 * @returns
 */
export async function urlHelpCache(name: string) {
  // 缓存不存在
  if (Object.prototype.hasOwnProperty.call(helpData, name)) {
    // 返回
    return helpData[name]
  }
  // 得数据
  helpData[name] = await pictureRender('HelpComponent', {
    name: 'help',
    props: {
      data: await getJson(name)
    }
  }).catch((err: any) => {
    // 发生错误
    console.error(err)
    return false
  })
}

const ABuffer = new BufferData()

/**
 * 缓存型的本地图片
 * @param name
 * @returns
 */
export function lcalCacheImage(name: string) {
  // 缓存不存在
  if (!Object.prototype.hasOwnProperty.call(helpData, name)) {
    const img = ABuffer.getPath(join(process.cwd(), name))
    if (!img) return
    helpData[name] = img
  }
  // 返回
  return helpData[name]
}

/**
 * 重新生产UID
 * @param UID
 * @returns
 */
export const createUID = (UID: string) => {
  return isNaN(Number(UID)) || UID.length > 11 ? hash(UID) : UID
}
