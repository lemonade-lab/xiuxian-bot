import { isUser } from '@xiuxian/api/index'
import { Op } from 'sequelize'
import * as DB from '@xiuxian/db/index'
import * as GameApi from '@xiuxian/core/index'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    //
    const text = useParse(e.Megs, 'Text')

    //
    const id = Number(text.replace(/^(#|\/)?通过/, ''))

    //
    if (!id) return

    //
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

    const Send = useSend(e)
    // 不存在该条目
    if (!uData) {
      Send(Text('非待通过编号'))
      return
    }

    const aData = await DB.ass
      .findOne({
        where: {
          name: uData['ass.name']
        },
        include: [
          {
            model: DB.ass_typing
          }
        ]
      })
      .then(res => res?.dataValues)
      .catch(err => console.error(err))

    // 不存在
    if (!aData) {
      console.log('势力不存在', aData)
      return false
    }

    //
    const UserAss = await DB.user_ass
      .findOne({
        where: {
          uid: UID, // uid
          aid: aData.id
        }
      })
      .then(res => res?.dataValues)

    // 不存在，或者 9
    if (!UserAss || UserAss?.authentication == 9) {
      Send(Text('不属于该宗门'))
      return
    }

    // 大于4
    if (UserAss.authentication >= 4) {
      Send(Text('权能不足'))
      return
    }

    const count = await DB.user_ass.count({
      where: {
        aid: aData.id,
        // 排除
        identity: { [Op.ne]: GameApi.Config.ASS_IDENTITY_MAP['9'] }
      }
    })

    if (count >= (aData.grade + 1) * 5) {
      Send(Text('人数已达上限'))
      return
    }

    // 修改指定用户的身份
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
