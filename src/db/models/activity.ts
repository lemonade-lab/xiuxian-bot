import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const activity = <ModelStatic<Model<ActivityType>>>sequelize.define(
  'activity',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING, // string
    start_time: DataTypes.INTEGER, //int
    end_time: DataTypes.INTEGER,
    gaspractice: DataTypes.INTEGER, //int
    bodypractice: DataTypes.INTEGER, //int
    soul: DataTypes.INTEGER, //int
    doc: DataTypes.STRING //
  },
  TableConfig
)
export interface ActivityType {
  // 定义模型属性
  id: number
  name: string // string
  start_time: number //int
  end_time: number
  gaspractice: number
  bodypractice: number
  soul: number
  doc: string //
}
