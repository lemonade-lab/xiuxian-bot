import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Redis, user, user_skills } from 'xiuxian-db'
export default new Messages().response(
  /^(#|\/)?(学习|學習)[\u4e00-\u9fa5]+$/,
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
    const thingName = e.msg.replace(/^(#|\/)?(学习|學習)/, '')
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }

    const AllSorcery = await user_skills
      .findAll({ where: { uid: UID } })
      .then(res => res.map(item => item.dataValues))
    const islearned = AllSorcery.find(item => item.name == thingName)
    if (islearned) {
      e.reply(['学过了'], {
        quote: e.msg_id
      })
      return
    }

    if (AllSorcery.length >= GameApi.Cooling.myconfig_gongfa) {
      e.reply(['反复看了又看\n却怎么也学不进'], {
        quote: e.msg_id
      })
      return
    }

    /**
     * 新增功法
     */
    await user_skills.create({ uid: UID, name: thing.name })

    // 更新天赋
    setTimeout(async () => {
      const UserData = await user
        .findOne({
          where: {
            uid: UID
          }
        })
        .then(res => res.dataValues)
      await GameApi.Skills.updataEfficiency(UID, UserData.talent)
    }, 1000)
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: 1
      }
    ])
    e.reply([`学习[${thingName}]`], {
      quote: e.msg_id
    })
    return
  }
)
