import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  DB,
  isThereAUserPresent,
  isThereAUserPresentB,
  GameApi,
  dualVerification,
  dualVerificationAction,
  victoryCooling,
  postHelp
} from '../../api/index.js'
import { QQ_GROUP } from '../../model/config/index.js'
export class ControllLevel extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(传功|傳功).*$/, fnc: 'transmissionPower' },
        { reg: /^(#|\/)?(雙修|双修).*$/, fnc: 'ambiguous' }
      ]
    })
  }

  /**
   * 双修
   * @param e
   * @returns
   */
  async ambiguous(e: AEvent) {
    const UID = e.user_id
    if (e.platform == 'ntqq') {
      Controllers(e).Message.reply('', [
        {
          label: '加入官群',
          link: QQ_GROUP
        }
      ])
    }
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const UIDB = e?.at_user?.id || e.msg.replace(/^(#|\/)?(雙修|双修)*/, '')
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

    const CDID = 20,
      CDTime = GameApi.Cooling.CD_transmissionPower
    if (!(await victoryCooling(e, UID, CDID))) return

    GameApi.Burial.set(UID, CDID, CDTime)

    // 读取境界
    const LevelDataA = await GameApi.Levels.read(UID, 1),
      LevelDataB = await GameApi.Levels.read(UIDB, 1)
    const sizeA = LevelDataA.experience * 0.15,
      sizeB = LevelDataB.experience * 0.1
    const expA = sizeA > 648 ? 648 : sizeA,
      expB = sizeB > 648 ? 648 : sizeB

    await GameApi.Users.update(UID, {
      special_spiritual: UserData.special_spiritual - 5
    } as DB.UserType)
    await GameApi.Users.update(UIDB, {
      special_spiritual: UserDataB.special_spiritual - 5
    } as DB.UserType)

    const exA = Math.floor((expA * (UserData.talent_size + 100)) / 100),
      exB = Math.floor((expB * (UserDataB.talent_size + 100)) / 100)
    const eA = exA < 3280 ? exA : 3280,
      eB = exB < 3280 ? exB : 3280

    await GameApi.Levels.addExperience(UID, 1, eA)
    await GameApi.Levels.addExperience(UIDB, 1, eB)

    e.reply(
      [
        '❤️',

        '情投意合~\n',

        `你激动的修为增加了${eA}~\n`,

        `对方奇怪的修为增加了${eB}`
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
   * 传功
   * @param e
   * @returns
   */
  async transmissionPower(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const UIDB = e?.at_user?.id || e.msg.replace(/^(#|\/)?(传功|傳功)*/, '')
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
    const LevelDataA = await GameApi.Levels.read(UID, 1),
      LevelDataB = await GameApi.Levels.read(UIDB, 1)
    if (!LevelDataA || !LevelDataB) return
    if (LevelDataA.realm < 21) {
      e.reply(['未到元婴期'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

      return
    }
    if (LevelDataA.experience <= 2000) {
      e.reply(['所剩修为低于2000'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

      return
    }
    // B的境界相差
    const LevelSize = 9
    if (
      LevelDataB.realm < LevelDataA.realm - LevelSize ||
      LevelDataB.realm > LevelDataA.realm + LevelSize
    ) {
      e.reply(['与', '最多可相差9个境界'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

      return
    }

    await GameApi.Users.update(UID, {
      special_spiritual: UserData.special_spiritual - 5
    } as DB.UserType)
    await GameApi.Users.update(UIDB, {
      special_spiritual: UserDataB.special_spiritual - 5
    } as DB.UserType)

    if (!GameApi.Method.isTrueInRange(1, 100, 85)) {
      // 清空经验
      await GameApi.Levels.reduceExperience(UID, 1, LevelDataA.experience)
      // 掉境界
      await GameApi.Levels.fallingRealm(UID, 1)
      e.reply(['🤪传功失败了', '掉落了一个境界！'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

      return
    }
    // 清空经验
    await GameApi.Levels.reduceExperience(UID, 1, LevelDataA.experience)
    // 增加对方经验
    const size = Math.floor(LevelDataA.experience * 0.6)
    await GameApi.Levels.addExperience(UIDB, 1, size)
    e.reply(['成功传', `[修为]*${size}给`, UIDB], {
      quote: e.msg_id
    })
    postHelp(
      e,
      '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"提升战力","list":[{"icon":14,"title":"/闭关","desc":"进行闭关"},{"icon":14,"title":"/出关","desc":"增加修为"},{"icon":21,"title":"/锻体","desc":"进行锻体"},{"icon":21,"title":"/凝脉","desc":"锻炼气血"},{"icon":21,"title":"/打坐","desc":"聚集灵气"},{"icon":21,"title":"/聚灵","desc":"凝聚体内"},{"icon":8,"title":"/炼化+物品名","desc":"炼化物品未本命物"},{"icon":8,"title":"/精炼","desc":"强化本命物"},{"icon":8,"title":"/突破","desc":"练气升级"},{"icon":8,"title":"/破境","desc":"练体升级"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
    )

    return
  }
}
