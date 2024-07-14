import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'

export const levels = sequelize.define<Model<LevelsType>>(
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

export interface LevelsType {
  id: number
  doc: string //string
}
