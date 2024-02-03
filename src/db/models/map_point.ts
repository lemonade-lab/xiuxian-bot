import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
const TableName = 'map_point'
const TableBase = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING, //string
  type: DataTypes.INTEGER, //int
  grade: DataTypes.INTEGER, //int
  attribute: DataTypes.INTEGER, //int
  x: DataTypes.INTEGER, //int
  y: DataTypes.INTEGER, //int
  z: DataTypes.INTEGER, //int
  doc: DataTypes.STRING //string
}
export const map_point = <ModelStatic<Model<MapPointType>>>(
  sequelize.define(TableName, TableBase, TableConfig)
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
