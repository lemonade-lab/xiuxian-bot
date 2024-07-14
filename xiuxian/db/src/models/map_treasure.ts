import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'
export const map_treasure = sequelize.define<
  Model<{
    id: number
    name: string //string
    type: number //int
    acount: number //int
    attribute: number //int
    x: number //int
    y: number //int
    z: number //int
    doc: string //string
  }>
>(
  'map_treasure',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING, //string
    type: DataTypes.INTEGER, //int
    acount: DataTypes.INTEGER, //int
    attribute: DataTypes.INTEGER, //int
    x: DataTypes.INTEGER, //int
    y: DataTypes.INTEGER, //int
    z: DataTypes.INTEGER, //int
    doc: DataTypes.STRING //string
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
