import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'

export const talent = sequelize.define<Model<TalentType>>(
  'talent',
  {
    id: {
      type: DataTypes.INTEGER, // integer
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING, //string
    doc: DataTypes.STRING //string
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
export interface TalentType {
  id: number
  name: string //string
  doc: string //string
}
