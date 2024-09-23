import { isUser } from 'xiuxian-api'
import { Op } from 'sequelize'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const text = useParse(e.Megs, 'Text')
    const id = Number(text.replace(/^(#|\/)?通过/, ''))
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
    const Send = useSend(e)
    if (v === '权能不足') {
      Send(Text(v))
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
      .then(res => res.map(item => item?.dataValues))

    if (data.length >= (aData.grade + 1) * 5) {
      Send(Text('人数已达上限'))
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
        Send(Text('审核通过'))
      })
      .catch(err => {
        console.error(err)
        Send(Text('审核失败'))
      })

    return
  },
  'message.create',
  /^(#|\/)?通过\d+$/
)
