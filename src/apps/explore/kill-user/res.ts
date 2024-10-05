import {
  isUser,
  ControlByBlood,
  sendReply,
  killNPC,
  victoryCooling
} from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
import * as DB from '@xiuxian/db/index'

import { Text, useParse, useSend } from 'alemonjs'

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

    // 血量不足
    if (!(await ControlByBlood(e, UserData))) return
    const CDID = 10

    // 冷却
    if (!(await victoryCooling(e, UID, CDID))) return

    const text = useParse(e.Megs, 'Text')

    const Mname = text.replace(/^(#|\/)?(击杀|擊殺)/, '')

    if (!(await killNPC(e, Mname, UID, UserData.special_prestige))) return

    const monstersdata = await GameApi.Monster.monsterscache(
      UserData.point_type
    )

    //
    const mon = monstersdata[Mname]

    // 是否在城里 是否存在  是否充足
    if (UserData.pont_attribute == 1 || !mon || mon.acount < 1) {
      Send(Text(`这里没有[${Mname}],去别处看看吧`))

      return
    }

    const need_spiritual = Math.floor((mon.level + 20) / 3)
    if (UserData.special_spiritual < need_spiritual) {
      Send(Text('灵力不足'))

      return
    }

    // 判断储物袋大小,不够的就不推送
    const BagSize = await GameApi.Bag.backpackFull(UID)

    // 背包未位置了直接返回了
    if (!BagSize) {
      Send(Text('储物袋空间不足'))

      return
    }

    const LevelMax = await DB.levels
      .findOne({
        where: {
          id: Number(mon.level),
          type: 0
        }
      })
      .then(res => res?.dataValues)

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
    })

    await DB.user.update(
      {
        battle_blood_now: BMSG.battle_blood_now.a,
        special_spiritual: UserData.special_spiritual - need_spiritual,
        special_reputation: UserData.special_reputation + mon.level
      },
      {
        where: {
          uid: UID
        }
      }
    )

    const BooldMsg = `\n🩸${BMSG.battle_blood_now.a}`
    if (UserData.battle_show) {
      sendReply(e, '[战斗结果]', BMSG.msg)
    }

    const msgRight: string[] = []
    // 增加失败了有概率抢走物品
    if (BMSG.victory == '0') {
      Send(Text(`与${Mname}打成了平手${BooldMsg}`))

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
        Send(Text(`[${Mname}]击碎了你的[${thing[0].name}]`))

        return
      } else {
        Send(Text(`你被${Mname}击败了,未获得任何物品`))

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
    await GameApi.Bag.addBagThing(UID, ThingArr)

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

    Send(Text(msgRight.join('')))

    return
  },
  'message.create',
  /^(#|\/)?(击杀|擊殺)[\u4e00-\u9fa5]+$/
)
