import { APlugin, type AEvent } from 'alemonjs'
import { DB, isThereAUserPresent, GameApi, postHelp } from '../../api/index.js'

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
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

      return
    }
    // 获取用户信息
    const UserData = await GameApi.Users.read(UID)
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
          postHelp(
            e,
            '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
          )

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
