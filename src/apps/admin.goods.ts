import { Messages } from 'alemonjs'
import { isSideUser } from 'xiuxian-api'
import { Bag } from 'xiuxian-core'
import { goods } from 'xiuxian-db'
// import * as DB from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?天道裁决/, async e => {
  if (!e.isMaster) return
  //
  const [UID, Name, Count] = e.msg.replace(/(#|\/)?天道裁决/, '').split('*')
  console.warn('ADMIN', UID, Name, Count)
  const UserData = await isSideUser(e, UID)
  if (typeof UserData == 'boolean') return
  // 查阅物品
  const ifexist = await goods
    .findOne({
      where: {
        name: Name // 找到物品名
      }
    })
    .then(res => res?.dataValues)
  // 物品不存在
  if (!ifexist) {
    e.reply(`未找到[${Name}]`)
    return
  }
  //
  const BagSize = await Bag.backpackFull(UID)
  if (!BagSize) {
    e.reply(['储物袋空间不足'], {
      quote: e.msg_id
    })
    return
  }

  await Bag.addBagThing(UID, [
    {
      name: ifexist.name,
      acount: Number(Count) ?? 1
    }
  ])

  e.reply(['操作完成'], {
    quote: e.msg_id
  })

  return
})
