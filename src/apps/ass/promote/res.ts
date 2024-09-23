import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { Text, useParse, useSend } from 'alemonjs'
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
    const Send = useSend(e)
    if (!(uData.authentication - 1)) {
      Send(Text('权能已达最高'))
      return
    }
    const v = await GameApi.Ass.v(UID, uData['ass.name'])
    if (v === false) return
    if (v === '权能不足') {
      Send(Text(v))
      return
    }
    const { UserAss } = v
    if (uData.authentication <= UserAss.authentication) {
      Send(Text('权能过低'))
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
        Send(Text('提拔成功'))
      })
      .catch(err => {
        console.error(err)
        Send(Text('提拔失败'))
      })

    return
  },
  'message.create',
  /^(#|\/)?提拔.*$/
)
