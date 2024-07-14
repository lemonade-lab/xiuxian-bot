import { user_log } from 'xiuxian-db'
import { timeChange } from '../../wrap/method.js'

/**
 * 写入
 * @param UID
 * @param DATA
 */
export async function write(UID: string, DATA) {
  await user_log.create({
    ...DATA,
    uid: UID
  })
}

/**
 * 删除
 * @param UID
 */
export async function del(UID: string) {
  await user_log.destroy({
    where: {
      uid: UID
    }
  })
}

/**
 * 读取
 * @param UID
 * @returns
 */
export async function read(UID: string) {
  const da = await user_log
    .findAll({
      attributes: ['type', 'create_time', 'message'],
      where: {
        uid: UID
      },
      order: [
        ['create_time', 'DESC'] // 降序排列
      ],
      limit: 10
    })
    .then(res => res.map(item => item.dataValues))
  const arr: { type: number; create_time: string; message: string }[] = []
  for await (const item of da) {
    arr.push({
      type: item.type,
      create_time: timeChange(item.create_time),
      message: item.message
    })
  }
  return arr
}
