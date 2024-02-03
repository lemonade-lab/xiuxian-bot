import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const ass = <ModelStatic<Model<AssType>>>sequelize.define(
  'ass',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    create_time: DataTypes.INTEGER,
    name: DataTypes.STRING,
    typing: DataTypes.INTEGER,
    grade: DataTypes.INTEGER,
    bag_grade: DataTypes.INTEGER,
    property: DataTypes.INTEGER,
    fame: DataTypes.INTEGER,
    activation: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)
export interface AssType {
  id: number
  create_time: number
  name: string
  typing: number
  grade: number
  bag_grade: number
  property: number
  fame: number
  activation: number
  doc: string
}
