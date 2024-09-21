import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const text = useParse(e.Megs, 'Text')

    const id = text.replace(/^(#|\/)?提拔/, '')
    if (!id) return
    const uData = await DB.user_ass
      .findOne({
        where: {
          uid: id
        },
        include: [
          {
            model: DB.ass
          }
        ]
      })
      .then(res => res?.dataValues)
    // 不存在该玩家
    if (!uData) return
    if (!(uData.authentication - 1)) {
      e.reply('权能已达最高')
      return
    }
    const v = await GameApi.Ass.v(UID, uData['ass.name'])
    if (v === false) return
    if (v === '权能不足') {
      e.reply(v)
      return
    }
    const { UserAss } = v
    if (uData.authentication <= UserAss.authentication) {
      e.reply('权能过低')
      return
    }
    uData.authentication -= 1
    uData.identity = GameApi.Config.ASS_IDENTITY_MAP[uData.authentication]
    await DB.user_ass
      .update(uData, {
        where: {
          uid: id
        }
      })
      .then(() => {
        e.reply('提拔成功', {
          quote: e.msg_id
        })
      })
      .catch(() => {
        e.reply('提拔失败', {
          quote: e.msg_id
        })
      })

    return
  },
  'message.create',
  /^(#|\/)?提拔.*$/
)
