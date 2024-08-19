import { sequelize } from '../connect.js'
import { DataTypes, Model } from 'sequelize'

export const levels = sequelize.define<
  Model<{
    id: number
    doc: string //string
  }>
>(
  'bags',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    // type: DataTypes.INTEGER, //int
    doc: DataTypes.STRING //string
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
