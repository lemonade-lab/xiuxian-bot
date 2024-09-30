import { isUser, sendReply } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const text = useParse(e.Megs, 'Text')
    const name = text.replace(/^(#|\/)?审核/, '')
    const v = await GameApi.Ass.v(UID, name)
    if (v === false) return
    const Send = useSend(e)
    if (v === '权能不足') {
      Send(Text(v))
      return
    }
    const { aData } = v
    const uData = await DB.user_ass
      .findAll({
        where: {
          aid: aData.id,
          identity: GameApi.Config.ASS_IDENTITY_MAP['9']
        },
        include: [
          {
            model: DB.user
          }
        ]
      })
      .then(res => res.map(item => item?.dataValues))
    if (!uData || uData.length == 0) {
      Send(Text('暂无申请'))
      return
    }
    const msg = []
    for (const item of uData) {
      msg.push(
        `\n标记:${item.id}_编号:${item['user.uid']}\n昵称:${item['user.name']}`
      )
    }
    sendReply(e, `[${aData.name}名录]`, msg)
    return
  },
  'message.create',
  /^(#|\/)?审核[\u4e00-\u9fa5]+$/
)
