import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    //查看数据是否存在
    const data = await DB.sky
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)

    if (data) {
      e.reply('已进入', {
        quote: e.msg_id
      })

      return
    }
    // 查看奖励
    e.reply(['进入[通天塔]'], {
      quote: e.msg_id
    })

    await DB.sky.create({
      uid: UID
    })
  },
  'message.create',
  /^(#|\/)?进入通天塔$/
)
