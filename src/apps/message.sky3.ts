import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { picture } from 'xiuxian-img'
import * as DB from 'xiuxian-db'
import { showSky } from 'xiuxian-statistics'
export default new Messages().response(
  /^(#|\/)?(通天塔|至尊榜|天命榜)$/,
  async e => {
    const UID = e.user_id

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

    const img = await picture.render('SkyComponent', {
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
  }
)
