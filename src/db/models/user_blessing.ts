import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_blessing = <ModelStatic<Model<UserBlessingType>>>(
  sequelize.define(
    'user_blessing',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uid: DataTypes.STRING, // 编号
      day: DataTypes.INET,
      time: DataTypes.BIGINT,
      record: DataTypes.JSON,
      receive: DataTypes.JSON,
      doc: DataTypes.STRING // 说明
    },
    TableConfig
  )
)
export interface UserBlessingType {
  id: number
  uid: string // 编号
  day: number
  time: number
  record: { day: number; time: string }[]
  receive: {
    [key: string]: boolean
  }
  doc: string // 说明
}
