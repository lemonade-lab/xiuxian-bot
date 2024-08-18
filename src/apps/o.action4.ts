import { Messages, type AEvent } from 'alemonjs'
import {
  showUserMsg,
  victoryCooling,
  isThereAUserPresent,
  reCreateMsg
} from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'

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
  e: AEvent,
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
  // 过了
  if (realm > grade) {
    e.reply(['该灵石已不足以提升修为'], {
      quote: e.msg_id
    })
    return
  }
  const size = Math.floor(
    (acount * thing.experience * (talentsize + 100)) / 100 / dividend
  )
  // 扣物品
  await GameApi.Bag.reduceBagThing(UID, [
    {
      name: thing.name,
      acount: acount
    }
  ])
  // 反馈
  const { msg } = await GameApi.Levels.addExperience(UID, 1, size)
  e.reply([msg])
  return
}

/**
 *
 * @param e
 * @param UID
 * @param acount
 * @returns
 */
async function sendLing(e: AEvent, UID: string, acount: number) {
  let dividend = 1
  if (acount > 2200) {
    e.reply(['最多仅能2200'], {
      quote: e.msg_id
    })
    return false
  }
  const CDID = 12,
    CDTime = GameApi.Cooling.CD_Pconst_ractice

  if (!(await victoryCooling(e, UID, CDID))) return false

  GameApi.Burial.set(UID, CDID, CDTime)

  const LevelData = await GameApi.Levels.read(UID, 1)
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

export default new Messages().response(
  /^(#|\/)?消耗[\u4e00-\u9fa5]+\*\d+$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, thingAcount] = e.msg
      .replace(/^(#|\/)?消耗/, '')
      .split('*')
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    // 检查数量
    if (thing.acount < Number(thingAcount)) {
      e.reply(['数量不足'], {
        quote: e.msg_id
      })
      return
    }
    // 不是道具
    if (thing.type != 6) {
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: Number(thingAcount)
        }
      ])
      e.reply([`[${thingName}]损坏`], {
        quote: e.msg_id
      })
      return
    }
    // 用户数据集成
    const UserData = await GameApi.Users.read(UID)

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
        const LevelData = await GameApi.Levels.read(UID, 1)
        if (!LevelData) {
          break
        }
        if (LevelData.realm > 24) {
          e.reply(['灵根已定\n此生不可再洗髓'], {
            quote: e.msg_id
          })
          break
        }
        UserData.talent = GameApi.Talent.getTalent()

        await GameApi.Users.update(UID, {
          talent: UserData.talent
        })
        /**
         * 更新天赋
         */
        setTimeout(async () => {
          await GameApi.Skills.updataEfficiency(UID, UserData.talent)
        }, 500)
        /**
         * 扣物品
         */
        await GameApi.Bag.reduceBagThing(UID, [
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
        await GameApi.Users.update(UID, {
          talent_show: UserData.talent_show
        })
        /**
         * 扣物品
         */
        await GameApi.Bag.reduceBagThing(UID, [
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
        await GameApi.Bag.reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        /**
         * 增加经验
         */
        const { msg } = await GameApi.Levels.addExperience(UID, 3, soul)
        e.reply([msg])
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
        await GameApi.Bag.reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        /**
         * 增加经验
         */
        const { msg } = await GameApi.Levels.addExperience(UID, 3, soul)
        e.reply([msg])
        break
      }
      // 金盆
      case 600305: {
        if (UserData.special_prestige <= 0) {
          e.reply(['已心无杂念'], {
            quote: e.msg_id
          })
          break
        }
        UserData.special_prestige -= Number(thingAcount)
        if (UserData.special_prestige <= 0) {
          UserData.special_prestige = 0
        }
        await GameApi.Users.update(UID, {
          special_prestige: UserData.special_prestige
        })

        /**
         * 扣物品
         */
        await GameApi.Bag.reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        e.reply([`成功洗去[煞气]*${thingAcount}~`])
        break
      }
      /**
       * 传送符
       */
      case 600402: {
        /**
         * 传送符用来回城池的
         */
        const PositionData = await DB.map_position
          .findAll({
            where: {
              attribute: [1, 6]
            }
          })
          .then(res => res.map(item => item.dataValues))
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

        await GameApi.Users.update(UID, {
          pont_x: point.x,
          pont_y: point.y,
          pont_z: point.z,
          point_type: point.type,
          pont_attribute: point.attribute
        })

        e.reply([`${UserData.name}成功传送至${point.name}`], {
          quote: e.msg_id
        })
        /**
         * 扣物品
         */
        await GameApi.Bag.reduceBagThing(UID, [
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
        // await GameApi.Bag.reduceBagThing(UID, [
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
        e.reply(['开天令:开辟宗门驻地\n————————\n此物暂未开放'], {
          quote: e.msg_id
        })
        break
      }
    }
    return
  }
)
