import { Messages } from 'alemonjs'
import { operationLock } from 'xiuxian-core'
import { goods, transactions } from 'xiuxian-db'
/**
 *
 */
export default new Messages().response(
  /^(#|\/)物品信息[\u4e00-\u9fa5]+/,
  async e => {
    const T = await operationLock(e.user_id)
    if (!T) {
      e.reply('操作频繁')
      return
    }
    //
    const name = e.msg.replace(/^(#|\/)物品信息/, '').trim()
    // goods.findOne({ where: { name } }).then(res => res.dataValues).then(res => {
    //   // 直接发图片更方便
    // })
  }
)
