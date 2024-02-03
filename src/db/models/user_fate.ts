import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_fate = <ModelStatic<Model<UserFateType>>>sequelize.define(
  'user_fate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING, // 编号
    name: DataTypes.STRING, // 装备名
    grade: DataTypes.INTEGER, // 等级
    doc: DataTypes.STRING // 说明
  },
  TableConfig
)
export interface UserFateType {
  id: number
  uid: string // 编号
  name: string // 装备名
  grade: number // 装备名
  doc: string // 说明
}
