import { Messages } from 'alemonjs'
import { controlByName, isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { user } from 'xiuxian-db'
import { operationLock } from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(贡献|貢獻)[\u4e00-\u9fa5]+\*\d+$/,
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
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await user
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res.dataValues)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const [thingName, quantity] = e.msg
      .replace(/^(#|\/)?(贡献|貢獻)/, '')
      .split('*')
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      e.reply(`[联盟]黄天霸\n你没[${thingName}]`)

      return
    }
    if (thing.acount < Number(quantity)) {
      e.reply('[联盟]黄天霸\n数量不足')

      return
    }
    if (thing.price * Number(quantity) < 2000) {
      e.reply('[联盟]黄天霸\n物品价值不足2000')
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
    e.reply(`[联盟]黄天霸\n贡献成功,奖励[声望]*${size}`)

    return
  }
)
