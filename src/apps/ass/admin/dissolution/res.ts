import { Text, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
import * as DB from '@xiuxian/db/index'
const delCooling = {}
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    // 查看自己的宗门
    const UserAss = await DB.user_ass
      .findOne({
        where: {
          uid: UID, // uid
          identity: GameApi.Config.ASS_IDENTITY_MAP['0'] // 身份
        }
      })
      .then(res => res?.dataValues)
      .catch(err => console.error(err))

    const Send = useSend(e)

    if (!UserAss) {
      Send(Text('未创立个人势力'))
      return
    }

    // 不存在 或者过期了
    if (!delCooling[UID] || delCooling[UID] + 30000 < new Date().getTime()) {
      delCooling[UID] = new Date().getTime()
      Send(
        Text(
          [
            '[重要提示]',
            '\n解散将清除所有数据且不可恢复',
            '\n请30s内再次发送',
            '\n[/解散]',
            '\n以确认解散'
          ].join('')
        )
      )
      return
    }

    const aid = UserAss.aid

    // 删除所有玩家
    await DB.user_ass.destroy({
      where: {
        aid: aid
      }
    })

    // 删除背包
    await DB.ass_bag.destroy({
      where: {
        aid: aid
      }
    })

    // 删除势力
    await DB.ass.destroy({
      where: {
        id: aid
      }
    })

    Send(Text('成功解散'))

    return
  },
  'message.create',
  /^(#|\/)?解散$/
)
