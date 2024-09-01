import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
import { Messages } from 'alemonjs'
export default new Messages().response(/^(#|\/)?势力信息$/, async e => {
  const UID = e.user_id
  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  // 需要关联外键
  const UserAss = await DB.user_ass
    .findAll({
      where: {
        uid: UID
      },
      include: [
        {
          model: DB.ass,
          include: [
            {
              model: DB.ass_typing
            }
          ]
        }
      ]
    })
    .then(res => res.map(item => item.dataValues))

  if (!UserAss || UserAss?.length == 0) {
    e.reply('未加入任何势力', {
      quote: e.msg_id
    })
    return
  }

  for (const item of UserAss) {
    // 待加入
    if (item.identity == GameApi.Config.ASS_IDENTITY_MAP['9']) {
      e.reply([
        `🏹[${item['ass.name']}]-${item[`ass.ass_typing.${item.identity}`]}`
      ])
    } else {
      e.reply([
        `🏹[${item['ass.name']}]-${item['ass.grade']}`,
        `\n身份:${item[`ass.ass_typing.${item.identity}`]}`,
        `\n灵池:${item[`ass.property`]}`,
        `\n活跃:${item['ass.activation']}`,
        `\n名气:${item['ass.fame']}`,
        `\n贡献:${item['contribute']}`
      ])
    }
  }

  return
})
