import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'
export const user_fate = sequelize.define<
  Model<{
    id: number
    uid: string // 编号
    name: string // 装备名
    grade: number // 装备名
    doc: string // 说明
  }>
>(
  'user_fate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    uid: DataTypes.STRING, // 编号
    name: DataTypes.STRING, // 装备名
    grade: DataTypes.INTEGER, // 等级
    doc: DataTypes.STRING // 说明
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
