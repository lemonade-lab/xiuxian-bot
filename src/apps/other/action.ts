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

const message = new Messages()

message.response(/^(#|\/)?服用[\u4e00-\u9fa5]+\*\d+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const [thingName, thingAcount] = e.msg.replace(/^(#|\/)?服用/, '').split('*')
  const thing = await GameApi.Bag.searchBagByName(UID, thingName)
  if (!thing) {
    e.reply([`没有[${thingName}]`], {
      quote: e.msg_id
    })
    return
  }
  if (thing.acount < Number(thingAcount)) {
    e.reply(['数量不足'], {
      quote: e.msg_id
    })
    return
  }
  // 得到用户数据
  const UserData = await GameApi.Users.read(UID)

  switch (thing.addition) {
    case 'boolere_covery': {
      let size = thing.boolere_covery * Number(thingAcount)
      size = size > 100 ? 100 : size
      const blood = await GameApi.Equipment.addBlood(UserData, size)
      e.reply([`💊${thingName}\n恢复了${size}%的血量\n🩸${blood}`], {
        quote: e.msg_id
      })
      break
    }
    case 'exp_gaspractice': {
      if (thing.exp_gaspractice <= 0) {
        e.reply([`[修为]+${0}`], {
          quote: e.msg_id
        })
        break
      }
      const size = Math.floor(
        (Number(thingAcount) *
          thing.exp_gaspractice *
          (UserData.talent_size + 100)) /
          100
      )
      const { msg } = await GameApi.Levels.addExperience(UID, 1, size)
      e.reply([msg], {
        quote: e.msg_id
      })
      break
    }
    case 'exp_bodypractice': {
      const size = Math.floor(
        (Number(thingAcount) *
          thing.exp_bodypractice *
          (UserData.talent_size + 100)) /
          100
      )
      const { msg } = await GameApi.Levels.addExperience(UID, 2, size)
      e.reply([msg], {
        quote: e.msg_id
      })
      break
    }
    case 'exp_soul': {
      const size = Math.floor(
        (Number(thingAcount) * thing.exp_soul * (UserData.talent_size + 100)) /
          100
      )
      const { msg } = await GameApi.Levels.addExperience(UID, 3, size)
      e.reply([msg], {
        quote: e.msg_id
      })
      break
    }
    default: {
      e.reply([`啥也不是的东东,丢了~`], {
        quote: e.msg_id
      })
    }
  }
  await GameApi.Bag.reduceBagThing(UID, [
    {
      name: thing.name,
      acount: Number(thingAcount)
    }
  ])
  return
})

message.response(/^(#|\/)?(学习|學習)[\u4e00-\u9fa5]+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return

  const thingName = e.msg.replace(/^(#|\/)?(学习|學習)/, '')

  const thing = await GameApi.Bag.searchBagByName(UID, thingName)
  if (!thing) {
    e.reply([`没有[${thingName}]`], {
      quote: e.msg_id
    })
    return
  }

  const AllSorcery = await GameApi.Skills.get(UID)

  const islearned = AllSorcery.find(item => item.name == thing.name)
  if (islearned) {
    e.reply(['学过了'], {
      quote: e.msg_id
    })
    return
  }

  if (AllSorcery.length >= GameApi.Cooling.myconfig_gongfa) {
    e.reply(['反复看了又看\n却怎么也学不进'], {
      quote: e.msg_id
    })
    return
  }

  /**
   * 新增功法
   */
  await GameApi.Skills.add(UID, thing.name)
  // 更新天赋
  setTimeout(async () => {
    const UserData = await GameApi.Users.read(UID)
    await GameApi.Skills.updataEfficiency(UID, UserData.talent)
  }, 1000)
  await GameApi.Bag.reduceBagThing(UID, [
    {
      name: thing.name,
      acount: 1
    }
  ])
  e.reply([`学习[${thingName}]`], {
    quote: e.msg_id
  })
  return
})

message.response(/^(#|\/)?忘掉[\u4e00-\u9fa5]+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return

  const thingName = e.msg.replace(/^(#|\/)?忘掉/, '')
  const AllSorcery = await GameApi.Skills.get(UID)
  const islearned = AllSorcery.find(item => item.name == thingName)
  if (!islearned) {
    e.reply([`没学过[${thingName}]`], {
      quote: e.msg_id
    })
    return
  }

  const UserData = await GameApi.Users.read(UID)
  /**
   * 检查背包
   */
  const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
  if (!BagSize) {
    e.reply(['储物袋空间不足'], {
      quote: e.msg_id
    })
    return
  }

  // 直接删

  await GameApi.Skills.del(UID, thingName)

  /**
   * 更新天赋
   */
  setTimeout(async () => {
    const UserData = await GameApi.Users.read(UID)
    await GameApi.Skills.updataEfficiency(UID, UserData.talent)
  }, 500)

  await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
    { name: islearned.name, acount: 1 }
  ])

  e.reply([`忘了[${thingName}]`], {
    quote: e.msg_id
  })
  return
})

message.response(/^(#|\/)?消耗[\u4e00-\u9fa5]+\*\d+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const [thingName, thingAcount] = e.msg.replace(/^(#|\/)?消耗/, '').split('*')
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
})

export const Action = message.ok
