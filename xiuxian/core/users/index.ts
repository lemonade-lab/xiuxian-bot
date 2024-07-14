import { user } from 'xiuxian-db'

/**
 * 写入
 * @param UID
 * @param param1
 */
export async function update(UID: string, data) {
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
  const data = await user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  return data
}
