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
    const id = Number(text.replace(/^(#|\/)?踢出/, ''))
    if (!id) return
    const uData = await DB.user_ass
      .findOne({
        where: {
          id: Number(id)
        },
        include: [
          {
            model: DB.ass
          }
        ]
      })
      .then(res => res?.dataValues)

    // 不存在该条目
    if (!uData) return

    const v = await GameApi.Ass.v(UID, uData['ass.name'])
    if (v === false) return
    const Send = useSend(e)
    if (v === '权能不足') {
      Send(Text(v))
      return
    }
    const { UserAss } = v

    if (uData.authentication <= UserAss.authentication) {
      Send(Text('权能过低'))
      return
    }

    await DB.user_ass
      .destroy({
        where: {
          id: Number(id)
        }
      })
      .then(() => {
        Send(Text('踢出成功'))
      })
      .catch(() => {
        Send(Text('踢出失败'))
      })

    return
  },
  'message.create',
  /^(#|\/)?踢出\d+$/
)
