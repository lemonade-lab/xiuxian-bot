import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_level = <ModelStatic<Model<UserLevelType>>>sequelize.define(
  'user_level',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING, // 编号
    type: DataTypes.INET, // 境界类型
    career: DataTypes.INET, // 职业类型
    addition: DataTypes.INET, // 突破概率加成
    realm: DataTypes.INTEGER, // 等级
    experience: DataTypes.INTEGER, // 经验
    doc: DataTypes.STRING // 说明
  },
  TableConfig
)
export interface UserLevelType {
  id: number
  uid: string // 编号
  type: number // 境界类型
  career: number // 职业类型
  addition: number // 突破概率加成
  realm: number // 等级
  experience: number // 经验
  doc: string // 说明
}
