import { Text, useParse, useSend } from 'alemonjs'
import { Op } from 'sequelize'
import {
  isUser,
  dualVerification,
  dualVerificationAction,
  sendReply,
  victoryCooling
} from '@xiuxian/api/index'

import * as GameApi from '@xiuxian/core/index'
import * as DB from '@xiuxian/db/index'
export default OnResponse(
  async e => {
    // lock start
    const T = await GameApi.operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const minBattleBlood = 1

    const text = useParse(e.Megs, 'Text')

    const ID = text.replace(/^(#|\/)?偷袭/, '')
    //
    const UserDataB = await DB.user
      .findOne({
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
        }
      })
      .then(res => res?.dataValues)
      .catch(_ => false)

    //
    if (!UserDataB || typeof UserDataB === 'boolean') {
      Send(Text('对方消失了'))
      return
    }

    //
    const UIDB = UserDataB.uid

    if (!(await dualVerification(e, UserData, UserDataB))) return
    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return

    const CDID = 20
    const CDTime = GameApi.Cooling.CD_Sneak

    //
    if (!(await victoryCooling(e, UID, CDID))) return

    // 增加玄玉天宫
    const create_time = new Date().getTime()

    //
    if (UserData.point_type == 2) {
      await DB.user.update(
        {
          battle_blood_now: 0
        },
        {
          where: {
            uid: UID
          }
        }
      )

      DB.user_log.create({
        uid: UIDB,
        type: 1,
        create_time,
        message: `${UserData.name}攻击了你,被[玄玉天宫]修士拦住了~`
      })

      Send(Text('[玄玉天宫]修士:\n何人在此造次!'))

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
        Send(Text('[玄玉天宫]副宫主对你降下逐杀令..'))
      }, 1000)

      setTimeout(() => {
        Send(Text('你已[玄玉天宫]的一众修士锁定位置'))
      }, 2000)

      setTimeout(() => {
        Send(Text('[玄玉天宫]的众修士:\n猖狂!'))
      }, 3000)

      setTimeout(() => {
        Send(Text('你被[玄玉天宫]重伤!'))
      }, 4000)

      if (thing.length != 0) {
        //
        setTimeout(() => {
          if (thing.length != 0) {
            Send(Text(`[玄玉天宫]的众修士击碎了你的[${thing[0].name}]`))
          }
        }, 5000)
      }

      return
    }

    // 决斗令

    if (UserData.pont_attribute == 1) {
      const thing = await GameApi.Bag.searchBagByName(UID, '决斗令')
      if (!thing) {
        //
        DB.user_log.create({
          uid: UIDB,
          type: 1,
          create_time,
          message: `${UserData.name}攻击了你,被卫兵拦住了~`
        })
        Send(Text('[城主府]普通卫兵:\n城内不可出手!'))

        return
      }
      //
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: 1
        }
      ])
      //
    }

    //判断灵力

    const levelsB = await DB.user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 1
        }
      })
      .then(res => res?.dataValues)

    //

    if (UserData.special_spiritual < levelsB.realm) {
      Send(Text('灵力不足'))

      return
    }

    GameApi.Burial.set(UID, CDID, CDTime)

    // 如果对方是百煞,不增加煞气
    if (UserDataB.special_prestige < 100) {
      // 加煞气
      UserData.special_prestige += 1
    }

    const BMSG = GameApi.Fight.start(UserData, UserDataB)

    await DB.user.update(
      {
        battle_blood_now: BMSG.battle_blood_now.a,
        special_spiritual:
          UserData.special_spiritual - Math.floor(levelsB.realm / 2),
        special_prestige: UserData.special_prestige
      },
      {
        where: {
          uid: UID
        }
      }
    )

    await DB.user.update(
      {
        battle_blood_now: BMSG.battle_blood_now.b
      },
      {
        where: {
          uid: UIDB
        }
      }
    )

    const BooldMsg = `${UserData.name}当前剩余:${BMSG.battle_blood_now.a}[血量]\n${UserDataB.name}当前剩余:${BMSG.battle_blood_now.b}[血量]`

    // 是否显示战斗结果
    if (UserData.battle_show || UserDataB.battle_show) {
      // 切割战斗信息
      sendReply(e, '[战斗结果]', BMSG.msg)
    }
    // 平局了,保存双方存档即可
    if (BMSG.victory == '0') {
      DB.user_log.create({
        uid: UIDB,
        type: 1,
        create_time,
        message: `${UserData.name}攻击了你,你跟他打成了平手~`
      })

      Send(Text(`你跟他两打成了平手\n${BooldMsg}`))

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
      DB.user_log.create({
        uid: UIDB,
        type: 1,
        create_time,
        message: `[${UserData.name}]攻击了你,你重伤在地`
      })

      Send(Text(`并未抢到他的物品~\n${BooldMsg}`))

      return
    }

    // 随机删除败者储物袋的物品
    const data = await GameApi.Bag.delThing(user.PartyB)
    if (!data) {
      DB.user_log.create({
        uid: UIDB,
        type: 2,
        create_time,
        message: `[${UserData.name}]攻击了你,你重伤在地`
      })
      Send(Text('穷的都吃不起灵石了'))
      return
    }

    /**
     * 检查背包
     */
    const BagSize = await GameApi.Bag.backpackFull(user.PartyA)
    if (!BagSize) {
      Send(Text('储物袋空间不足'))
      return
    }

    const things = data[0]

    // 结算
    if (user.PartyA == UID) {
      if (things) {
        DB.user_log.create({
          uid: UID,
          type: 1,
          create_time,
          message: `[${UserData.name}]夺走了[${UserDataB.name}]的[${things.name}]*${things.acount}~`
        })
      } else {
        DB.user_log.create({
          uid: UID,
          type: 1,
          create_time,
          message: `[${UserData.name}]对[${UserDataB.name}]进行了偷袭`
        })
      }

      //
    } else {
      if (things) {
        DB.user_log.create({
          uid: UID,
          type: 1,
          create_time,
          message: `[${UserDataB.name}]夺走了[${UserData.name}]的[${things.name}]*${things.acount}~`
        })
      } else {
        DB.user_log.create({
          uid: UID,
          type: 1,
          create_time,
          message: `[${UserData.name}]被[${UserDataB.name}]击败~`
        })
      }
    }

    return
  },
  'message.create',
  /^(#|\/)?偷袭\d+$/
)
