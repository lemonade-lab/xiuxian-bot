import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const monster = <ModelStatic<Model<MonsterTyoe>>>sequelize.define(
  'monster',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    type: DataTypes.INTEGER, //int
    grade: DataTypes.INTEGER, //int
    name: DataTypes.STRING, //string
    doc: DataTypes.STRING
  },
  TableConfig
)

export interface MonsterTyoe {
  id: number
  type: number //int
  grade: number //int
  name: string //string
  doc: string
}
