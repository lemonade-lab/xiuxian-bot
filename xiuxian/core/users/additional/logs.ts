import { user_log } from 'xiuxian-db'
import { timeChange } from '../../wrap/method.js'

type DataType = { type: number; create_time: string; message: string }[]

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
  const arr: DataType = []
  for await (const item of da) {
    arr.push({
      type: item.type,
      create_time: timeChange(item.create_time),
      message: item.message
    })
  }
  return arr
}
