import { controlByName, isUser } from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
import { user } from '@xiuxian/db/index'
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
      .replace(/^(#|\/)?(贡献|貢獻)/, '')
      .split('*')
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      Send(Text(`[联盟]黄天霸\n没有[${thingName}]`))
      return
    }
    if (thing.acount < Number(quantity)) {
      Send(Text(`[联盟]黄天霸\n数量不足`))
      return
    }
    if (thing.price * Number(quantity) < 2000) {
      Send(Text(`[联盟]黄天霸\n物品价值不足2000`))
      return
    }
    // 减少
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: Number(quantity)
      }
    ])
    const size = Math.floor((thing.price * Number(quantity)) / 66)
    // 更新用户
    await user.update(
      {
        special_reputation: UserData.special_reputation + size
      },
      {
        where: {
          uid: UID
        }
      }
    )
    Send(Text(`[联盟]黄天霸\n贡献成功,奖励[声望]*${size}`))
    return
  },
  'message.create',
  /^(#|\/)?(贡献|貢獻)[\u4e00-\u9fa5]+\*\d+$/
)
