import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { Bag, operationLock, order } from 'xiuxian-core'
import { transactions } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?下架/, async e => {
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }

  const UID = e.user_id
  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  const id = e.msg.replace(/^(#|\/)?下架/, '').trim()
  if (!id || id == '' || isNaN(Number(id))) {
    e.reply('请输入正确的编号')
    return
  }

  // 查询物品
  const data = await transactions
    .findOne({
      where: {
        uid: UID,
        id: Number(id)
      }
    })
    .then(res => res?.dataValues)

  if (!data) {
    e.reply('没有找到该物品')
    return
  }

  // 删除物品
  const Del = await order.delThing(data.id)
  if (!Del) {
    e.reply('交易频繁')
    return
  }

  // 加物品
  await Bag.addBagThing(UID, [
    {
      name: data.name,
      acount: data.count
    }
  ])

  e.reply('下架操作完成')
})
