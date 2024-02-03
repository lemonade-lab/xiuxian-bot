import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
const TableName = 'levels'
const TableBase = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  type: DataTypes.INTEGER, //int
  grade: DataTypes.INTEGER, //int
  name: DataTypes.STRING, //string
  attack: DataTypes.INTEGER, //int
  defense: DataTypes.INTEGER, //int
  blood: DataTypes.INTEGER, //int
  critical_hit: DataTypes.INTEGER, //int
  critical_damage: DataTypes.INTEGER, //int
  speed: DataTypes.INTEGER,
  size: DataTypes.INTEGER,
  soul: DataTypes.INTEGER,
  exp_needed: DataTypes.INTEGER, //int
  doc: DataTypes.STRING //string
}
export const levels = <ModelStatic<Model<LevelsType>>>(
  sequelize.define(TableName, TableBase, TableConfig)
)
export interface LevelsType {
  id: number
  type: number //int
  grade: number //int
  name: string //string
  attack: number //int
  defense: number //int
  blood: number //int
  critical_hit: number //int
  critical_damage: number //int
  speed: number
  size: number
  soul: number
  exp_needed: number //int
  doc: string //string
}
