import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const sky = <ModelStatic<Model<SkyType>>>sequelize.define(
  'sky',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING, // string
    doc: DataTypes.STRING //
  },
  TableConfig
)
export interface SkyType {
  // 定义模型属性
  id: number
  uid: string // string
  doc: string //
}
