import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
const reGiveup = {}
export default new Messages().response(/^(#|\/)?命解$/, async e => {
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

  const thing = await DB.user_fate
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
  //
  if (!thing) {
    e.reply(['未有本命物品'], {
      quote: e.msg_id
    })
    return
  }

  // 不存在 或者过期了
  if (!reGiveup[UID] || reGiveup[UID] + 30000 < new Date().getTime()) {
    reGiveup[UID] = new Date().getTime()
    e.reply(['[重要提示]\n请30s内再次发送[/命解]', '\n以确认命解'], {
      quote: e.msg_id
    })
    return
  }

  // 根据物品等级来消耗气血  1000
  const size = thing.grade * 1000
  // 看看经验
  const LevelMsg = await DB.user_level
    .findOne({
      attributes: ['addition', 'realm', 'experience'],
      where: {
        uid: UID,
        type: 2
      }
    })
    .then(res => res?.dataValues)
  if (LevelMsg.experience < size) {
    e.reply([`需要消耗[气血]*${size}~`], {
      quote: e.msg_id
    })
    return
  }

  const BagSize = await GameApi.Bag.backpackFull(UID)
  // 背包未位置了直接返回了
  if (!BagSize) {
    e.reply(['储物袋空间不足'], {
      quote: e.msg_id
    })
    return
  }

  // 清除询问
  delete reGiveup[UID]

  // 减少气血
  await GameApi.Levels.reduceExperience(UID, 1, size)
  // 返回物品
  await GameApi.Bag.addBagThing(UID, [
    {
      name: thing.name,
      acount: thing.grade + 1
    }
  ])
  // 删除数据
  await DB.user_fate.destroy({
    where: {
      uid: UID
    }
  })
  // 返回
  e.reply([`成功从灵根处取出[${thing.name}]`], {
    quote: e.msg_id
  })
  return
})
