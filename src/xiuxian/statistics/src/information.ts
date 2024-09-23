import * as DB from 'xiuxian-db'
import { Op } from 'sequelize'
import { Talent, Equipment } from 'xiuxian-core'

/**
 * 个人信息
 * @param UID
 * @param UserAvatar
 * @returns
 */
export async function personalInformation(UID: string, UserAvatar: string) {
  const UserData = await DB.user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)

  // 灵根名
  let size = '未知'
  let name = '未知'

  // 显示
  if (UserData?.talent_show == 1) {
    size = `+${Math.trunc(UserData.talent_size)}%`
    name = await Talent.getTalentName(UserData.talent)
  }

  // 固定数据读取
  const userLevelData = await DB.user_level
    .findAll({
      where: {
        uid: UID,
        type: [1, 2, 3]
      },
      order: [['type', 'DESC']]
    })
    .then(res => res.map(item => item?.dataValues))

  // 境界数据
  const GaspracticeList = await DB.levels
    .findAll({
      attributes: ['name', 'type', 'exp_needed'],
      where: {
        grade: [userLevelData[2]?.realm],
        type: 1
      }
    })
    .then(res => res.map(item => item?.dataValues))

  // 境界数据
  const BodypracticeList = await DB.levels
    .findAll({
      attributes: ['name', 'type', 'exp_needed'],
      where: {
        grade: userLevelData[1]?.realm,
        type: 2
      }
    })
    .then(res => res.map(item => item?.dataValues))

  // 境界数据
  const SoulList = await DB.levels
    .findAll({
      attributes: ['name', 'type', 'exp_needed'],
      where: {
        grade: userLevelData[0]?.realm,
        type: 3
      }
    })
    .then(res => res.map(item => item?.dataValues))

  /**
   * 境界数据要关联起来
   */

  // 固定数据读取
  const GaspracticeData = GaspracticeList[0]
  const BodypracticeData = BodypracticeList[0]
  const SoulData = SoulList[0]

  const skills = await DB.user_skills
    .findAll({
      where: {
        uid: UID
      },
      include: {
        model: DB.goods
      }
    })
    .then(res => res.map(item => item?.dataValues))

  //
  const equipment = await DB.user_equipment
    .findAll({
      where: {
        uid: UID
      },
      include: {
        model: DB.goods
      }
    })
    .then(res => res.map(item => item?.dataValues))

  return {
    UID: UID,
    avatar: UserAvatar,
    // 天赋
    linggenName: name,
    talentsize: size,
    talent_show: UserData.talent_show,
    talent: UserData.talent,
    special_reputation: UserData.special_reputation,
    battle_power: UserData.battle_power,
    // UserData
    name: UserData.name,
    battle_blood_now: UserData.battle_blood_now,
    battle_blood_limit: UserData.battle_blood_limit,
    age: UserData.age,
    age_limit: UserData.age_limit,
    autograph: UserData.autograph,
    special_spiritual: UserData.special_spiritual,
    special_spiritual_limit: UserData.special_spiritual_limit,
    special_prestige: UserData.special_prestige,
    // 境界信息
    level: {
      gaspractice: {
        Name: GaspracticeData?.name,
        Experience: userLevelData[2]?.experience,
        ExperienceLimit: GaspracticeData?.exp_needed
      },
      bodypractice: {
        Name: BodypracticeData?.name,
        Experience: userLevelData[1]?.experience,
        ExperienceLimit: BodypracticeData?.exp_needed
      },
      soul: {
        Name: SoulData?.name,
        Experience: userLevelData[0]?.experience,
        ExperienceLimit: SoulData?.exp_needed
      }
    },
    equipment: equipment,
    skills: skills,
    theme: UserData.theme
  }
}

export type PersonalInformationType =
  ReturnType<typeof personalInformation> extends Promise<infer T> ? T : never

/**
 * 装备信息
 * @param UID
 * @param UserAvatar
 * @returns
 */
export async function equipmentInformation(UID: string, UserAvatar: string) {
  // 得到用户数据
  const UserData = await DB.user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
  const equipment = await DB.user_equipment
    .findAll({
      where: {
        uid: UID
      },
      include: {
        model: DB.goods
      }
    })
    .then(res => res.map(item => item?.dataValues))

  const fdata = await DB.user_fate
    .findOne({
      where: {
        uid: UID
      },
      include: {
        model: DB.goods
      }
    })
    .then(res => res?.dataValues)

  const arr: {
    name: string
    grade: number
    attack: number
    defense: number
    blood: number
    critical_hit: number
    critical_damage: number
    speed: number
  }[] = []

  if (fdata) {
    arr.push({
      name: fdata.name,
      grade: fdata.grade,
      attack: Equipment.valculateNumerical(
        fdata['good']['dataValues']['attack'],
        fdata.grade
      ),
      defense: Equipment.valculateNumerical(
        fdata['good']['dataValues']['defense'],
        fdata.grade
      ),
      blood: Equipment.valculateNumerical(
        fdata['good']['dataValues']['blood'],
        fdata.grade
      ),
      critical_hit: Equipment.valculateNumerical(
        fdata['good']['dataValues']['critical_hit'],
        fdata.grade
      ),
      critical_damage: Equipment.valculateNumerical(
        fdata['good']['dataValues']['critical_damage'],
        fdata.grade
      ),
      speed: Equipment.valculateNumerical(
        fdata['good']['dataValues']['speed'],
        fdata.grade
      )
    })
  }

  return {
    UID,
    battle_power: UserData.battle_power,
    battle_attack: UserData.battle_attack,
    battle_defense: UserData.battle_defense,
    battle_blood_limit: UserData.battle_blood_limit,
    battle_speed: UserData.battle_speed,
    battle_critical_hit: UserData.battle_critical_hit,
    battle_critical_damage: UserData.battle_critical_damage,
    equipment: equipment,
    fate: arr,
    avatar: UserAvatar
  }
}

export type EquipmentInformationType =
  ReturnType<typeof equipmentInformation> extends Promise<infer T> ? T : never

/**
 * 功法信息
 * @param UID
 * @param UserAvatar
 * @returns
 */
export async function skillInformation(UID: string, UserAvatar: string) {
  // 得到用户数据
  const UserData = await DB.user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
  // 灵根名
  let size = '未知'
  let name = '未知'
  if (UserData.talent_show == 1) {
    size = `+${Math.trunc(UserData.talent_size)}%`
    name = await Talent.getTalentName(UserData.talent)
  }
  const skills = await DB.user_skills
    .findAll({
      where: {
        uid: UID
      },
      include: [
        {
          model: DB.goods,
          where: {}
        }
      ]
    })
    .then(res => res.map(item => item?.dataValues))

  return {
    UID,
    skills: skills,
    name: UserData.name,
    linggenName: name,
    talentsize: size,
    avatar: UserAvatar
  }
}

export type SkillInformationType =
  ReturnType<typeof skillInformation> extends Promise<infer T> ? T : never

/**
 * 储物袋
 * @param UID
 * @param UserAvatar
 * @param type
 * @returns
 */
export async function backpackInformation(
  UID: string,
  UserAvatar: string,
  type: number | number[]
) {
  // 得到用户数据
  const UserData = await DB.user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
  const length = await DB.user_bag.count({
    where: {
      uid: UID
    }
  })

  const bag = await DB.user_bag
    .findAll({
      where: {
        uid: UID
      },
      include: {
        model: DB.goods,
        where: {
          type: type
        }
      }
    })
    .then(res => res.map(item => item?.dataValues))

  const bag_message = await DB.user_bag_message
    .findOne({ where: { uid: UID } })
    .then(res => res?.dataValues)

  return {
    UID,
    name: UserData.name,
    bag_grade: bag_message.grade,
    length: length,
    bag: bag,
    avatar: UserAvatar
  }
}

export type BackpackInformationType =
  ReturnType<typeof backpackInformation> extends Promise<infer T> ? T : never

/**
 * 呐戒
 * @param UID
 * @param UserAvatar
 * @returns
 */
export async function ringInformation(UID: string, UserAvatar: string) {
  const UserData = await DB.user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
  const length = await DB.user_ring.count({
    where: {
      uid: UID
    }
  })
  const bag = await DB.user_ring
    .findAll({
      where: {
        uid: UID
      },
      include: {
        model: DB.goods
      }
    })
    .then(res => res.map(item => item?.dataValues))
  return {
    UID,
    name: UserData.name,
    bag_grade: 1,
    length: length ?? 0,
    bag: bag,
    avatar: UserAvatar
  }
}

export type RingInformationType =
  ReturnType<typeof ringInformation> extends Promise<infer T> ? T : never

/**
 * 显示通天塔
 * @param UID
 * @returns
 */
export async function showSky(UID: string) {
  // 找到比自己id大  xxx的 4条数据。
  const data = await DB.sky
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
  const list = await DB.sky
    .findAll({
      where: {
        id: { [Op.lte]: data.id } // 获取ID小于给定ID的记录
      },
      order: [['id', 'DESC']], // 根据 id 升序排序
      //
      limit: 5
    })
    .then(res => res.map(item => item?.dataValues))
  const msg: {
    id: number
    UID: string
    name: string
    power: number
    autograph: string
    UserAvatar: string
  }[] = []
  for (const item of list) {
    const data = await DB.user
      .findOne({
        attributes: [
          'id',
          'uid',
          'name',
          'battle_power',
          'autograph',
          'avatar'
        ],
        where: {
          uid: item.uid
        }
      })
      .then(res => res?.dataValues)
    if (!data) {
      // 不存在 uid
      DB.sky.destroy({
        where: {
          uid: item.uid
        }
      })
      continue
    }
    msg.unshift({
      id: item.id,
      UID: item.uid,
      name: data.name,
      power: data.battle_power,
      autograph: data.autograph,
      UserAvatar: data.avatar
    })
  }
  return msg
}

export type ShowSkyType =
  ReturnType<typeof showSky> extends Promise<infer T> ? T : never
