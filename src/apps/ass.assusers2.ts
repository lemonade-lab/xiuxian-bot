import { Messages } from 'alemonjs'
import { Op } from 'sequelize'
import { isThereAUserPresent, sendReply } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
export default new Messages().response(
  /^(#|\/)?查看[\u4e00-\u9fa5]+$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const name = e.msg.replace(/^(#|\/)?查看/, '')
    const v = await GameApi.Ass.v(UID, name)
    if (v == false) return
    if (v == '权能不足') {
      e.reply(v)
      return
    }
    const { aData } = v

    e.reply([
      `🏹[${aData['name']}]-${aData['grade']}`,
      `\n灵池:${aData[`property`]}`,
      `\n活跃:${aData['activation']}`,
      `\n名气:${aData['fame']}`
    ])

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
  }
)
