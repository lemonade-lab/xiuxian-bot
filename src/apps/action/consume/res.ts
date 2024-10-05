import {
  showUserMsg,
  victoryCooling,
  isUser,
  reCreateMsg
} from '@xiuxian/api/index'
import { map_position, user, user_level } from '@xiuxian/db/index'
import {
  Bag,
  Burial,
  Cooling,
  Levels,
  Skills,
  Talent
} from '@xiuxian/core/index'
import { operationLock } from '@xiuxian/core/index'
import { Text, useParse, useSend } from 'alemonjs'

/**
 *
 * @param e
 * @param UID
 * @param acount
 * @param thing
 * @param realm
 * @param talentsize
 * @returns
 */
async function addExperience(
  e,
  UID: string,
  grade: number,
  talentsize: number,
  thing: { name: string; experience: number },
  acount: number
) {
  const ling = await sendLing(e, UID, acount)
  if (!ling) {
    // 直接出去
    return
  }
  const { dividend, realm } = ling
  const Send = useSend(e)
  if (realm > grade) {
    Send(Text('该灵石已不足以提升修为'))
    return
  }
  const size = Math.floor(
    (acount * thing.experience * (talentsize + 100)) / 100 / dividend
  )
  // 扣物品
  await Bag.reduceBagThing(UID, [
    {
      name: thing.name,
      acount: acount
    }
  ])
  // 反馈
  const { msg } = await Levels.addExperience(UID, 1, size)
  Send(Text(msg))
  return
}

/**
 *
 * @param e
 * @param UID
 * @param acount
 * @returns
 */
async function sendLing(e, UID: string, acount: number) {
  let dividend = 1
  if (acount > 2200) {
    const Send = useSend(e)
    Send(Text('最多仅能2200'))
    return false
  }
  const CDID = 12,
    CDTime = Cooling.CD_Pconst_ractice

  if (!(await victoryCooling(e, UID, CDID))) return false

  Burial.set(UID, CDID, CDTime)

  const LevelData = await user_level
    .findOne({
      attributes: ['addition', 'realm', 'experience'],
      where: {
        uid: UID,
        type: 1
      }
    })
    .then(res => res?.dataValues)
  /**
   * 到了筑基,灵石收益成倍削弱
   */
  if (LevelData.realm > 12) {
    dividend = LevelData.realm - 10
    dividend = dividend > 8 ? 8 : dividend
  }
  return {
    realm: LevelData.realm,
    dividend
  }
}

export default OnResponse(
  async e => {
    // 操作锁
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }
    // 检查用户
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    // 解析
    const text = useParse(e.Megs, 'Text')
    if (!text) return
    const [thingName, thingAcount] = text.replace(/^(#|\/)?消耗/, '').split('*')
    const thing = await Bag.searchBagByName(UID, thingName)
    if (!thing) {
      Send(Text(`没有[${thingName}]`))
      return
    }
    // 检查数量
    if (thing.acount < Number(thingAcount)) {
      Send(Text('数量不足'))
      return
    }
    // 不是道具
    if (thing.type != 6) {
      await Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: Number(thingAcount)
        }
      ])
      Send(Text(`[${thingName}]损坏`))
      return
    }

    switch (thing.id) {
      case 600201: {
        addExperience(
          e,
          UID,
          12,
          UserData.talent_size,
          {
            name: thing.name,
            experience: thing.exp_gaspractice
          },
          Number(thingAcount)
        )
        break
      }
      case 600202: {
        addExperience(
          e,
          UID,
          20,
          UserData.talent_size,
          {
            name: thing.name,
            experience: thing.exp_gaspractice
          },
          Number(thingAcount)
        )
        break
      }
      case 600203: {
        addExperience(
          e,
          UID,
          28,
          UserData.talent_size,
          {
            name: thing.name,
            experience: thing.exp_gaspractice
          },
          Number(thingAcount)
        )
        break
      }
      case 600204: {
        addExperience(
          e,
          UID,
          36,
          UserData.talent_size,
          {
            name: thing.name,
            experience: thing.exp_gaspractice
          },
          Number(thingAcount)
        )
        break
      }
      /**
       * 洗灵根
       */
      case 600301: {
        const LevelData = await user_level
          .findOne({
            attributes: ['addition', 'realm', 'experience'],
            where: {
              uid: UID,
              type: 1
            }
          })
          .then(res => res?.dataValues)
        if (!LevelData) {
          break
        }
        if (LevelData.realm > 24) {
          Send(Text('灵根已定\n此生不可再洗髓'))
          break
        }
        UserData.talent = Talent.getTalent()
        await user.update(
          {
            talent: UserData.talent
          },
          {
            where: {
              uid: UID
            }
          }
        )

        /**
         * 更新天赋
         */
        setTimeout(async () => {
          await Skills.updataEfficiency(UID, UserData.talent)
        }, 500)
        /**
         * 扣物品
         */
        await Bag.reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        /**
         * 显示资料
         */
        setTimeout(() => {
          showUserMsg(e)
        }, 1000)
        break
      }
      /**
       * 望灵珠
       */
      case 600302: {
        UserData.talent_show = 1

        await user.update(
          {
            talent_show: UserData.talent_show
          },
          {
            where: {
              uid: UID
            }
          }
        )

        /**
         * 扣物品
         */
        await Bag.reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        /**
         * 显示资料
         */
        setTimeout(() => {
          showUserMsg(e)
        }, 500)
        break
      }
      /**
       * 灵木
       */
      case 600304: {
        const soul = thing.exp_soul * Number(thingAcount)
        /**
         * 扣物品
         */
        await Bag.reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        /**
         * 增加经验
         */
        const { msg } = await Levels.addExperience(UID, 3, soul)
        Send(Text(msg))
        break
      }
      /**
       * 桃花酿
       */
      case 600306: {
        const soul = thing.exp_soul * Number(thingAcount)
        /**
         * 扣物品
         */
        await Bag.reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        /**
         * 增加经验
         */
        const { msg } = await Levels.addExperience(UID, 3, soul)
        Send(Text(msg))
        break
      }
      // 金盆
      case 600305: {
        if (UserData.special_prestige <= 0) {
          Send(Text('已心无杂念'))
          break
        }
        UserData.special_prestige -= Number(thingAcount)
        if (UserData.special_prestige <= 0) {
          UserData.special_prestige = 0
        }
        await user.update(
          {
            special_prestige: UserData.special_prestige
          },
          {
            where: {
              uid: UID
            }
          }
        )

        /**
         * 扣物品
         */
        await Bag.reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        Send(Text(`成功洗去[煞气]*${thingAcount}~`))
        break
      }
      /**
       * 传送符
       */
      case 600402: {
        /**
         * 传送符用来回城池的
         */
        const PositionData = await map_position
          .findAll({
            where: {
              attribute: [1, 6]
            }
          })
          .then(res => res.map(item => item?.dataValues))
        const point = {
          type: 0,
          attribute: 0,
          name: '记录',
          x: 0,
          y: 0,
          z: 0
        }
        let closestPosition: null | number = null
        for await (const item of PositionData) {
          const x = (item?.x1 + item?.x2) / 2,
            y = (item?.y1 + item?.y2) / 2,
            z = (item?.z1 + item?.z1) / 2
          const distance = Math.sqrt(
            Math.pow(x - UserData.pont_x, 2) +
              Math.pow(y - UserData.pont_y, 2) +
              Math.pow(z - UserData.pont_z, 2)
          )
          if (!closestPosition || distance < closestPosition) {
            closestPosition = distance
            point.type = item?.type
            point.name = item?.name
            point.attribute = item?.attribute
            point.x = x
            point.y = y
            point.z = z
          }
        }

        await user.update(
          {
            pont_x: point.x,
            pont_y: point.y,
            pont_z: point.z,
            point_type: point.type,
            pont_attribute: point.attribute
          },
          {
            where: {
              uid: UID
            }
          }
        )

        Send(Text(`${UserData.name}成功传送至${point.name}`))

        /**
         * 扣物品
         */
        await Bag.reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        break
      }
      /**
       * 引魂灯
       */
      case 600403: {
        // await Bag.reduceBagThing(UID, [
        //   {
        //     name: thing.name,
        //     acount: Number(thingAcount)
        //   }
        // ])
        // 还用扣掉物品码？  直接重生了。
        reCreateMsg(e)
        // e.reply(['暂不可使用'], {
        //   quote: e.msg_id
        // })
        break
      }
      /**
       * 开天令
       */
      case 600401: {
        Send(Text('开天令:开辟宗门驻地\n————————\n此物暂未开放'))
        break
      }
    }
    return
  },
  'message.create',
  /^(#|\/)?消耗[\u4e00-\u9fa5]+\*\d+$/
)
