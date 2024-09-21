import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import { pictureRender } from 'xiuxian-img'
import { showSky } from 'xiuxian-statistics'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    // 查看数据是否存在
    const data = await DB.sky
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)

    if (!data) {
      e.reply('未进入', {
        quote: e.msg_id
      })
      return
    }

    const sData = await showSky(UID)

    const img = await pictureRender('SkyComponent', {
      props: {
        data: sData,
        theme: UserData?.theme ?? 'dark'
      },
      name: UID
    })

    if (typeof img != 'boolean') {
      e.reply(img)
    }
    //
  },
  'message.create',
  /^(#|\/)?(通天塔|至尊榜|天命榜)$/
)
