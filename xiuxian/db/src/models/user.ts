import { sequelize } from '../connect.js'
import { DataTypes, Model, ModelCtor } from 'sequelize'
// 定义User属性接口

export const user = sequelize.define<
  Model<{
    id: number
    uid: string
    password: string
    name: string
    avatar: string
    autograph: string
    phone: number
    state: number
    state_start_time: number
    state_end_time: number
    theme: 'dark' | 'red' | 'blue' | 'purple'
    email: string
    age: number
    age_limit: number
    age_state: number
    point_type: number
    pont_attribute: number
    pont_x: number
    pont_y: number
    pont_z: number
    battle_show: number
    battle_blood_now: number
    battle_blood_limit: number
    battle_attack: number
    battle_defense: number
    battle_speed: number
    battle_power: number
    battle_critical_hit: number
    battle_critical_damage: number
    special_reputation: number
    special_prestige: number
    special_spiritual: number
    special_spiritual_limit: number
    special_virtues: number
    talent: number[]
    talent_size: number
    talent_show: number
    bag_grade: number
    sign_day: number
    sign_math: number
    sign_size: number
    sign_time: number
    newcomer_gift: number
    update_time: string
    create_time: number
    delete: number
    man_size: number
    dong_size: number
    dong_minit: number
    sign_in_count: number
    sign_in_month_count: number
    sign_in_time: Date
    doc: string
  }>
>(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    uid: DataTypes.STRING, //编号
    password: DataTypes.STRING, // 密码_默认123456
    name: DataTypes.STRING, // 道号
    avatar: DataTypes.STRING, // 头像地址
    autograph: DataTypes.STRING, // 道宣
    phone: DataTypes.INET, // 手机号

    state: DataTypes.INET, // 用户状态_默认0
    state_start_time: DataTypes.INTEGER, // 状态开始时间
    state_end_time: DataTypes.INTEGER, // 状态结束时间

    theme: DataTypes.STRING, //主题

    email: DataTypes.STRING, //

    age: DataTypes.INTEGER, // 寿龄_默认1
    age_limit: DataTypes.INTEGER, // 最高寿龄_默认100
    age_state: DataTypes.INTEGER, // 是否死亡_默认1

    point_type: DataTypes.INTEGER, // 地点类型_默认0
    pont_attribute: DataTypes.INTEGER, // 地点属性_默认0
    pont_x: DataTypes.INTEGER, // 地点x轴_默认0
    pont_y: DataTypes.INTEGER, // 地点y轴_默认0
    pont_z: DataTypes.INTEGER, // 地点z轴_默认0

    battle_show: DataTypes.INTEGER, // 是否显示战斗过程_默认为0
    battle_blood_now: DataTypes.INTEGER, // 当前血量_默认0
    battle_blood_limit: DataTypes.INTEGER, // 血量上限_默认0
    battle_attack: DataTypes.INTEGER, // 攻击_默认0
    battle_defense: DataTypes.INTEGER, // 防御_默认0
    battle_speed: DataTypes.INTEGER, // 敏捷_默认0
    battle_power: DataTypes.INTEGER, // 战力_默认0
    battle_critical_hit: DataTypes.INTEGER, // 暴击率_默认0
    battle_critical_damage: DataTypes.INTEGER, // 暴击伤害_默认50

    special_reputation: DataTypes.INTEGER, // 声望_默认0
    special_prestige: DataTypes.INTEGER, // 煞气_默认50
    special_spiritual: DataTypes.INTEGER, // 灵力_默认100
    special_spiritual_limit: DataTypes.INTEGER, // 灵力上限_默认100
    special_virtues: DataTypes.INTEGER, // 功德_默认0

    talent: DataTypes.JSON, // 灵根
    talent_size: DataTypes.INTEGER, // 天赋_默认0
    talent_show: DataTypes.INTEGER, // 是否显示天赋_默认0

    bag_grade: DataTypes.INET, // 背包等级_默认1

    sign_day: DataTypes.INTEGER, // 签到天数_默认0
    sign_math: DataTypes.INTEGER, // 签到月数_默认1
    sign_size: DataTypes.INTEGER, // 0
    sign_time: DataTypes.INTEGER, // 签到时间_默认0

    newcomer_gift: DataTypes.INTEGER, // 新人礼物_默认0

    update_time: DataTypes.DATEONLY, // 刷新时间
    create_time: DataTypes.INTEGER, // 创建时间搓

    delete: DataTypes.INTEGER,

    sign_in_count: DataTypes.INTEGER,
    sign_in_month_count: DataTypes.INTEGER,
    sign_in_time: DataTypes.DATE,

    man_size: DataTypes.INTEGER,
    dong_size: DataTypes.INTEGER,
    dong_minit: DataTypes.INTEGER,
    doc: DataTypes.STRING // 说明
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
