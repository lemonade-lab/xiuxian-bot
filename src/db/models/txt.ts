import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
const TableName = 'txt'
const TableBase = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING, //string
  doc: DataTypes.STRING //string
}
export const txt = <ModelStatic<Model<TxtType>>>(
  sequelize.define(TableName, TableBase, TableConfig)
)
export interface TxtType {
  id: number
  name: string //string
  doc: string //string
}
