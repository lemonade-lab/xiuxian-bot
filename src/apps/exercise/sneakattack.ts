import { APlugin, ClientNTQQ, Controllers, type AEvent } from 'alemonjs'
import {
  isThereAUserPresent,
  isThereAUserPresentB,
  GameApi,
  dualVerification,
  dualVerificationAction,
  sendReply,
  ControlByBlood,
  victoryCooling
} from 'xiuxian-api'
import { Config } from 'xiuxian-core'
import { Op } from 'sequelize'

import * as DB from 'xiuxian-db'

export class SneakAttack extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?偷袭\d+$/, fnc: 'attackUser' },
        { reg: /^(#|\/)?释放神识$/, fnc: 'releaseEye' }
      ]
    })
  }

  /**
   * 偷袭
   * @param e
   * @returns
   */
  async attackUser(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const minBattleBlood = 1
    const ID = e.msg.replace(/^(#|\/)?偷袭/, '')
    const userDataB: DB.UserType = (await DB.user.findOne({
      attributes: [
        'id',
        'uid',
        'state',
        'battle_blood_now',
        'point_type',
        'battle_power',
        'name'
      ],
      where: {
        id: ID,
        uid: {
          [Op.ne]: UID
        },
        // 区域一样的玩家
        point_type: UserData.point_type,
        // 没有死亡的玩家
        age_state: 1,
        // 只能看到空闲玩家
        state: 0,
        // 只能看到血量大于1的玩家
        battle_blood_now: {
          [Op.gt]: minBattleBlood
        }
      },
      raw: true
    })) as any
    if (!userDataB) {
      e.reply('对方消失了', {
        quote: e.msg_id
      })
      return
    }
    const UIDB = userDataB.uid
    if (!UIDB) return
    if (!(await isThereAUserPresentB(e, UIDB))) return
    const UserDataB = await GameApi.Users.read(UIDB)
    if (!(await dualVerification(e, UserData, UserDataB))) return
    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return

    const CDID = 20,
      CDTime = GameApi.Cooling.CD_Sneak
    if (!(await victoryCooling(e, UID, CDID))) return

    /**
     * 增加玄玉天宫
     */

    const create_time = new Date().getTime()

    if (UserData.point_type == 2) {
      await GameApi.Users.update(UID, {
        battle_blood_now: 0
      } as DB.UserType)

      GameApi.logs.write(UIDB, {
        type: 1,
        create_time,
        message: `${UserData.name}攻击了你,被[玄玉天宫]修士拦住了~`
      } as DB.UserLogType)

      e.reply('[玄玉天宫]:玉贞子\n何人在此造次!')
      let thing: { name: string; type: number; acount: number }[] = []

      if (
        await GameApi.Method.isTrueInRange(
          1,
          100,
          Math.floor(UserData.special_prestige + 50)
        )
      ) {
        thing = await GameApi.Bag.delThing(UID)
      }

      setTimeout(() => {
        e.reply('[玄玉天宫]副宫主对你降下逐杀令..', {
          quote: e.msg_id
        })
      }, 1000)

      setTimeout(() => {
        e.reply('你已[玄玉天宫]的一众修士锁定位置', {
          quote: e.msg_id
        })
      }, 2000)

      setTimeout(() => {
        e.reply('[玄玉天宫]的众修士:\n猖狂!')
      }, 3000)

      setTimeout(() => {
        e.reply([`你被[玄玉天宫]重伤!`], {
          quote: e.msg_id
        })
      }, 4000)

      if (thing.length != 0) {
        setTimeout(() => {
          if (thing.length != 0) {
            e.reply([`[玄玉天宫]的众修士击碎了你的[${thing[0].name}]`], {
              quote: e.msg_id
            })
          }
        }, 5000)
      }

      return
    }

    if (UserData.pont_attribute == 1) {
      const thing = await GameApi.Bag.searchBagByName(UID, '决斗令')
      if (!thing) {
        GameApi.logs.write(UIDB, {
          type: 1,
          create_time,
          message: `${UserData.name}攻击了你,被卫兵拦住了~`
        } as DB.UserLogType)

        e.reply('[城主府]普通卫兵:\n城内不可出手!', {
          quote: e.msg_id
        })
        return
      }
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: 1
        }
      ])
    }

    /**
     * 判断灵力
     */
    const levelsB = await GameApi.Levels.read(UIDB, 1)
    if (UserData.special_spiritual < levelsB.realm) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }

    GameApi.Burial.set(UID, CDID, CDTime)

    // 如果对方是百煞,不增加煞气
    if (UserDataB.special_prestige < 100) {
      // 加煞气
      UserData.special_prestige += 1
    }

    const BMSG = GameApi.Fight.start(UserData, UserDataB)

    await GameApi.Users.update(UID, {
      battle_blood_now: BMSG.battle_blood_now.a,
      special_spiritual:
        UserData.special_spiritual - Math.floor(levelsB.realm / 2),
      special_prestige: UserData.special_prestige
    } as DB.UserType)

    await GameApi.Users.update(UIDB, {
      battle_blood_now: BMSG.battle_blood_now.b
    } as DB.UserType)

    const BooldMsg = `${UserData.name}当前剩余:${BMSG.battle_blood_now.a}[血量]\n${UserDataB.name}当前剩余:${BMSG.battle_blood_now.b}[血量]`

    // 是否显示战斗结果
    if (UserData.battle_show || UserDataB.battle_show) {
      // 切割战斗信息
      sendReply(e, '[战斗结果]', BMSG.msg)
    }
    // 平局了,保存双方存档即可
    if (BMSG.victory == '0') {
      GameApi.logs.write(UIDB, {
        type: 1,
        create_time,
        message: `${UserData.name}攻击了你,你跟他打成了平手~`
      } as DB.UserLogType)
      // 只要有一方战斗过程是开着的
      e.reply([`你跟他两打成了平手\n${BooldMsg}`], {
        quote: e.msg_id
      })
      return
    }

    const NameMap = {}

    NameMap[UID] = UserData.name

    NameMap[UIDB] = UserDataB.name

    const user = {
      PartyA: UID, // 默认自己赢了
      PartyB: UIDB,
      prestige: UserDataB.special_prestige
    }
    if (BMSG.victory == UIDB) {
      // 结果是对方赢了
      user.PartyA = UIDB
      user.PartyB = UID
      user.prestige = UserData.special_prestige
    }
    if (!GameApi.Method.isTrueInRange(1, 100, Math.floor(user.prestige))) {
      GameApi.logs.write(UIDB, {
        type: 1,
        create_time,
        message: `[${UserData.name}]攻击了你,你重伤在地`
      } as DB.UserLogType)
      e.reply([`并未抢到他的物品~\n${BooldMsg}`], {
        quote: e.msg_id
      })
      return
    }

    // 随机删除败者储物袋的物品
    const data = await GameApi.Bag.delThing(user.PartyB)
    if (!data) {
      GameApi.logs.write(UIDB, {
        type: 2,
        create_time,
        message: `[${UserData.name}]攻击了你,你重伤在地`
      } as DB.UserLogType)
      e.reply([`穷的都吃不起灵石了`], {
        quote: e.msg_id
      })
      return
    }

    const dsds = await GameApi.Users.read(user.PartyA)
    /**
     * 检查背包
     */
    const BagSize = await GameApi.Bag.backpackFull(user.PartyA, dsds.bag_grade)
    if (!BagSize) {
      e.reply([NameMap[user.PartyA], '储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }

    const thine = data[0]

    if (thine) {
      // 添加物品
      await GameApi.Bag.addBagThing(user.PartyA, dsds.bag_grade, [
        {
          name: thine.name,
          acount: thine.acount
        }
      ])
    }

    // 结算
    if (user.PartyA == UID) {
      const msg = `[${UserData.name}]夺走了[${UserDataB.name}]的[${thine.name}]*${thine.acount}~`
      GameApi.logs.write(UIDB, {
        type: 1,
        create_time,
        message: msg
      } as DB.UserLogType)
      e.reply(`${msg}\n${BooldMsg}`, {
        quote: e.msg_id
      })
    } else {
      const msg = `[${UserDataB.name}]夺走了[${UserData.name}]的[${thine.name}]*${thine.acount}~`
      GameApi.logs.write(UIDB, {
        type: 1,
        create_time,
        message: msg
      } as DB.UserLogType)
      e.reply(`${msg}\n${BooldMsg}`, {
        quote: e.msg_id
      })
    }

    return
  }

  /**
   * 释放神识
   * @param e
   * @returns
   */
  async releaseEye(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    if (UserData.pont_attribute == 1) {
      e.reply('[城主府]巡逻军:\n城内切莫释放神识!')
      return
    }
    // 战力
    const battle_power = UserData.battle_power ?? 20
    const LevelData = await GameApi.Levels.read(UID, 3)
    // 有效距离为
    const distanceThreshold = (LevelData.realm ?? 1) * 10 + 50
    const minBattleBlood = 1
    const AllUser: DB.UserType[] = (await DB.user.findAll({
      attributes: [
        'id',
        'uid',
        'state',
        'battle_blood_now',
        'battle_power',
        'pont_x',
        'pont_y',
        'point_type',
        'name'
      ],
      where: {
        // 不是自己的UID
        uid: {
          [Op.ne]: UID
        },
        // 区域一样的玩家
        point_type: UserData.point_type,
        // 没有死亡的玩家
        age_state: 1,
        // 只能看到空闲玩家
        state: 0,
        // 只能看到血量大于1的玩家
        battle_blood_now: {
          [Op.gt]: minBattleBlood
        },
        // 只显示比自己战力低的
        battle_power: {
          [Op.lte]: battle_power + 3280
        },
        pont_x: {
          [Op.between]: [
            UserData.pont_x - distanceThreshold,
            UserData.pont_x + distanceThreshold
          ]
        },
        pont_y: {
          [Op.between]: [
            UserData.pont_y - distanceThreshold,
            UserData.pont_y + distanceThreshold
          ]
        },
        pont_z: {
          [Op.between]: [
            UserData.pont_z - distanceThreshold,
            UserData.pont_z + distanceThreshold
          ]
        }
      },
      // 战力高的在前面
      order: [['battle_power', 'DESC']],
      // 只显示十个玩家
      limit: 10,
      raw: true
    })) as any
    if (e.platform == 'ntqq') {
      let p = ClientNTQQ.createTemplate(Config.TemplateId)
      for (const item of AllUser) {
        p.button({
          start: `${item.name} 🩸${item?.battle_blood_now}\r`,
          label: `👊 偷袭`,
          value: `/偷袭${item?.id}`,
          end: `${item?.battle_power}`,
          change: true
        })
      }
      const param = p.getParam()
      if (param.markdown.params.length > 0) {
        Controllers(e).Message.card([param])
      } else {
        e.reply('附近空无一人')
      }
      p = null
    } else {
      const msg: string[] = ['[附近道友]']
      for (const item of AllUser) {
        msg.push(
          `\n🔹标记:${item?.id},道号:${item.name}\n🩸${item?.battle_blood_now},战力:${item?.battle_power}`
        )
      }
      if (msg.length > 1) {
        e.reply(msg)
      } else {
        e.reply('附近空无一人')
      }
    }
    return
  }
}
