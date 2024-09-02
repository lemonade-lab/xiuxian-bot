import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { Bag, operationLock } from 'xiuxian-core'
import { Redis } from 'xiuxian-db'
import { createUID } from 'xiuxian-img'
export default new Messages().response(/^(#|\/)交易所得/, async e => {
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }

  const UID = e.user_id
  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  // 存入临时数据
  const KEY = `xiuxian:money:${createUID(UID)}`

  const log = await Redis.get(KEY)

  if (!log) {
    e.reply('无所得')
    return
  }

  const BagSize = await Bag.backpackFull(UID)
  // 背包未位置了直接返回了
  if (!BagSize) {
    e.reply(['储物袋空间不足'], {
      quote: e.msg_id
    })
    return
  }

  const [name, count] = log.split('*')

  // 加物品
  await Bag.addBagThing(UID, [
    {
      name: name,
      acount: Number(count)
    }
  ])

  e.reply(`获得[${name}]*${count}`)
})
