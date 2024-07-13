import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_ring = <ModelStatic<Model<UserRingType>>>sequelize.define(
  'user_ring',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING, // 编号
    tid: DataTypes.INET, // 物品编号
    type: DataTypes.INET, // 物品类型
    name: DataTypes.STRING, // 物品名
    acount: DataTypes.INTEGER, // 数量
    doc: DataTypes.STRING // 说明
  },
  TableConfig
)
export interface UserRingType {
  id: number
  uid: string // 编号
  tid: number // 物品编号
  type: number // 物品类型
  name: string // 物品名
  acount: number // 数量
  doc: number // 说明
}
