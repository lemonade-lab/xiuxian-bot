import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'

export const map_point = sequelize.define<Model<MapPointType>>(
  'map_point',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING, //string
    type: DataTypes.INTEGER, //int
    grade: DataTypes.INTEGER, //int
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
export interface MapPointType {
  id: number
  name: string //string
  type: number //int
  grade: number //int
  attribute: number //int
  x: number //int
  y: number //int
  z: number //int
  doc: string //string
}
