import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
const TableName = 'map_position'
const TableBase = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING, //string
  type: DataTypes.INTEGER, //int
  grade: DataTypes.INTEGER, //int
  attribute: DataTypes.INTEGER, //int
  x1: DataTypes.INTEGER, //int
  x2: DataTypes.INTEGER, //int
  y1: DataTypes.INTEGER, //int
  y2: DataTypes.INTEGER, //int
  z1: DataTypes.INTEGER, //int
  z2: DataTypes.INTEGER, //int
  doc: DataTypes.STRING //string
}
export const map_position = <ModelStatic<Model<MapPositionType>>>(
  sequelize.define(TableName, TableBase, TableConfig)
)
export interface MapPositionType {
  id: number
  name: string //string
  type: number //int
  grade: number //int
  attribute: number //int
  x1: number //int
  x2: number //int
  y1: number //int
  y2: number //int
  z1: number //int
  z2: number //int
  doc: string //string
}
