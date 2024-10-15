import { Text, useParse, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
import * as DB from '@xiuxian/db/index'
// 查看该宗门都有谁
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const text = useParse(e.Megs, 'Text')
    const name = text.replace(/^(#|\/)?查看/, '')

    // 查看该宗门中。关于自己的信息和宗门的信息。

    const AData = await DB.ass
      .findOne({
        where: {
          name: name
        }
      })
      .then(res => res?.dataValues)
      .catch(err => console.error(err))

    const Send = useSend(e)
    if (!AData) {
      Send(Text('该势力不存在'))
      return
    }

    // 查看个人信息，确保有权限

    const UADatas = await DB.user_ass
      .findAll({
        where: {
          aid: AData.id
        },
        include: [
          {
            model: DB.user
          },
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
      .then(res => res.map(res => res.dataValues))
      .catch(err => console.error(err))

    if (!UADatas) {
      Send(Text('势力数据异常'))
      return
    }

    const UAData = UADatas.find(item => item.uid == UID)

    if (!UAData || UAData.identity == GameApi.Config.ASS_IDENTITY_MAP['9']) {
      Send(Text(`未加入${name}`))
      return
    }

    const msg = [
      `🏹[${AData['name']}]-${AData['grade']}`,
      `灵池:${AData[`property`]}`,
      `活跃:${AData['activation']}`,
      `名气:${AData['fame']}`
    ]

    UADatas.forEach(item => {
      const usermsg = item['user']['dataValues']
      const assmsg = item['ass']['dataValues']
      const asstypingmsg = assmsg['ass_typing']['dataValues']
      msg.push(
        `标记:${item.id},道号:${usermsg.name},身份:${asstypingmsg[item.identity]},权限:${item.authentication},贡献:${item.contribute}`
      )
    })

    Send(Text(msg.join('\n')))

    return
  },
  'message.create',
  /^(#|\/)?查看[\u4e00-\u9fa5]+$/
)
