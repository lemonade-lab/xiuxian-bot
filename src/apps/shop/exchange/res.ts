import { controlByName, isUser } from '@xiuxian/api/index'
import * as DB from '@xiuxian/db/index'
import * as GameApi from '@xiuxian/core/index'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    // lock start
    const T = await GameApi.operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }
    // 从消息中获取用户ID
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    if (!(await controlByName(e, UserData, '联盟'))) return
    // 解析消息
    const text = useParse(e.Megs, 'Text')
    const [thingName, quantity] = text
      .replace(/^(#|\/)?(兑换|兌換)/, '')
      .split('*')
    const ifexist = await DB.goods
      .findOne({
        where: {
          alliancemall: 1,
          name: thingName
        }
      })
      .then(res => res?.dataValues)
    if (!ifexist) {
      Send(Text(`[联盟]叶铭\n没有[${thingName}]`))
      return
    }
    const price = Math.floor(ifexist.price * Number(quantity))
    if (UserData.special_reputation < price) {
      Send(Text(`[联盟]叶铭\n你似乎没有${price}*[声望]`))

      return
    }
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID)
    // 背包未位置了直接返回了
    if (!BagSize) {
      Send(Text('储物袋空间不足'))
      return
    }
    UserData.special_reputation -= price
    // 更新用户
    await DB.user.update(
      {
        special_reputation: UserData.special_reputation
      },
      {
        where: {
          uid: UID
        }
      }
    )
    //
    await GameApi.Bag.addBagThing(UID, [
      {
        name: ifexist.name,
        acount: Number(quantity)
      }
    ])
    //
    Send(
      Text(`[联盟]叶铭\n使用[声望]*${price}兑换了[${thingName}]*${quantity},`)
    )
    return
  },
  'message.create',
  /^(#|\/)?(兑换|兌換)[\u4e00-\u9fa5]+\*\d+$/
)
