import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import { picture } from 'xiuxian-img'
import * as DB from 'xiuxian-db'
import { showSky } from 'xiuxian-statistics'
export default new Messages().response(/^(#|\/)?通天塔$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
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
      data: sData
    },
    name: UID
  })
  if (typeof img != 'boolean') {
    e.reply(img)
  }
})
