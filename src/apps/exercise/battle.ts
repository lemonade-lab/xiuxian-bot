import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  DB,
  isThereAUserPresent,
  GameApi,
  sendReply,
  dualVerification,
  dualVerificationAction,
  isThereAUserPresentB,
  victoryCooling,
  postHelp
} from '../../api/index.js'
import { QQ_GROUP } from '../../model/config/index.js'
export class Battle extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?战斗过程(开启|关闭)$/, fnc: 'battelShow' },
        { reg: /^(#|\/)?打劫$/, fnc: 'duel' },
        { reg: /^(#|\/)?(比斗|比鬥)$/, fnc: 'combat' }
      ]
    })
  }

  /**
   * 战斗过程
   * @param e
   * @returns
   */
  async battelShow(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (new RegExp(/战斗过程开启/).test(e.msg)) {
      UserData.battle_show = 1
    } else {
      UserData.battle_show = 0
    }
    await GameApi.Users.update(UID, {
      battle_show: UserData.battle_show
    } as DB.UserType)
    if (UserData.battle_show == 1) {
      e.reply(['战斗过程开启'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

      return
    } else {
      e.reply(['战斗过程关闭'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
      return
    }
  }

  /**
   * 比鬥
   * @param e
   * @returns
   */
  async combat(e: AEvent) {
    const UID = e.user_id
    if (e.platform == 'ntqq') {
      Controllers(e).Message.reply('', [
        {
          label: '加入官群',
          link: QQ_GROUP
        }
      ])
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
      return
    }
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const UIDB = e?.at_user?.id
    if (!UIDB) return
    if (!(await isThereAUserPresentB(e, UIDB))) return
    const UserDataB = await GameApi.Users.read(UIDB)
    if (!(await dualVerification(e, UserData, UserDataB))) return

    if (UserData.special_spiritual < 5) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
      return
    }
    if (UserDataB.special_spiritual < 5) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
      return
    }

    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return
    const CDID = 14,
      CDTime = GameApi.Cooling.CD_Ambiguous
    if (!(await victoryCooling(e, UID, CDID))) return

    GameApi.Burial.set(UID, CDID, CDTime)

    const BMSG = GameApi.Fight.start(UserData, UserDataB)

    /**
     * 是否显示战斗结果
     */
    if (UserData.battle_show || UserDataB.battle_show) {
      sendReply(e, '[战斗结果]', BMSG.msg)
    }

    e.reply(
      [
        `你的🩸${BMSG.battle_blood_now.a}\n`,
        `对方🩸${BMSG.battle_blood_now.b}`
      ],
      {
        quote: e.msg_id
      }
    )
    postHelp(
      e,
      '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
    )

    const LevelDataA = await GameApi.Levels.read(UID, 1),
      LevelDataB = await GameApi.Levels.read(UIDB, 1)

    const sizeA = LevelDataA.experience * 0.15,
      sizeB = LevelDataB.experience * 0.1 // 被动的
    const expA = sizeA > 648 ? 648 : sizeA,
      expB = sizeB > 648 ? 648 : sizeB

    await GameApi.Users.update(UID, {
      battle_blood_now: BMSG.battle_blood_now.a,
      special_spiritual: UserData.special_spiritual - 5
    } as DB.UserType)
    await GameApi.Users.update(UIDB, {
      battle_blood_now: BMSG.battle_blood_now.b,
      special_spiritual: UserDataB.special_spiritual - 5
    } as DB.UserType)

    const exA = Math.floor((expA * (UserDataB.talent_size + 100)) / 100),
      exB = Math.floor((expB * (UserDataB.talent_size + 100)) / 100)
    const eA = exA < 3280 ? exA : 3280,
      eB = exB < 3280 ? exB : 3280

    await GameApi.Levels.addExperience(UID, 2, eA)
    await GameApi.Levels.addExperience(UIDB, 2, eB)

    e.reply(
      [
        '🤺🤺',
        '经过一番畅快的比斗~\n',
        `你激昂的气血增加了${eA}~\n`,
        `对方坚毅的气血增加了${eB}`
      ],
      {
        quote: e.msg_id
      }
    )
    postHelp(
      e,
      '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
    )

    return
  }

  /**
   * 打劫
   * @param e
   * @returns
   */
  async duel(e: AEvent) {
    const UID = e.user_id
    if (e.platform == 'ntqq') {
      e.reply('NTQQ不支持此功能')
      Controllers(e).Message.reply('', [
        {
          label: '加入官群',
          link: QQ_GROUP
        }
      ])
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
      return
    }

    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const UIDB = e?.at_user?.id
    if (!UIDB) return
    if (!(await isThereAUserPresentB(e, UIDB))) return
    const UserDataB = await GameApi.Users.read(UIDB)
    if (!(await dualVerification(e, UserData, UserDataB))) return
    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return

    const CDID = 20,
      CDTime = GameApi.Cooling.CD_Battle
    if (!(await victoryCooling(e, UID, CDID))) return

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

      e.reply('[玄玉天宫]玉贞子:\n何人在此造次!')
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
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
          e.reply([`[玄玉天宫]的众修士击碎了你的[${thing[0]?.name}]`], {
            quote: e.msg_id
          })
        }, 5000)
      }

      return
    }

    if (UserData.pont_attribute == 1) {
      const thing = await GameApi.Bag.searchBagByName(UID, '决斗令')
      if (!thing) {
        GameApi.logs.write(UIDB, {
          type: 2,
          create_time,
          message: `${UserData.name}攻击了你,被卫兵拦住了~`
        } as DB.UserLogType)
        e.reply('[城主府]普通卫兵:\n城内不可出手!')
        postHelp(
          e,
          '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
        )

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
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

      return
    }
    GameApi.Burial.set(UID, CDID, CDTime)
    // 增加

    /**
     * 对方非白煞
     */
    if (UserDataB.special_prestige < 100) {
      // 加煞气
      UserData.special_prestige += 1
    }

    const BMSG = GameApi.Fight.start(UserData, UserDataB)

    await GameApi.Users.update(UID, {
      special_prestige: UserData.special_prestige,
      special_spiritual:
        UserData.special_spiritual - Math.floor(levelsB.realm / 2),
      battle_blood_now: BMSG.battle_blood_now.a
    } as DB.UserType)

    await GameApi.Users.update(UIDB, {
      battle_blood_now: BMSG.battle_blood_now.b
    } as DB.UserType)

    e.reply(
      [
        `你的🩸${BMSG.battle_blood_now.a}\n`,
        `对方🩸${BMSG.battle_blood_now.b}`
      ],
      {
        quote: e.msg_id
      }
    )

    // 是否显示战斗结果
    if (UserData.battle_show || UserDataB.battle_show) {
      // 切割战斗信息
      sendReply(e, '[战斗结果]', BMSG.msg)
    }

    /**
     * 平局了,保存双方存档即可
     */
    if (BMSG.victory == '0') {
      GameApi.logs.write(UIDB, {
        type: 2,
        create_time,
        message: `${UserData.name}攻击了你,你跟他打成了平手~`
      } as DB.UserLogType)

      e.reply([`你与对方打成了平手`], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

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
      /** 结果是对方赢了 */
      user.PartyA = UIDB
      user.PartyB = UID
      user.prestige = UserData.special_prestige
    }

    if (!GameApi.Method.isTrueInRange(1, 100, Math.floor(user.prestige))) {
      GameApi.logs.write(UIDB, {
        type: 2,
        create_time,
        message: `[${UserData.name}]攻击了你,你重伤在地`
      } as DB.UserLogType)

      e.reply([`未抢到的物品`], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

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
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

      return
    }

    if (user.PartyA == UID) {
      GameApi.logs.write(UIDB, {
        type: 2,
        create_time,
        message: `[${UserData.name}]夺走了你的[${data[0].name}]*${data[0].acount}~`
      } as DB.UserLogType)
    } else {
      GameApi.logs.write(UIDB, {
        type: 2,
        create_time,
        message: `你夺走了[${UserData.name}]的[${data[0].name}]*${data[0].acount}~`
      } as DB.UserLogType)
    }

    /**
     * 检查背包
     */

    const dada = await GameApi.Users.read(user.PartyA)

    const BagSize = await GameApi.Bag.backpackFull(user.PartyA, dada.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

      return
    }

    e.reply(
      [
        NameMap[user.PartyA],
        '夺走了',
        NameMap[user.PartyB],
        `的[${data[0].name}]*${data[0].acount}~`
      ],
      {
        quote: e.msg_id
      }
    )
    postHelp(
      e,
      '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
    )

    /**
     * 交互物品
     */
    await GameApi.Bag.addBagThing(user.PartyA, dada.bag_grade, [
      {
        name: data[0].name,
        acount: data[0].acount
      }
    ])

    return
  }
}
