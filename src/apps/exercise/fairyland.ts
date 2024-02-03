import { plugin, type AEvent } from 'alemonjs'
import { DB, isThereAUserPresent, GameApi } from '../../api/index.js'
export class fairyland extends plugin {
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
    const UserData = await GameApi.Users.read(UID)
    /**
     * 灵根
     */
    if (UserData.talent.length < 5) {
      setTimeout(async () => {
        e.reply(['灵根不全,无成仙之资'], {
          quote: e.msg_id
        })
      }, 6000)
      return
    }
    // 计算变异灵根数
    let size = 0
    for await (const item of UserData.talent) {
      if (item > 5) {
        size++
      }
    }
    // 概率
    const p = 20 * UserData.talent.length - 5 * size
    /**
     * 开始触发
     */
    setTimeout(() => {
      e.reply('此处灵气聚集中....')
    }, 1500)
    setTimeout(() => {
      e.reply('忽然间风云变幻,乌云密布,竟然是九九灭世之雷悬于苍穹之上！')
    }, 3000)
    setTimeout(() => {
      e.reply('[天道]裁决者:\nbig胆,竟敢在此逆天行道,妄想打破天地浩劫')
    }, 4500)
    /**
     * 概率触发
     */
    if (!GameApi.Method.isTrueInRange(1, 100, p)) {
      await punishLevel(e, UID, UserData)
      return
    }
    /**
     * 进入渡劫模式
     */
    setTimeout(async () => {
      e.reply(['此方世界未能成仙,后续的境界以后再来探索吧'], {
        quote: e.msg_id
      })
    }, 6000)
    return
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

        /**
         * 陨落
         */
        GameApi.Users.update(UID, {
          age_state: 0
        } as DB.UserType)
        e.reply(['[灭世之雷]击中了你的道韵,直接陨落,化作尘埃'], {
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
          experience: 0
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 2, {
          experience: 0
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 3, {
          experience: 0
        } as DB.UserLevelType)
        /**
         * 掉境界
         */
        GameApi.Levels.fallingRealm(UID, 1, 3)
        GameApi.Levels.fallingRealm(UID, 2, 3)
        GameApi.Levels.fallingRealm(UID, 3, 3)
        e.reply(['[灭世之雷]击中了你的命魂,境界跌落'], {
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
          experience: 0
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 2, {
          experience: 0
        } as DB.UserLevelType)
        GameApi.Levels.write(UID, 3, {
          experience: 0
        } as DB.UserLevelType)
        /**
         * 掉境界
         */
        GameApi.Levels.fallingRealm(UID, 1)
        GameApi.Levels.fallingRealm(UID, 2)
        GameApi.Levels.fallingRealm(UID, 3)
        e.reply(['[灭世之雷]击中了你的命魂,境界跌落'], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
    case 4: {
      setTimeout(async () => {
        /**
         * 经验清空
         */
        GameApi.Levels.write(UID, 1, {
          experience: 0
        } as DB.UserLevelType)
        /**
         * 掉境界
         */
        GameApi.Levels.fallingRealm(UID, 1)
        e.reply([`[灭世之雷]击中了你的命魂,境界跌落~`], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
    case 5: {
      setTimeout(async () => {
        /**
         * 经验清空
         */
        GameApi.Levels.write(UID, 1, {
          experience: 0
        } as DB.UserLevelType)

        if (
          !(await GameApi.Method.isTrueInRange(
            1,
            100,
            Math.floor(UserData.special_prestige + 10)
          ))
        ) {
          e.reply([`你重伤倒地,险些魂飞魄散`], {
            quote: e.msg_id
          })

          return
        }

        // 随机掉落物品
        const data = await GameApi.Bag.delThing(UID)

        if (!data) {
          e.reply([`你重伤倒地,险些魂飞魄散`], {
            quote: e.msg_id
          })

          return
        }

        // 击碎标记
        await GameApi.Treasure.add(data[0].name, data[0].type, data[0].acount)

        e.reply(
          [
            '[灭世之雷]击碎了',
            `你的[${data[0].name}]`,
            `\n你重伤倒地,奄奄一息~`
          ],
          {
            quote: e.msg_id
          }
        )

        return
      }, 6000)
      break
    }
  }
}
