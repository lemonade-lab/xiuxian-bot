import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const skys = <ModelStatic<Model<SkysType>>>sequelize.define(
  'skys',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING, // string
    count: DataTypes.INTEGER,
    ranking: DataTypes.INTEGER,
    createAt: DataTypes.DATE,
    updateAt: DataTypes.DATE,
    deleteAt: DataTypes.DATE
  },
  TableConfig
)
export interface SkysType {
  // 定义模型属性
  id: number
  name: string // string
  count: number //
  ranking: number
  createAt: Date
  updateAt: Date
  deleteAt: Date
}
