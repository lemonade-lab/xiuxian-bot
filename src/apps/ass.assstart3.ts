import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
import { Messages } from 'alemonjs'
export default new Messages().response(
  /^(#|\/)?加入[\u4e00-\u9fa5]+$/,
  async e => {
    const UID = e.user_id
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    /**
     * 查看是否是主人
     */
    const UserAss = await DB.user_ass
      .findOne({
        where: {
          uid: UID,
          identity: GameApi.Config.ASS_IDENTITY_MAP['0']
        }
      })
      .then(res => res?.dataValues)
    if (UserAss) {
      e.reply('已创立个人势力', {
        quote: e.msg_id
      })
      return
    }

    /**
     * 加入xxx
     */
    const name = e.msg.replace(/^(#|\/)?加入/, '')

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
     * 检测是否已提交申请
     */
    const joinData = await DB.user_ass
      .findOne({
        where: {
          uid: UID,
          aid: aData.id,
          identity: GameApi.Config.ASS_IDENTITY_MAP['9']
        }
      })
      .then(res => res?.dataValues)
    if (joinData) {
      e.reply('已提交申请,请勿重复提交', {
        quote: e.msg_id
      })
      return
    }

    /**
     * 创建信息条目
     */
    await DB.user_ass.create({
      create_tiime: new Date().getTime(),
      uid: UID,
      aid: aData.id,
      authentication: 9,
      identity: GameApi.Config.ASS_IDENTITY_MAP['9']
    })

    e.reply('已提交申请', {
      quote: e.msg_id
    })
    return
  }
)
