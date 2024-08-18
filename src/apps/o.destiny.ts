import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?炼化[\u4e00-\u9fa5]+$/,
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const KEY = `xiuxian:open:${e.user_id}`
    const LOCK = await DB.Redis.get(KEY)
    if (LOCK) {
      e.reply('操作频繁')
      return
    }
    await DB.Redis.set(KEY, 1, 'EX', 6)
    /**
     * lock end
     */

    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    // 检查是否已有卡槽
    const T = await DB.user_fate
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)
    if (T) {
      e.reply(['已有本命物品'], {
        quote: e.msg_id
      })
      return
    }
    // 检查物品
    const thingName = e.msg.replace(/^(#|\/)?炼化/, '')
    const bagThing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!bagThing) {
      e.reply([`没[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    // 根据物品等级来消耗修为  1000
    const size = bagThing.grade * 1000
    // 看看经验
    const LevelMsg = await GameApi.Levels.read(UID, 1)
    if (LevelMsg.experience < size) {
      e.reply([`需要消耗[修为]*${size}~`], {
        quote: e.msg_id
      })
      return
    }
    // 减少修为
    await GameApi.Levels.reduceExperience(UID, 1, size)
    // 新增数据
    await DB.user_fate.create({
      uid: UID,
      name: bagThing.name,
      grade: 0
    })
    const UserData = await GameApi.Users.read(UID)
    // 减少物品
    await GameApi.Bag.reduceBagThing(UID, [{ name: thingName, acount: 1 }])
    // 更新面板?
    await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
    // 返回
    e.reply([`成功炼化[${bagThing.name}]`], {
      quote: e.msg_id
    })
    return
  }
)
