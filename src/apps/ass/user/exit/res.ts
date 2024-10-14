import { Text, useParse, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
import * as DB from '@xiuxian/db/index'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    //
    const text = useParse(e.Megs, 'Text')

    // 势力名称
    const name = text.replace(/^(#|\/)?退出/, '')

    // 存在该昵称的宗门
    const aData = await DB.ass
      .findOne({
        where: {
          name: name
        }
      })
      .then(res => res?.dataValues)
      .catch(err => console.error(err))

    //
    const Send = useSend(e)

    //
    if (!aData) {
      Send(Text('该势力不存在'))
      return
    }

    // 查看是否是主人
    const UserAss = await DB.user_ass
      .findOne({
        where: {
          uid: UID,
          aid: aData.id,
          identity: GameApi.Config.ASS_IDENTITY_MAP['0']
        }
      })
      .then(res => res?.dataValues)
      .catch(err => console.error(err))

    //
    if (UserAss) {
      Send(Text('个人势力不可退出'))
      return
    }

    // 从个人数据中，删除自己的数据
    await DB.user_ass.destroy({
      where: {
        uid: UID,
        aid: aData.id
      }
    })

    Send(Text(`已退出${name}`))

    //
  },
  'message.create',
  /^(#|\/)?退出[\u4e00-\u9fa5]+$/
)
