import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { goods } from 'xiuxian-db'
import { pictureRender } from 'xiuxian-img'
export default new Messages().response(
  /^(#|\/)查询物品[\u4e00-\u9fa5]+/,
  async e => {
    const UID = e.user_id
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    // 获取物品名称
    const name = e.msg.replace(/^(#|\/)查询物品/, '').trim()
    // 查询物品信息
    goods
      .findOne({ where: { name } })
      .then(res => res?.dataValues)
      .then(async res => {
        if (!res) {
          e.reply('未找到该物品')
          return
        }
        // 返回物品信息
        const img = await pictureRender('GoodMessage', {
          name: 'GoodMessage',
          props: { data: res, theme: UserData.theme }
        })
        if (Buffer.isBuffer(img)) {
          e.reply(img)
        } else {
          e.reply('截图错误')
        }
      })
      .catch(() => {
        e.reply('未找到该物品')
      })
  }
)
