import { Messages } from 'alemonjs'
import { isThereAUserPresent, punishLevel } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?渡劫$/, async e => {
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
  if (!(await GameApi.Levels.isLevelPoint(UID, 1))) {
    e.reply(['尚未感知到雷劫'], {
      quote: e.msg_id
    })
    return
  }
  // 获取用户信息
  const UserData = await DB.user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  //雷劫次数
  let num = 0
  // 概率
  /**
   * 开始触发
   */
  setTimeout(() => {
    e.reply('“云聚霞散露真形，天雷滚滚预兆生....')
  }, 1500)
  setTimeout(() => {
    e.reply('忽然间风云变幻,乌云密布,竟然是九九灭世之雷悬于苍穹之上！')
  }, 3000)
  setTimeout(() => {
    e.reply(`${UserData.name}屹立于此，眼含决意。灵气凝聚，雷霆万钧`)
  }, 4500)
  /**
   * 进入渡劫模式
   */
  let time = setInterval(async function () {
    GameApi.State.set(UID, {
      actionID: 5,
      startTime: 7,
      endTime: 6
    })
    let variable: number = Math.random() * (400000 - 340000) + 340000
    if (UserData.battle_blood_now > 0) {
      if (num) {
        num++
        e.reply(
          `本次雷劫造成的伤害为 ${Math.floor(variable)},恭喜 ${UserData.name} 成功挺过了雷劫.\n
           请做好准备，下一道雷劫将在一分钟后降临！
           `
        )
      } else {
        GameApi.State.del(UID)
        e.reply(`${UserData.name}成功渡过最后一道雷劫,渡劫成仙`)
        await DB.user_level.update(
          { realm: 42 },
          { where: { uid: UID, type: 1 } }
        )
        clearInterval(time)
      }
    } else {
      GameApi.State.del(UID)
      await punishLevel(e, UID, UserData)
      punishLevel(e, UID, UserData)
      clearInterval(time)
    }
  }, 60000) // 每分钟执行一次
})
