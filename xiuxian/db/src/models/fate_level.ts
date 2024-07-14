import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'

export const fate_level = sequelize.define<
  Model<{
    id: number
    grade: number //int
    exp_bodypractice: number //int
    exp_gaspractice: number //int
    exp_soul: number //int
    doc: string //string
  }>
>(
  'fate_level',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    grade: DataTypes.INTEGER, //int
    exp_bodypractice: DataTypes.INTEGER, //int
    exp_gaspractice: DataTypes.INTEGER, //int
    exp_soul: DataTypes.INTEGER, //int
    doc: DataTypes.STRING //string
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
