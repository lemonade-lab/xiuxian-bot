import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?进入通天塔$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
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
})
