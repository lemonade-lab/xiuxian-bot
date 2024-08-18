import { isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { Messages } from 'alemonjs'
export default new Messages().response(/^(#|\/)?踢出\d+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const id = Number(e.msg.replace(/^(#|\/)?踢出/, ''))
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
  if (v === '权能不足') {
    e.reply(v)
    return
  }
  const { UserAss } = v

  if (uData.authentication <= UserAss.authentication) {
    e.reply('权能过低')
    return
  }

  await DB.user_ass
    .destroy({
      where: {
        id: Number(id)
      }
    })
    .then(() => {
      e.reply('踢出成功', {
        quote: e.msg_id
      })
    })
    .catch(() => {
      e.reply('踢出失败', {
        quote: e.msg_id
      })
    })

  return
})
