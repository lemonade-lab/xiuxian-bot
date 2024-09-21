import { user } from 'xiuxian-db'

/**
 * 得到用户名称
 * @param UID
 * @returns
 */
export async function getUserName(UID: string) {
  const data = await user
    .findOne({
      attributes: ['name'],
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
  return data.name
}
