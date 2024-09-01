import { isUser, sendReply } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { Messages } from 'alemonjs'
export default new Messages().response(
  /^(#|\/)?审核[\u4e00-\u9fa5]+$/,
  async e => {
    const UID = e.user_id
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const name = e.msg.replace(/^(#|\/)?审核/, '')
    const v = await GameApi.Ass.v(UID, name)
    if (v === false) return
    if (v === '权能不足') {
      e.reply(v)
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
      .then(res => res.map(item => item.dataValues))
    if (!uData || uData.length == 0) {
      e.reply('暂无申请')
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
  }
)
