import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'
export const user_skills = sequelize.define<
  Model<{
    id: number
    uid: string // 编号
    name: string // 功法名
    doc: string // 说明
  }>
>(
  'user_skills',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    uid: DataTypes.STRING, // 编号
    name: DataTypes.STRING, // 功法名
    doc: DataTypes.STRING // 说明
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
