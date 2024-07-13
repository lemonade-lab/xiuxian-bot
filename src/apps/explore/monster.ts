import {
  APlugin,
  Controllers,
  type MessageButtonType,
  type AEvent
} from 'alemonjs'
import {
  isThereAUserPresent,
  GameApi,
  ControlByBlood,
  sendReply,
  killNPC,
  victoryCooling,
  controlByName
} from '../../api/index.js'
const reStart = {}

import * as DB from 'xiuxian-db'
export class Monster extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(击杀|擊殺)[\u4e00-\u9fa5]+$/, fnc: 'userKill' },
        { reg: /^(#|\/)?探索怪物$/, fnc: 'userExploremonsters' },
        { reg: /^(#|\/)?挑战妖塔$/, fnc: 'demontower' }
      ]
    })
  }

  /**
   * 击杀
   * @param e
   * @returns
   */
  async userKill(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    const CDID = 10
    if (!(await victoryCooling(e, UID, CDID))) return
    const Mname = e.msg.replace(/^(#|\/)?(击杀|擊殺)/, '')
    if (!killNPC(e, Mname, UID, UserData.special_prestige)) return
    const monstersdata = await GameApi.Monster.monsterscache(
      UserData.point_type
    )
    const mon = monstersdata[Mname]
    // 是否在城里 是否存在  是否充足
    if (UserData.pont_attribute == 1 || !mon || mon.acount < 1) {
      e.reply([`这里没有[${Mname}],去别处看看吧`], {
        quote: e.msg_id
      })
      return
    }

    const need_spiritual = Math.floor((mon.level + 20) / 3)
    if (UserData.special_spiritual < need_spiritual) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }

    // 判断储物袋大小,不够的就不推送
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)

    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }

    const LevelMax: DB.LevelsType = (await DB.levels.findOne({
      where: {
        id: Number(mon.level),
        type: 0
      },
      raw: true
    })) as any

    // 怪物没有那么多的字段
    const BMSG = GameApi.Fight.start(UserData, {
      uid: '1',
      name: Mname,
      battle_show: 0,
      battle_blood_now: Math.floor(
        LevelMax.blood * ((mon.level + 1) * 0.01 + 1)
      ),
      battle_attack: Math.floor(LevelMax.attack * ((mon.level + 1) * 0.05 + 1)),
      battle_defense: Math.floor(
        LevelMax.defense * ((mon.level + 1) * 0.01 + 1)
      ),
      battle_blood_limit: Math.floor(
        LevelMax.blood * ((mon.level + 1) * 0.01 + 1)
      ),
      battle_critical_hit: mon.level + 30,
      battle_critical_damage: LevelMax.critical_damage + mon.level,
      battle_speed: LevelMax.speed + 10,
      battle_power: 0
    } as DB.UserType)

    await GameApi.Users.update(UID, {
      battle_blood_now: BMSG.battle_blood_now.a,
      special_spiritual: UserData.special_spiritual - need_spiritual,
      special_reputation: UserData.special_reputation + mon.level
    } as DB.UserType)

    const BooldMsg = `\n🩸${BMSG.battle_blood_now.a}`
    if (UserData.battle_show) {
      sendReply(e, '[战斗结果]', BMSG.msg)
    }

    const msgRight: string[] = []
    // 增加失败了有概率抢走物品
    if (BMSG.victory == '0') {
      e.reply([`与${Mname}打成了平手${BooldMsg}`], {
        quote: e.msg_id
      })
      return
    } else if (BMSG.victory == '1') {
      let thing: { name: string; type: number; acount: number }[] = []
      if (
        await GameApi.Method.isTrueInRange(
          1,
          100,
          Math.floor(UserData.special_prestige + 10)
        )
      ) {
        thing = await GameApi.Bag.delThing(UID)
      }
      if (thing.length != 0) {
        e.reply(
          [`[${Mname}]击碎了你的[${thing[0]?.name}]\n你重伤倒地,奄奄一息~`],
          {
            quote: e.msg_id
          }
        )
        return
      } else {
        e.reply([`你被${Mname}重伤倒地!`], {
          quote: e.msg_id
        })
        return
      }
    } else {
      msgRight.push(`${UserData.name}击败了[${Mname}]`)
    }

    const p = getMonsterProbability(mon.level)
    const size = 10 - Math.floor(p / 10)
    const s = (mon.level * size * (UserData.talent_size + 100)) / 100

    if (p > 45) {
      const SIZE = Math.floor(s + 800)
      msgRight.push(`\n[气血]增加了${SIZE}`)
      await GameApi.Levels.addExperience(UID, 2, SIZE)
    }

    if (p > 30) {
      const SIZE = Math.floor(s + 400)
      msgRight.push(`\n[气血]增加了*${SIZE}`)
      await GameApi.Levels.addExperience(UID, 2, SIZE)
    }

    if (p > 20) {
      const SIZE = Math.floor(s + 200)
      msgRight.push(`\n[气血]增加了*${SIZE}`)
      await GameApi.Levels.addExperience(UID, 2, SIZE)
    }
    /**
     * 检查储物袋位置
     */
    const ThingArr: { name: string; acount: number }[] = []

    if (p > 30) {
      const obj = {}
      if (p > 60) {
        const type = GameApi.Method.isProbability(mon.level)
        const thing = await GameApi.Goods.getRandomThing({
          commodities: 1,
          type: type ? 1 : 4 // 血药4  武器 1
        })
        const acount = GameApi.Method.leastOne(Math.floor(mon.level / mon.type))
        ThingArr.push({
          name: thing.name,
          acount: acount > 16 ? (type ? 17 : 13) : acount
        })
      }

      if (p > 50) {
        // 得到材料   等级越高 数量越多  品种越高贵  数量越少
        const thing = await GameApi.Goods.getRandomThing({
          drops: 1,
          type: 7,
          monster_type: mon.type ?? 1
        })

        if (thing) {
          obj[thing.name] = GameApi.Method.leastOne(
            Math.floor(mon.level / mon.type)
          )
        }
      }

      // 随机物
      const thing = await GameApi.Goods.getRandomThing({
        drops: 1,
        type: 7,
        monster_type: mon.type ?? 1
      })

      if (thing) {
        const acount = GameApi.Method.leastOne(
          Math.floor(mon.level / mon.type / 2)
        )
        // 相同
        if (obj[thing.name]) {
          obj[thing.name] += acount
        } else {
          // 不相同
          obj[thing.name] = acount
        }
        for (const item in obj) {
          ThingArr.push({
            name: item,
            acount: obj[item]
          })
        }
      }
    }

    if (p > 20) {
      const lingshi = GameApi.Method.leastOne(mon.level * size + 100)
      ThingArr.push({
        name: '中品灵石',
        acount: lingshi
      })
    }

    if (p > 10) {
      const lingshi = GameApi.Method.leastOne(mon.level * size + 300)
      ThingArr.push({
        name: '下品灵石',
        acount: lingshi
      })
    }
    const P1 = GameApi.Method.isProbability(5)

    if (P1) {
      ThingArr.push({
        name: '开天令',
        acount: 1
      })
    }
    // 添加物品
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, ThingArr)

    // 随机文案
    msgRight.push(`\n${randomTxt()}`)

    // 检查背包是否拥有次物品,拥有则反馈信息
    for await (const item of ThingArr) {
      const T = await GameApi.Bag.searchBagByName(UID, item.name)
      if (T) msgRight.push(`\n[${item.name}]*${item.acount}`)
    }

    msgRight.push(BooldMsg)
    // 设置冷却
    GameApi.Burial.set(UID, CDID, GameApi.Cooling.CD_Kill)
    // 减少怪物
    await GameApi.Monster.reduce(UserData.point_type, Mname)
    // 发送下下哦i
    await e.reply(msgRight)
    Controllers(e).Message.reply('', [
      { label: '储物袋', value: '/储物袋' },
      { label: '突破', value: '/突破' },
      { label: '破境', value: '/破境' }
    ])
    return
  }

  /**
   * 探索怪物
   * @param e
   * @returns
   */
  async userExploremonsters(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    if (UserData.pont_attribute == 1) {
      e.reply('[城主府]巡逻军:\n城内切莫释放神识!')
      return
    }
    const name = await GameApi.Map.getPlaceName(
      UserData.point_type,
      UserData.pont_attribute
    )
    const MonsterData: DB.LevelsType[] = (await DB.levels.findAll({
      attributes: ['name'],
      where: {
        type: 0
      },
      raw: true
    })) as any
    const monster = await GameApi.Monster.monsterscache(UserData.point_type)
    // monster 是一个对象 需要先按等级排序
    const sortedMonsters = Object.keys(monster).sort(
      (a, b) => monster[a].level - monster[b].level
    )
    if (sortedMonsters.length == 0) {
      e.reply('附近无怪物', {
        quote: e.msg_id
      })
      return
    }
    const msg: string[] = [`[${name}]的妖怪`]
    for (const item of sortedMonsters) {
      msg.push(
        `\n${item}(${MonsterData[monster[item].level]?.name})*${
          monster[item].acount
        }`
      )
    }
    const m = Controllers(e).Message
    e.reply(msg).then(() => {
      // 分开发送。
      const arrs: MessageButtonType[][] = []
      let arr: MessageButtonType[] = []
      for (const item of sortedMonsters) {
        arr.push({ label: item, value: `/击杀${item}` })
        if (arr.length >= 3) {
          arrs.push(arr)
          arr = []
        }
      }
      if (arr.length >= 1) {
        arrs.push(arr)
      }
      m.reply('', ...arrs)
    })
    return
  }
  /**
   * 妖塔
   * @param e
   * @returns
   */
  async demontower(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!reStart[UID] || reStart[UID] + 120000 < new Date().getTime()) {
      reStart[UID] = new Date().getTime()
      e.reply([`CD中`]).catch((err: any) => {
        console.error(err)
        return
      })
      return
    }
    if (!(await controlByName(e, UserData, '星海'))) return
    if (!(await ControlByBlood(e, UserData))) return
    // 判断储物袋大小,不够的就不推送
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const bag = await GameApi.Bag.searchBagByName(UID, '下品灵石')
    if (!bag || bag.acount < 100000) {
      return e.reply('下品灵石不足')
    }
    GameApi.Bag.reduceBagThing(UID, [{ name: '下品灵石', acount: 100000 }])
    const p = Math.floor(Math.random() * (100 - 1) + 1)
    let addpower = 0
    if (p < 25) {
      addpower = 0
    } else if (p > 25 && p < 50) {
      addpower = 1 + 0.25
    } else if (p > 50 && p < 75) {
      addpower = 1 + 0.3
    } else if (p > 75 && p <= 100) {
      addpower = 1 + 0.4
    }
    const BMSG = GameApi.Fight.start(UserData, {
      uid: '1',
      name: '守塔人',
      battle_show: 0,
      battle_blood_now: Math.floor(366791 + addpower),
      battle_attack: Math.floor(52114 + addpower),
      battle_defense: Math.floor(25525 + addpower),
      battle_blood_limit: Math.floor(366791 + addpower),
      battle_critical_hit: 10 + 30,
      battle_critical_damage: Math.floor(50 + addpower),
      battle_speed: Math.floor(41 + addpower),
      battle_power: 0
    } as DB.UserType)
    const BooldMsg = `\n🩸${BMSG.battle_blood_now.a}`
    if (UserData.battle_show) {
      sendReply(e, '[战斗结果]', BMSG.msg)
    }
    if (BMSG.victory == '0') {
      e.reply([`与${'守塔人'}打成了平手${BooldMsg}`], {
        quote: e.msg_id
      })
      return
    } else if (BMSG.victory == '1') {
      e.reply('你被守塔人击败了,未获得任何物品')
    } else {
      if (p < 25) {
        if (p < 5) {
          GameApi.Bag.addBagThing(UID, 6, [{ name: '养魂木', acount: 1 }])
          return e.reply('获得养魂木*1')
        } else if (p < 10) {
          GameApi.Bag.addBagThing(UID, 6, [{ name: '金焰石', acount: 1 }])
          return e.reply('获得金焰石*1')
        } else if (p < 15) {
          GameApi.Bag.addBagThing(UID, 6, [{ name: '息壤之土', acount: 1 }])
          return e.reply('获得息壤之土*1')
        } else if (p < 20) {
          GameApi.Bag.addBagThing(UID, 6, [{ name: '灵烛果', acount: 1 }])
          return e.reply('获得灵烛果*1')
        } else {
          GameApi.Bag.addBagThing(UID, 6, [{ name: '长生泉', acount: 1 }])
          return e.reply('获得长生泉*1')
        }
      } else if (p > 25 && p < 50) {
        return e.reply(
          '虽然你勇敢地战胜了守塔的守卫,但这次战斗似乎没有找到任何物品'
        )
      } else if (p > 50 && p <= 100) {
        GameApi.Bag.addBagThing(UID, 6, [{ name: '还春丹', acount: 2 }])
        return e.reply('获得还春丹*2')
      }
    }
    return
  }
}

/**
 * 根据怪物等级得到奖励概率
 * @param level
 * @returns
 */
function getMonsterProbability(level: number) {
  // 计算概率整数
  level = level < 0 ? 0 : level
  // 基础概率为20
  const baseProbability = 20
  // 每增加
  const probabilityIncrease = Math.floor(Math.random() * 3) + 1
  const probability =
    baseProbability +
    level * probabilityIncrease -
    Math.floor(Math.random() * 10) +
    5
  const size = probability < 95 ? probability : 95
  return size
}

/**
 * 随机宝物获取文案数组
 */
const treasureMessages = [
  '瞅了一眼身旁的草丛,看到了',
  '在身后的洞穴中发现了',
  '在一片杂草中发现了',
  '从树洞里捡到了',
  '在河边捡到了',
  '在怪物身上找到了'
]

/**
 * 随机文案
 * @returns
 */
function randomTxt() {
  return treasureMessages[Math.floor(Math.random() * treasureMessages.length)]
}
