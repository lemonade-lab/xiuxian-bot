import { Messages } from 'alemonjs'
import {
  isThereAUserPresent,
  sendReply,
  dualVerification,
  dualVerificationAction,
  isThereAUserPresentB,
  victoryCooling
} from 'xiuxian-api'

import * as GameApi from 'xiuxian-core'

export default new Messages().response(/^(#|\/)?打劫/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  const UIDB = e?.at_user?.id || e.msg.replace(/^(#|\/)?打劫/, '')
  if (!UIDB) return
  if (!(await isThereAUserPresentB(e, UIDB))) return
  const UserDataB = await GameApi.Users.read(UIDB)
  if (!(await dualVerification(e, UserData, UserDataB))) return
  if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type)) {
    return
  }
  const CDID = 24,
    CDTime = GameApi.Cooling.CD_Battle
  if (!(await victoryCooling(e, UID, CDID))) return

  const create_time = new Date().getTime()

  if (UserData.point_type == 2) {
    await GameApi.Users.update(UID, {
      battle_blood_now: 0
    })

    GameApi.logs.write(UIDB, {
      type: 1,
      create_time,
      message: `${UserData.name}攻击了你,被[玄玉天宫]修士拦住了~`
    })

    e.reply('[玄玉天宫]玉贞子:\n何人在此造次!')
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
      })
      e.reply('[城主府]普通卫兵:\n城内不可出手!')
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
  })

  await GameApi.Users.update(UIDB, {
    battle_blood_now: BMSG.battle_blood_now.b
  })

  e.reply(
    [`你的🩸${BMSG.battle_blood_now.a}\n`, `对方🩸${BMSG.battle_blood_now.b}`],
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
    })

    e.reply([`你与对方打成了平手`], {
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
    })

    e.reply([`未抢到的物品`], {
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
    })
    e.reply([`穷的都吃不起灵石了`], {
      quote: e.msg_id
    })
    return
  }

  if (user.PartyA == UID) {
    GameApi.logs.write(UIDB, {
      type: 2,
      create_time,
      message: `[${UserData.name}]夺走了你的[${data[0].name}]*${data[0].acount}~`
    })
  } else {
    GameApi.logs.write(UIDB, {
      type: 2,
      create_time,
      message: `你夺走了[${UserData.name}]的[${data[0].name}]*${data[0].acount}~`
    })
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
})
