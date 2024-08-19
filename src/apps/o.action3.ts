import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Redis, user, user_skills } from 'xiuxian-db'
export default new Messages().response(
  /^(#|\/)?忘掉[\u4e00-\u9fa5]+$/,
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const KEY = `xiuxian:open:${e.user_id}`
    const LOCK = await Redis.get(KEY)
    if (LOCK) {
      e.reply('操作频繁')
      return
    }
    await Redis.set(KEY, 1, 'EX', 6)
    /**
     * lock end
     */

    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return

    const thingName = e.msg.replace(/^(#|\/)?忘掉/, '')
    const AllSorcery = await user_skills
      .findAll({ where: { uid: UID } })
      .then(res => res.map(item => item.dataValues))
    const islearned = AllSorcery.find(item => item.name == thingName)
    if (!islearned) {
      e.reply([`没学过[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }

    const UserData = await user
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res.dataValues)
    /**
     * 检查背包
     */
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }

    // 直接删
    await user_skills.destroy({ where: { uid: UID, name: thingName } })

    /**
     * 更新天赋
     */
    setTimeout(async () => {
      const UserData = await user
        .findOne({
          where: {
            uid: UID
          }
        })
        .then(res => res.dataValues)
      await GameApi.Skills.updataEfficiency(UID, UserData.talent)
    }, 500)

    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      { name: islearned.name, acount: 1 }
    ])

    e.reply([`忘了[${thingName}]`], {
      quote: e.msg_id
    })
    return
  }
)
