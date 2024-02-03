import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
const TableName = 'fate_level'
const TableBase = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  grade: DataTypes.INTEGER, //int
  exp_bodypractice: DataTypes.INTEGER, //int
  exp_gaspractice: DataTypes.INTEGER, //int
  exp_soul: DataTypes.INTEGER, //int
  doc: DataTypes.STRING //string
}
export const fate_level = <ModelStatic<Model<fateLevelType>>>(
  sequelize.define(TableName, TableBase, TableConfig)
)
export interface fateLevelType {
  id: number
  grade: number //int
  exp_bodypractice: number //int
  exp_gaspractice: number //int
  exp_soul: number //int
  doc: string //string
}
