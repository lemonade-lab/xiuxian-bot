import { ass_typing, ass, user_ass } from '@xiuxian/db/index'
/**
 *
 * @param UID
 * @param name
 * @param size
 * @returns
 */
export const v = async (UID: string, name: string, size = 4) => {
  /**
   * ********
   * 存在该昵称的宗门
   */
  const aData = await ass
    .findOne({
      where: {
        name: name
      },
      include: [
        {
          model: ass_typing
        }
      ]
    })
    .then(res => res?.dataValues)

  // 不存在
  if (!aData) {
    // console.log('势力不存在', aData)
    return false
  }

  // 查看自己的宗门
  const UserAss = await user_ass
    .findOne({
      where: {
        uid: UID, // uid
        aid: aData.id
      }
    })
    .then(res => res?.dataValues)

  // 未加入
  if (!UserAss || UserAss?.authentication == 9) {
    // console.log('不属于该宗门', UserAss)
    return false
  }

  // 4以上没权限
  if (UserAss.authentication >= size) {
    return '权能不足'
  }

  return { aData, UserAss }
}
