import { Text, useSend } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { Bag, operationLock } from 'xiuxian-core'
import { Redis } from 'xiuxian-db'
import { createUID } from 'xiuxian-img'
export default OnResponse(
  async e => {
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    // 存入临时数据
    const KEY = `xiuxian:money:${createUID(UID)}`
    const log = await Redis.get(KEY)
    if (!log) {
      Send(Text('无所得'))
      return
    }
    const BagSize = await Bag.backpackFull(UID)
    // 背包未位置了直接返回了
    if (!BagSize) {
      Send(Text('储物袋空间不足'))
      return
    }
    const [name, count] = log.split('*')
    await Redis.del(KEY)
    // 加物品
    await Bag.addBagThing(UID, [
      {
        name: name,
        acount: Number(count)
      }
    ])
    Send(Text(`获得[${name}]*${count}`))
  },
  'message.create',
  /^(#|\/)?交易所得/
)
