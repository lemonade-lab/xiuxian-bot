import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_skys = <ModelStatic<Model<UserSkysType>>>sequelize.define(
  'user_skys',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING, // string
    sid: DataTypes.INTEGER, // string
    time: DataTypes.DATE,
    createAt: DataTypes.DATE,
    updateAt: DataTypes.DATE,
    deleteAt: DataTypes.DATE
  },
  TableConfig
)
export interface UserSkysType {
  // 定义模型属性
  id: number
  uid: string // string
  sid: number //
  time: Date
  createAt: Date
  updateAt: Date
  deleteAt: Date
}
