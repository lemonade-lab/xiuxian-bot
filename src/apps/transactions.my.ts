import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { operationLock } from 'xiuxian-core'
import { transactions } from 'xiuxian-db'
import { pictureRender } from 'xiuxian-img'
export default new Messages().response(/^(#|\/)?我(出售|售出)的$/, async e => {
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  //
  const UID = e.user_id
  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  transactions
    .findAll({
      where: {
        uid: UID
      }
    })
    .then(res => res.map(item => item.dataValues))
    .then(async res => {
      if (res.length === 0) {
        e.reply('没有找到数据')
        return
      }

      // 返回物品信息
      const img = await pictureRender('TransactionMessage', {
        name: 'TransactionMessage',
        props: {
          data: {
            page: 1,
            goods: res
          },
          theme: UserData.theme
        }
      })

      //
      if (Buffer.isBuffer(img)) {
        e.reply(img)
      } else {
        e.reply('截图错误')
      }
    })
    .catch(err => {
      console.error(err)
      e.reply('数据错误')
    })
})
