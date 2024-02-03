import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_ass = <ModelStatic<Model<UserAssType>>>sequelize.define(
  'user_ass',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    create_tiime: DataTypes.INTEGER,
    // uid
    uid: DataTypes.STRING,
    // aid
    aid: DataTypes.INTEGER,
    // 贡献点
    contribute: DataTypes.INTEGER,
    // 权限
    authentication: DataTypes.INTEGER,
    // 身份
    identity: DataTypes.STRING,
    // 说明
    doc: DataTypes.STRING
  },
  TableConfig
)

export interface UserAssType {
  id: number
  create_tiime: number
  uid: string
  aid: number
  authentication: number
  contribute: number
  identity: string
  doc: string
}
