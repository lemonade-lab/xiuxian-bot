import { Text, useParse, useSend } from 'alemonjs'
import { Op } from 'sequelize'
import { isUser, sendReply } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const text = useParse(e.Megs, 'Text')
    const name = text.replace(/^(#|\/)?查看/, '')
    const v = await GameApi.Ass.v(UID, name)
    if (v == false) return
    const Send = useSend(e)
    if (v == '权能不足') {
      Send(Text(v))
      return
    }
    const { aData } = v
    Send(
      Text(
        [
          `🏹[${aData['name']}]-${aData['grade']}`,
          `\n灵池:${aData[`property`]}`,
          `\n活跃:${aData['activation']}`,
          `\n名气:${aData['fame']}`
        ].join('')
      )
    )
    const uData = await DB.user_ass
      .findAll({
        where: {
          aid: aData.id,
          identity: { [Op.ne]: GameApi.Config.ASS_IDENTITY_MAP['9'] }
        },
        include: [
          {
            model: DB.user
          }
        ]
      })
      .then(res => res.map(item => item.dataValues))
    const msg = []
    for (const item of uData) {
      console.log(item)
      msg.push(
        `\n🔹标记:${item.id}_道号[${item['user.name']}]\n身份:${
          aData[`ass_typing.${item.identity}`]
        }_贡献:${item['contribute']}`
      )
    }
    sendReply(e, `🏹[${aData['name']}]-${aData['grade']}`, msg)
    return
  },
  'message.create',
  /^(#|\/)?查看[\u4e00-\u9fa5]+$/
)
