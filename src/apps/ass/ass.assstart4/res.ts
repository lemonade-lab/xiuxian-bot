import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
const exiteCooling = {}
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const text = useParse(e.Megs, 'Text')

    const name = text.replace(/^(#|\/)?退出/, '')

    /**
     * ********
     * 存在该昵称的宗门
     */
    const aData = await DB.ass
      .findOne({
        where: {
          name: name
        }
      })
      .then(res => res?.dataValues)
    if (!aData) {
      e.reply('该势力不存在', {
        quote: e.msg_id
      })
      return
    }

    /**
     * ******
     * 查看是否是主人
     */
    const UserAss = await DB.user_ass
      .findOne({
        where: {
          uid: UID,
          aid: aData.id,
          identity: GameApi.Config.ASS_IDENTITY_MAP['0']
        }
      })
      .then(res => res?.dataValues)
    if (UserAss) {
      e.reply('个人势力不可退出', {
        quote: e.msg_id
      })
      return
    }

    // 不存在 或者过期了
    if (
      !exiteCooling[UID] ||
      exiteCooling[UID] + 30000 < new Date().getTime()
    ) {
      exiteCooling[UID] = new Date().getTime()
      e.reply(['[重要提示]', '\n请30s内再次发送', '\n以确认退出'], {
        quote: e.msg_id
      })
      return
    }

    await DB.user_ass
      .destroy({
        where: {
          uid: UID,
          aid: aData.id
        }
      })
      .then(() => {
        e.reply('已退出' + name, {
          quote: e.msg_id
        })
      })
  },
  'message.create',
  /^(#|\/)?退出[\u4e00-\u9fa5]+$/
)
