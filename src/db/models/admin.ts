import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const admin = <ModelStatic<Model<AdminType>>>sequelize.define(
  'admin',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    type: DataTypes.INTEGER, //int
    grade: DataTypes.INTEGER,
    account: DataTypes.STRING, // string
    password: DataTypes.STRING,
    doc: DataTypes.STRING //
  },
  TableConfig
)
export interface AdminType {
  // 定义模型属性
  id: number
  type: number //int
  grade: number
  account: string // string
  password: string
  doc: string //
}
