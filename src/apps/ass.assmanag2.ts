import { isThereAUserPresent } from 'xiuxian-api'
import { Op } from 'sequelize'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { Messages } from 'alemonjs'
export default new Messages().response(/^(#|\/)?通过\d+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return

  const id = Number(e.msg.replace(/^(#|\/)?通过/, ''))

  if (!id) return

  const uData = await DB.user_ass
    .findOne({
      where: {
        id: Number(id),
        identity: GameApi.Config.ASS_IDENTITY_MAP['9']
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

  const { aData } = v

  const data = await DB.user_ass
    .findAll({
      where: {
        aid: aData.id,
        identity: { [Op.ne]: GameApi.Config.ASS_IDENTITY_MAP['9'] }
      }
    })
    .then(res => res.map(item => item.dataValues))

  if (data.length >= (aData.grade + 1) * 5) {
    e.reply('人数已达上限', {
      quote: e.msg_id
    })
    return
  }

  await DB.user_ass
    .update(
      {
        identity: GameApi.Config.ASS_IDENTITY_MAP['8']
      },
      {
        where: {
          id: Number(id)
        }
      }
    )
    .then(() => {
      e.reply('审核通过', {
        quote: e.msg_id
      })
    })
    .catch(() => {
      e.reply('审核失败', {
        quote: e.msg_id
      })
    })

  return
})
