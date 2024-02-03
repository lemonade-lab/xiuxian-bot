import { user, type UserType } from '../../db/index.js'

/**
 * 写入
 * @param UID
 * @param param1
 */
export async function update(UID: string, data: UserType) {
  await user.update(data, {
    where: {
      uid: UID
    }
  })
}

/**
 * 读取玩家数据
 * @param UID
 * @returns
 */
export async function read(UID: string) {
  const data: UserType = (await user.findOne({
    where: {
      uid: UID
    },
    raw: true
  })) as any
  return data
}
