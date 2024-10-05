import {
  user_level,
  goods,
  levels,
  user_equipment,
  user_fate,
  user
} from '@xiuxian/db/index'

/**
 * 更新面板
 * @param UID
 * @param battle_blood_now 当前血量
 * @returns
 */
export async function updatePanel(UID: string, battle_blood_now: number) {
  /**
   * 境界基础数据计算
   */

  const panel = {
    battle_blood_now: 0,
    battle_attack: 0,
    battle_defense: 0,
    battle_blood_limit: 0,
    battle_critical_hit: 0,
    battle_critical_damage: 0,
    battle_speed: 0,
    battle_power: 0
  }

  // 用户境界数据
  const userLevelData = await user_level
    .findAll({
      where: {
        uid: UID,
        type: [1, 2, 3] // 只要123
      }
    })
    .then(res => res.map(item => item?.dataValues))

  // 计算数值
  for await (const item of userLevelData) {
    // 境界？
    await levels
      .findOne({
        attributes: [
          'attack',
          'defense',
          'blood',
          'critical_hit',
          'critical_damage',
          'speed'
        ],
        where: {
          grade: item?.realm,
          type: item.type
        }
      })
      .then(res => res?.dataValues)
      .then(res => {
        if (!res) return
        panel.battle_attack = panel.battle_attack + res.attack
        panel.battle_defense = panel.battle_defense + res.defense
        panel.battle_blood_limit = panel.battle_blood_limit + res.blood
        panel.battle_critical_hit = panel.battle_critical_hit + res.critical_hit
        panel.battle_critical_damage =
          panel.battle_critical_damage + res.critical_damage
        panel.battle_speed = panel.battle_speed + res.speed
      })
      .catch(err => {
        console.error(err)
      })
  }

  /**
   * 计算背包数值
   */
  const equ = {
    attack: 0,
    defense: 0,
    blood: 0,
    critical_hit: 0,
    critical_damage: 0,
    speed: 0
  }

  const edata = await user_equipment
    .findAll({
      where: {
        uid: UID
      },
      include: {
        model: goods
      }
    })
    .then(res => res.map(item => item?.dataValues))

  for await (const item of edata) {
    equ.attack = equ.attack + item['good']['dataValues']['attack']
    equ.defense = equ.defense + item['good']['dataValues']['defense']
    equ.blood = equ.blood + item['good']['dataValues']['blood']
    equ.critical_hit =
      equ.critical_hit + item['good']['dataValues']['critical_hit']
    equ.critical_damage =
      equ.critical_damage + item['good']['dataValues']['critical_damage']
    equ.speed = equ.speed + item['good']['dataValues']['speed']
  }

  const fdata = await user_fate
    .findOne({
      where: {
        uid: UID
      },
      include: {
        model: goods
      }
    })
    .then(res => res?.dataValues)

  // 根据等级增幅 1级增加原来的 如 math.f(23+23/10*g)

  if (fdata) {
    // fdata.grade
    equ.attack =
      equ.attack +
      valculateNumerical(fdata['good']['dataValues']['attack'], fdata.grade)
    equ.defense =
      equ.defense +
      valculateNumerical(fdata['good']['dataValues']['defense'], fdata.grade)
    equ.blood =
      equ.blood +
      valculateNumerical(fdata['good']['dataValues']['blood'], fdata.grade)
    equ.critical_hit =
      equ.critical_hit +
      valculateNumerical(
        fdata['good']['dataValues']['critical_hit'],
        fdata.grade
      )
    equ.critical_damage =
      equ.critical_damage +
      valculateNumerical(
        fdata['good']['dataValues']['critical_damage'],
        fdata.grade
      )
    equ.speed =
      equ.speed +
      valculateNumerical(fdata['good']['dataValues']['speed'], fdata.grade)
  }

  /**
   * 计算本命面板
   */

  /**
   * 基础境界与装备结合计算
   */

  // 双境界面板之和
  panel.battle_attack = Math.floor(
    panel.battle_attack * (equ.attack * 0.01 + 1)
  )
  panel.battle_defense = Math.floor(
    panel.battle_defense * (equ.defense * 0.01 + 1)
  )
  panel.battle_blood_limit = Math.floor(
    panel.battle_blood_limit * (equ.blood * 0.01 + 1)
  )

  // 三维计算
  panel.battle_critical_hit += equ.critical_hit
  panel.battle_critical_damage += equ.critical_damage
  panel.battle_speed += equ.speed

  // 战力计算
  panel.battle_power =
    panel.battle_attack +
    panel.battle_defense +
    panel.battle_blood_limit / 2 +
    panel.battle_critical_hit * panel.battle_critical_hit +
    panel.battle_speed * 50

  // 血量不能超过最大值
  panel.battle_blood_now =
    battle_blood_now > panel.battle_blood_limit
      ? panel.battle_blood_limit
      : battle_blood_now

  user.update(panel, {
    where: {
      uid: UID
    }
  })
  return
}

/**
 * 提升血量
 * @param UID
 * @param SIZE
 * @returns
 */
export async function addBlood(BattleData, SIZE: number) {
  // 血量 增加 原来的百分之几
  if (isNaN(BattleData.battle_blood_now)) {
    BattleData.battle_blood_now = 100
  }
  BattleData.battle_blood_now += Math.floor(
    (BattleData.battle_blood_limit * SIZE) / 100
  )
  if (BattleData.battle_blood_now > BattleData.battle_blood_limit) {
    BattleData.battle_blood_now = BattleData.battle_blood_limit
  }
  await user.update(
    {
      battle_blood_now: BattleData.battle_blood_now
    },
    {
      where: {
        uid: BattleData.uid
      }
    }
  )
  return BattleData.battle_blood_now
}

/**
 * 下降血量
 * @param UID
 * @param SIZE
 * @returns
 */
export async function reduceBlood(BattleData, SIZE: number) {
  BattleData.battle_blood_now -= Math.floor(
    BattleData.battle_blood_limit * SIZE * 0.01
  )
  if (BattleData.battle_blood_now < 0) {
    BattleData.battle_blood_now = 0
  }
  await user.update(
    {
      battle_blood_now: BattleData.battle_blood_now
    },
    {
      where: {
        uid: BattleData.uid
      }
    }
  )
  return BattleData.battle_blood_now
}

export function valculateNumerical(val: number, grade: number) {
  return val + (val / 10) * grade
}
