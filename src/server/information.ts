import * as DB from '../db/index.js'
import * as Blessing from '../model/users/additional/blessing.js'
import * as Ring from '../model/users/additional/ring.js'
import * as Talent from '../model/users/base/talent.js'
import * as Bag from '../model/users/additional/bag.js'
import * as Users from '../model/users/index.js'
import * as Equipment from '../model/users/additional/equipment.js'

/**
 * 个人信息
 * @param UID
 * @param user_avatar
 * @returns
 */
export async function personalInformation(UID: string, user_avatar: string) {
  // 得到用户数据
  const vip = await Blessing.isVip(UID)

  const UserData = await Users.read(UID)

  // 灵根名
  let size = '未知'
  let name = '未知'

  // 显示
  if (UserData?.talent_show == 1) {
    size = `+${Math.trunc(UserData.talent_size)}%`
    name = await Talent.getTalentName(UserData.talent)
  }

  // 固定数据读取
  const userLevelData: DB.UserLevelType[] = (await DB.user_level.findAll({
    where: {
      uid: UID,
      type: [1, 2, 3]
    },
    order: [['type', 'DESC']],
    raw: true
  })) as any

  // 境界数据
  const GaspracticeList: DB.LevelsType[] = (await DB.levels.findAll({
    attributes: ['name', 'type', 'exp_needed'],
    where: {
      grade: [userLevelData[2]?.realm],
      type: 1
    },
    raw: true
  })) as any

  // 境界数据
  const BodypracticeList: DB.LevelsType[] = (await DB.levels.findAll({
    attributes: ['name', 'type', 'exp_needed'],
    where: {
      grade: userLevelData[1]?.realm,
      type: 2
    },
    raw: true
  })) as any
  // 境界数据
  const SoulList: DB.LevelsType[] = (await DB.levels.findAll({
    attributes: ['name', 'type', 'exp_needed'],
    where: {
      grade: userLevelData[0]?.realm,
      type: 3
    },
    raw: true
  })) as any

  /**
   * 境界数据要关联起来
   */

  // 固定数据读取
  const GaspracticeData = GaspracticeList[0],
    BodypracticeData = BodypracticeList[0],
    SoulData = SoulList[0]

  const skills = (await DB.user_skills.findAll({
    where: {
      uid: UID
    },
    include: {
      model: DB.goods
    },
    raw: true
  })) as any
  const equipment = (await DB.user_equipment.findAll({
    where: {
      uid: UID
    },
    include: {
      model: DB.goods
    },
    raw: true
  })) as any

  let avatar = user_avatar == '' ? UserData.avatar : user_avatar
  if (UserData.phone) {
    avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UserData.phone}`
  }

  return {
    vip,
    UID: UID,
    avatar: avatar,
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
        Name: GaspracticeData.name,
        Experience: userLevelData[2]?.experience,
        ExperienceLimit: GaspracticeData.exp_needed
      },
      bodypractice: {
        Name: BodypracticeData.name,
        Experience: userLevelData[1]?.experience,
        ExperienceLimit: BodypracticeData.exp_needed
      },
      soul: {
        Name: SoulData.name,
        Experience: userLevelData[0]?.experience,
        ExperienceLimit: SoulData.exp_needed
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
 * @param user_avatar
 * @returns
 */
export async function equipmentInformation(UID: string, user_avatar: string) {
  // 得到用户数据
  const UserData = await Users.read(UID)
  const equipment = (await DB.user_equipment.findAll({
    where: {
      uid: UID
    },
    include: {
      model: DB.goods
    },
    raw: true
  })) as any

  const fdata: DB.UserFateType = (await DB.user_fate.findOne({
    where: {
      uid: UID
    },
    include: {
      model: DB.goods
    },
    raw: true
  })) as any

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
      attack: Equipment.valculateNumerical(fdata['good.attack'], fdata.grade),
      defense: Equipment.valculateNumerical(fdata['good.defense'], fdata.grade),
      blood: Equipment.valculateNumerical(fdata['good.blood'], fdata.grade),
      critical_hit: Equipment.valculateNumerical(
        fdata['good.critical_hit'],
        fdata.grade
      ),
      critical_damage: Equipment.valculateNumerical(
        fdata['good.critical_damage'],
        fdata.grade
      ),
      speed: Equipment.valculateNumerical(fdata['good.speed'], fdata.grade)
    })
  }
  let avatar = user_avatar == '' ? UserData.avatar : user_avatar
  if (UserData.phone) {
    avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UserData.phone}`
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
    avatar: avatar
  }
}

export type EquipmentInformationType =
  ReturnType<typeof equipmentInformation> extends Promise<infer T> ? T : never

/**
 * 功法信息
 * @param UID
 * @param user_avatar
 * @returns
 */
export async function skillInformation(UID: string, user_avatar: string) {
  // 得到用户数据
  const UserData = await Users.read(UID)
  // 用户类型
  const vip = await Blessing.isVip(UID)
  // 灵根名
  let size = '未知'
  let name = '未知'
  if (UserData.talent_show == 1) {
    size = `+${Math.trunc(UserData.talent_size)}%`
    name = await Talent.getTalentName(UserData.talent)
  }
  const skills = (await DB.user_skills.findAll({
    where: {
      uid: UID
    },
    include: {
      model: DB.goods
    },
    raw: true
  })) as any

  let avatar = user_avatar == '' ? UserData.avatar : user_avatar
  if (UserData.phone) {
    avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UserData.phone}`
  }

  return {
    vip,
    UID,
    skills: skills,
    name: UserData.name,
    linggenName: name,
    talentsize: size,
    avatar: avatar
  }
}

export type KkillInformationType =
  ReturnType<typeof skillInformation> extends Promise<infer T> ? T : never

/**
 * 储物袋
 * @param UID
 * @param user_avatar
 * @param type
 * @returns
 */
export async function backpackInformation(
  UID: string,
  user_avatar: string,
  type: number | number[]
) {
  // 得到用户数据
  const UserData = await Users.read(UID)
  const length = await Bag.getLength(UID)

  const bag: DB.UserBagType[] = (await DB.user_bag.findAll({
    where: {
      uid: UID
    },
    include: {
      model: DB.goods,
      where: {
        type: type
      }
    },
    raw: true
  })) as any

  let avatar = user_avatar == '' ? UserData.avatar : user_avatar
  if (UserData.phone) {
    avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UserData.phone}`
  }

  return {
    UID,
    name: UserData.name,
    bag_grade: UserData.bag_grade,
    length: length,
    bag: bag,
    avatar: avatar
  }
}

export type BackpackInformationType =
  ReturnType<typeof backpackInformation> extends Promise<infer T> ? T : never

/**
 * 呐戒
 * @param UID
 * @param user_avatar
 * @returns
 */
export async function ringInformation(UID: string, user_avatar: string) {
  const UserData = await Users.read(UID)

  const length = await Ring.getLength(UID)

  const bag: DB.UserRingType[] = (await DB.user_ring.findAll({
    where: {
      uid: UID
    },
    include: {
      model: DB.goods
    },
    raw: true
  })) as any

  let avatar = user_avatar == '' ? UserData.avatar : user_avatar
  if (UserData.phone) {
    avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UserData.phone}`
  }

  return {
    UID,
    name: UserData.name,
    bag_grade: 1,
    length: length,
    bag: bag,
    avatar: avatar
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
  const list: DB.SkyType[] = (await DB.sky.findAll({
    order: [['id', 'ASC']], // 根据 id 升序排序
    limit: 3,
    raw: true
  })) as any
  const T = list.find(item => item.uid == UID)
  const post = async () => {
    const msg: {
      id: number
      UID: string
      name: string
      power: number
      autograph: string
      avatar: string
    }[] = []
    for (const item of list) {
      const data: DB.UserType = (await DB.user.findOne({
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
        },
        raw: true
      })) as any
      if (!data) {
        // 不存在 uid
        DB.sky.destroy({
          where: {
            uid: item.uid
          }
        })
        continue
      }
      msg.push({
        id: item.id,
        UID: item.uid,
        name: data.name,
        power: data.battle_power,
        autograph: data.autograph,
        avatar: data.avatar
      })
    }
    console.log('msg', msg)
    return msg
  }
  if (T) {
    return await post()
  }
  const data: DB.SkyType = (await DB.sky.findOne({
    where: {
      uid: UID
    },
    raw: true
  })) as any
  const data_S: DB.SkyType = (await DB.sky.findOne({
    where: {
      id: data.id - 1
    },
    raw: true
  })) as any
  if (data_S?.uid !== data.uid) {
    list.push(data_S)
  }
  list.push(data)
  // 发送
  return await post()
}

export type ShowSkyType =
  ReturnType<typeof showSky> extends Promise<infer T> ? T : never
