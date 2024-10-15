import { Config } from '@src/xiuxian/core'
import { ass, user_ass } from '@src/xiuxian/db'
import { isUser } from '@xiuxian/api/index'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const text = useParse(e.Megs, 'Text')

    // 输入的是标记

    const id = text.replace(/^(#|\/)?提拔/, '')
    if (!id) return

    const ID = Number(id)
    const Send = useSend(e)
    if (isNaN(ID)) {
      Send(Text('错误标记..'))
      return
    }

    const idData = await user_ass
      .findOne({
        where: {
          id: ID
        },
        include: [
          {
            model: ass
          }
        ]
      })
      .then(res => res?.dataValues)

    if (!idData) {
      Send(Text('无效标记..'))
      return
    }

    const aData = idData['ass']['dataValues']

    //
    const UserAss = await user_ass
      .findOne({
        where: {
          uid: UID, // uid
          aid: aData.id
        }
      })
      .then(res => res?.dataValues)

    // 不存在，或者 9
    if (!UserAss || UserAss?.authentication == 9) {
      Send(Text('不属于该宗门'))
      return
    }

    if (idData.id == UserAss.id) {
      Send(Text('无法对自己进行操作'))
      return
    }

    // 大于4
    if (UserAss.authentication >= 4) {
      Send(Text('权能不足'))
      return
    }

    // 权能对比
    if (idData.authentication <= UserAss.authentication) {
      Send(Text('你的权能无法对他进行提拔'))
      return
    }

    //
    const authentication = idData.authentication - 1
    if (authentication <= 0) {
      Send(Text('已无法再提拔'))
      return
    }

    await user_ass.update(
      {
        authentication,
        identity: Config.ASS_IDENTITY_MAP[authentication]
      },
      {
        where: {
          id: idData.id
        }
      }
    )

    Send(Text('提拔成功'))

    return
  },
  'message.create',
  /^(#|\/)?提拔/
)
