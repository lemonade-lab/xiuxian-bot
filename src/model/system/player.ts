import {
  map_point,
  user_bag,
  user_equipment,
  user_skills,
  user_level,
  levels,
  user,
  user_log,
  user_fate,
  user_ring,
  type MapPointType,
  type LevelsType,
  type UserLevelType,
  type UserType
} from '../../db/index.js'
import * as Method from '../wrap/method.js'
import * as Talent from '../users/base/talent.js'

/**
 * 设置玩家
 * @param UID
 * @param user_avatar
 * @returns
 */
export async function setPlayer(UID: string, user_avatar: string) {
  return levels
    .findAll({
      attributes: ['blood'],
      where: {
        grade: 0,
        type: [1, 2]
      },
      order: [['type', 'DESC']],
      raw: true
    })
    .then(async (res: any) => {
      const levelist: LevelsType[] = res
      if (!levelist || levelist.length == 0) return false
      const [gaspractice, bodypractice] = levelist
      return map_point
        .findOne({
          where: {
            name: '天山'
          },
          raw: true
        })
        .then(async (res: any) => {
          const point: MapPointType = res
          if (!point || !point?.type) return false
          return Promise.all([
            // 创建基础信息
            user.create({
              uid: UID,
              name: Method.Anyarray([
                '甲',
                '乙',
                '丙',
                '丁',
                '戊',
                '己',
                '庚',
                '辛',
                '壬',
                '癸'
              ]), // 道号
              avatar: user_avatar, // 头像地址
              state: 0, // 用户状态_默认0
              state_start_time: 9999999999, // 状态开始时间
              state_end_time: 9999999999, // 状态结束时间
              age: 1, // 寿龄_默认1
              theme: 'dark', // 主题
              age_limit: 100, // 最高寿龄_默认100
              point_type: point.type, // 地点类型_默认0
              pont_attribute: point.attribute, // 地点属性_默认0
              pont_x: point.x, // 地点x轴_默认0
              pont_y: point.y, // 地点y轴_默认0
              pont_z: point.z, // 地点z轴_默认0
              battle_blood_now: gaspractice.blood + bodypractice.blood, // 当前血量_默认0
              battle_blood_limit: gaspractice.blood + bodypractice.blood, // 血量上限_默认0
              // 计算战力
              battle_attack: 0, // 攻击_默认0
              battle_defense: 0, // 防御_默认0
              battle_speed: 0, // 敏捷_默认0
              battle_power: 0, // 战力_默认0
              talent: Talent.getTalent(), // 灵根
              create_time: new Date().getTime() // 创建时间搓
            } as UserType),
            // 创建境界信息1
            user_level.create({
              uid: UID,
              type: 1,
              addition: 0,
              realm: 0,
              experience: 0
            } as UserLevelType),
            // 创建境界信息2
            user_level.create({
              uid: UID,
              type: 2,
              addition: 0,
              realm: 0,
              experience: 0
            } as UserLevelType),
            user_level.create({
              uid: UID,
              type: 3,
              addition: 0,
              realm: 0,
              experience: 0
            } as UserLevelType)
          ])
        })
    })
}

/**
 * 删除重建
 * @param UID
 * @param user_avatar
 * @returns
 */
export async function updatePlayer(UID: string, user_avatar: string) {
  return Promise.all([
    // 删除用户
    user.destroy({
      where: {
        uid: UID
      }
    }),
    // 删除境界
    user_level.destroy({
      where: {
        uid: UID
      }
    }),
    // 删除装备
    user_equipment.destroy({
      where: {
        uid: UID
      }
    }),
    // 删除功法
    user_skills.destroy({
      where: {
        uid: UID
      }
    }),
    // 删除背包
    user_bag.destroy({
      where: {
        uid: UID
      }
    }),
    // 删除记录
    user_log.destroy({
      where: {
        uid: UID
      }
    }),
    // 删除本命
    user_fate.destroy({
      where: {
        uid: UID
      }
    }),
    // 删除戒指
    user_ring.destroy({
      where: {
        uid: UID
      }
    })
    // 成功了就执行并返回该结果
  ]).then(() => setPlayer(UID, user_avatar))
}
