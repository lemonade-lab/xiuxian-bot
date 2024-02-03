import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
const TableName = 'talent'
const TableBase = {
  id: {
    type: DataTypes.INTEGER, // integer
    primaryKey: true
  },
  name: DataTypes.STRING, //string
  doc: DataTypes.STRING //string
}
export const talent = <ModelStatic<Model<TalentType>>>(
  sequelize.define(TableName, TableBase, TableConfig)
)
export interface TalentType {
  id: number
  name: string //string
  doc: string //string
}
