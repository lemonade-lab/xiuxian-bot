import { APlugin, type AEvent } from 'alemonjs'
import { DB, isThereAUserPresent, GameApi } from '../../api/index.js'

export class fairyland extends APlugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)?渡劫$/, fnc: 'breakLevel' }]
    })
  }

  /**
   * 渡劫
   * 成就仙人境
   * @param e
   * @returns
   */
  async breakLevel(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    if (!(await GameApi.Levels.isLevelPoint(UID, 1))) {
      e.reply(['尚未感知到雷劫'], {
        quote: e.msg_id
      })
      return
    }
    const name = ['长生泉', '灵烛果', '金焰石', '养魂木', '息壤之土']
    for (let i = 0; i < name.length; i++) {
      const thing: DB.UserBagType = (await DB.user_bag.findOne({
        where: { uid: UID, name: name[i] },
        raw: true
      })) as any
      if (thing && thing.acount >= 5) {
        return e.reply(`${name[i]}不足`)
      }
    }
    for (let i = 0; i < name.length; i++) {
      const thing: DB.UserBagType = (await DB.user_bag.findOne({
        where: { uid: UID, name: name[i] },
        raw: true
      })) as any

      if (thing && thing.acount >= 5) {
        GameApi.Bag.reduceBagThing(UID, [{ name: thing.name, acount: 5 }])
      }
    }

    // 获取用户信息
    const UserData = await GameApi.Users.read(UID)
    //雷劫次数
    let num = 5 - UserData.talent.length + 1
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
      num++
      let variable: number = Math.random() * (300000 - 240000) + 240000
      if (UserData.battle_blood_now > 0) {
        if (num != UserData.talent.length) {
          e.reply(
            `本次雷劫造成的伤害为 ${Math.floor(variable)}.
            恭喜 ${UserData.name} 成功挺过了第 ${num} 道雷劫.\n
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
      }
    }, 60000) // 每分钟执行一次
  }
}

/**
 * 渡劫失败惩罚
 * @param e
 * @param UID
 * @param size
 * @returns
 */
async function punishLevel(e: AEvent, UID: string, UserData: DB.UserType) {
  /**
   * 渡劫失败惩罚
   *
   * 20%*灵根数 -5%*变异灵根数 = 成功概率
   * 五 100%   掉经验+清血量+概率掉物品
   * 四 80%    掉境界+掉经验+清血量
   * 三 60%    所有境界掉1级+所有经验清空+清血量
   * 二 40%    所有境界掉3级+所有经验清空+清血量
   * 一 20%    死亡+清血量
   */

  // 得到用户数据
  const Userexp: DB.UserLevelType = await GameApi.Levels.read(UID, 1)
  const Userbool: DB.UserLevelType = await GameApi.Levels.read(UID, 2)
  const Usershen: DB.UserLevelType = await GameApi.Levels.read(UID, 2)
  await GameApi.Users.update(UID, {
    battle_blood_now: 0
  } as DB.UserType)

  switch (UserData.talent.length) {
    case 1: {
      setTimeout(async () => {
        /**
         * 经验清空
         */
        GameApi.Levels.write(UID, 1, {
          experience: 0
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 2, {
          experience: 0
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 3, {
          experience: 0
        } as DB.UserLevelType)
        e.reply(['[灭世之雷]击中了你的道韵,修为清空,化作尘埃'], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
    case 2: {
      setTimeout(async () => {
        /**
         * 经验清空
         */
        GameApi.Levels.write(UID, 1, {
          experience: Math.floor(Userexp.experience * 0.75)
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 2, {
          experience: Math.floor(Userbool.experience * 0.75)
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 3, {
          experience: Math.floor(Usershen.experience * 0.75)
        } as DB.UserLevelType)
        e.reply(['[灭世之雷]击中了你的命魂,损失大量修为'], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
    case 3: {
      setTimeout(async () => {
        /**
         * 经验清空
         */
        GameApi.Levels.write(UID, 1, {
          experience: Math.floor(Usershen.experience * 0.5)
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 2, {
          experience: Math.floor(Usershen.experience * 0.5)
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 3, {
          experience: Math.floor(Usershen.experience * 0.5)
        } as DB.UserLevelType)
        e.reply(['[灭世之雷]击中了你的命魂,损失一半修为'], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
    case 4: {
      setTimeout(async () => {
        GameApi.Levels.write(UID, 1, {
          experience: Math.floor(Usershen.experience * 0.25)
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 2, {
          experience: Math.floor(Usershen.experience * 0.25)
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 3, {
          experience: Math.floor(Usershen.experience * 0.25)
        } as DB.UserLevelType)
        GameApi.Levels.fallingRealm(UID, 1)
        e.reply([`[灭世之雷]击中了你的命魂,损失部分修为`], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
    case 5: {
      setTimeout(async () => {
        GameApi.Levels.write(UID, 1, {
          experience: Math.floor(Usershen.experience * 0.15)
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 2, {
          experience: Math.floor(Usershen.experience * 0.15)
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 3, {
          experience: Math.floor(Usershen.experience * 0.15)
        } as DB.UserLevelType)
        GameApi.Levels.fallingRealm(UID, 1)
        e.reply([`[灭世之雷]击中了你的命魂,损失修为`], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
  }
}
