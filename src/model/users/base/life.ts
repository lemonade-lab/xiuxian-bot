import { type UserType, user } from '../../../db/src'

/**
 * 得到用户名称
 * @param UID
 * @returns
 */
export async function getUserName(UID: string) {
  const data: UserType = (await user.findOne({
    attributes: ['name'],
    where: {
      uid: UID
    },
    raw: true
  })) as any
  return data.name
}
