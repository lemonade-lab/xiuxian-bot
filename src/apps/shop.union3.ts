import { Messages } from 'alemonjs'
import { controlByName, isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(兑换|兌換)[\u4e00-\u9fa5]+\*\d+$/,
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const T = await operationLock(e.user_id)
    if (!T) {
      e.reply('操作频繁')
      return
    }
    /**
     * lock end
     */

    const UID = e.user_id

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    if (!(await controlByName(e, UserData, '联盟'))) return
    const [thingName, quantity] = e.msg
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
      e.reply(`[联盟]叶铭\n没有[${thingName}]`)
      return
    }
    const price = Math.floor(ifexist.price * Number(quantity))
    if (UserData.special_reputation < price) {
      e.reply(`[联盟]叶铭\n你似乎没有${price}*[声望]`)
      return
    }
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })

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
    e.reply(`[联盟]叶铭\n使用[声望]*${price}兑换了[${thingName}]*${quantity},`)
    return
  }
)
