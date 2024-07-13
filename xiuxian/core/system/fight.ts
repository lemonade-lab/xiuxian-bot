import { type UserType } from 'xiuxian-db'
import { isProbability } from '../wrap/method.js'

export const Sneakattack = [
  '[A]想偷袭,[B]一个转身就躲过去了', // 偷袭
  '[A]偷袭,可刹那间连[B]的影子都看不到', // 偷袭
  '[A]找准时机,突然暴起冲向[B],但是[B]反应及时,[B]反手就把[A]打死了', // 回合
  '[A]突然一个左勾拳,谁料[B]揭化发,击败了[A]', // 回合
  '[A]一拳挥出,如流云遁日般迅疾轻捷,风声呼啸,草飞沙走,看似灵巧散漫,实则花里胡哨,[B]把[A]打得口吐鲜血,身影急退,掉落山崖而亡', // 回合
  '[A]拳之上凝结了庞大的气势,金色的光芒遮天蔽日,一条宛若黄金浇铸的真龙形成,浩浩荡荡地冲向[B],但[A]招式过于花里胡哨,[B]一个喷嚏就把[A]吹晕了', // 回合
  '[A]打的山崩地裂，河水倒卷，余波万里,可恶,是幻境,什么时候![B]突然偷袭,背后一刀捅死了[A]' // 回合
]

/**
 * 战斗模型
 * @param param0
 * @param param1
 * @returns
 */
export function start(UserA: UserType, UserB: UserType) {
  // 战斗消息
  const msg: string[] = [],
    HurtA = {
      original: 0, // 原始伤害
      outbreak: 0 // 暴伤
    },
    HurtB = {
      original: 0, // 原始伤害
      outbreak: 0 // 暴伤
    }

  // 胜利判断

  let victory = '0'

  /**
   * abao
   */
  const sizeA = UserA.battle_attack - UserB.battle_defense
  //
  HurtA.original = sizeA > 50 ? sizeA : 50

  // 暴击结算
  HurtA.outbreak = Math.floor(
    (HurtA.original * (100 + UserA.battle_critical_damage)) / 100
  )

  const Aac = () => {
    if (isProbability(UserA.battle_critical_hit)) {
      UserB.battle_blood_now -= HurtA.outbreak
      msg.push(
        `\n老六[${UserA.name}]偷袭成功,对[${UserB.name}]造成 ${HurtA.outbreak} 暴击伤害`
      )
    } else {
      // 普通结算
      UserB.battle_blood_now -= HurtA.original
      msg.push(
        `\n老六[${UserA.name}]偷袭成功,对[${UserB.name}]造成 ${HurtA.original} 普通伤害`
      )
    }
  }

  // 敏捷判断 如果 A敏捷 < B敏捷 - 5
  if (UserA.battle_speed < UserB.battle_speed - 5) {
    // 对方敏捷扣除缺不比对方大
    msg.push(
      `\n${Sneakattack[Math.floor(Math.random() * 2)]
        .replace('A', UserA.name)
        .replace('B', UserB.name)}`
    )
  } else {
    // aac
    Aac()
    /**
     * b血量减少
     */
    if (UserB.battle_blood_now < 1) {
      msg.push(`\n[${UserA.name}]仅出此招,就击败了[${UserB.name}]!`)
      UserB.battle_blood_now = 0
      // 返回双方变更值
      return {
        battle_blood_now: {
          a: UserA.battle_blood_now,
          b: UserB.battle_blood_now
        },
        victory: UserA.uid, // a胜利了
        msg
      }
    }
  }

  /**
   * Bbao
   */

  const sizeB = UserB.battle_attack - UserA.battle_defense
  // 原始伤害计算
  HurtB.original = sizeB > 50 ? sizeB : 50
  // 暴击伤害计算
  HurtB.outbreak = Math.floor(
    (HurtB.original * (100 + UserB.battle_critical_damage)) / 100
  )

  const Bac = () => {
    if (isProbability(UserB.battle_critical_hit)) {
      UserA.battle_blood_now -= HurtB.outbreak
      msg.push(
        `\n第${round}回合,[${UserB.name}]对[${UserA.name}]造成 ${HurtB.outbreak} 暴击伤害`
      )
    } else {
      // 普通结算
      UserA.battle_blood_now -= HurtB.original
      msg.push(
        `\n第${round}回合,[${UserB.name}]对[${UserA.name}]造成 ${HurtB.original} 普通伤害`
      )
    }
  }

  let round = 0,
    T = true

  // 战斗循环
  while (T) {
    round++

    /**
     * 正常回合,a未偷袭成功,b先开始
     */

    /**
     * 是否暴击
     */
    Bac()

    /**  判断血量  */
    if (UserA.battle_blood_now <= 0) {
      const replacements = {
        A: UserA.name,
        B: UserB.name
      }
      // A 没血了  b 赢了
      victory = UserB.uid
      UserB.battle_blood_now =
        UserB.battle_blood_now >= 0 ? UserB.battle_blood_now : 0
      UserA.battle_blood_now = 0
      msg.push(
        `\n${Sneakattack[Math.ceil(Math.random() * 5) + 1].replace(
          /A|B/g,
          match => replacements[match]
        )}`
      )
      T = false
      break
    }

    if (round >= 16) {
      /** 30个回合过去了 */
      msg.push(
        `\n[${UserA.name}]与[${UserB.name}]势均力敌.经过了${round}回合都奈何不了对方`
      )
      T = false
      break
    }

    // Aac
    Aac()

    if (UserB.battle_blood_now <= 0) {
      // B 没血了  A 赢了
      const replacements = {
        A: UserB.name,
        B: UserA.name
      }
      victory = UserA.uid
      //
      UserA.battle_blood_now =
        UserA.battle_blood_now >= 0 ? UserA.battle_blood_now : 0
      //
      UserB.battle_blood_now = 0
      msg.push(
        `\n${Sneakattack[Math.ceil(Math.random() * 5) + 1].replace(
          /A|B/g,
          match => replacements[match]
        )}`
      )
      T = false
      break
    }
  }

  return {
    battle_blood_now: {
      a: UserA.battle_blood_now,
      b: UserB.battle_blood_now
    },
    victory,
    msg
  }
}
