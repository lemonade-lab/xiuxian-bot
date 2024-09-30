import { Text, useParse, useSend } from 'alemonjs'
import { isSideUser } from 'xiuxian-api'
import { Bag } from 'xiuxian-core'
import { goods } from 'xiuxian-db'
export default OnResponse(
  async e => {
    if (!e.IsMaster) return
    const text = useParse(e.Megs, 'Text')
    if (!text) return
    const [UID, Name, Count] = text.replace(/(#|\/)?天道裁决/, '').split('*')
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
    const Send = useSend(e)
    // 物品不存在
    if (!ifexist) {
      Send(Text(`未找到[${Name}]`))
      return
    }
    //
    const BagSize = await Bag.backpackFull(UID)
    if (!BagSize) {
      // 储物袋空间不足
      Send(Text(`储物袋空间不足`))
      return
    }
    await Bag.addBagThing(UID, [
      {
        name: ifexist.name,
        acount: Number(Count) ?? 1
      }
    ])
    Send(Text(`已添加[${Name}]*${Count}`))
    return
  },
  'message.create',
  /^(#|\/)?天道裁决/
)
