import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
import { Messages } from 'alemonjs'
const delCooling = {}
export default new Messages().response(/^(#|\/)?解散$/, async e => {
  const UID = e.user_id
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
  if (!UserAss) {
    e.reply('未创立个人势力', {
      quote: e.msg_id
    })

    return
  }

  // 不存在 或者过期了
  if (!delCooling[UID] || delCooling[UID] + 30000 < new Date().getTime()) {
    delCooling[UID] = new Date().getTime()
    e.reply(
      [
        '[重要提示]',
        '\n解散将清除所有数据且不可恢复',
        '\n请30s内再次发送',
        '\n[/解散]',
        '\n以确认解散'
      ],
      {
        quote: e.msg_id
      }
    )
    return
  }

  const id = UserAss.aid

  // 删除所有 aid的记录
  await DB.user_ass.destroy({
    where: {
      aid: id
    }
  })

  // 删除所有aid记录

  await DB.ass_bag.destroy({
    where: {
      aid: id
    }
  })

  // 删除id
  await DB.ass.destroy({
    where: {
      id: id
    }
  })

  e.reply(['成功解散'], {
    quote: e.msg_id
  })
  return
})
