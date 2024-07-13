import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_log = <ModelStatic<Model<UserLogType>>>sequelize.define(
  'user_log',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    type: DataTypes.INET,
    create_time: DataTypes.BIGINT,
    message: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)
export interface UserLogType {
  id: number
  uid: string
  type: number
  create_time: number
  message: string
  doc: string
}
