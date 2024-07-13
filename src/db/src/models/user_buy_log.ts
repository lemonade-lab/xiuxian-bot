import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_buy_log = <ModelStatic<Model<UserBuyLogType>>>(
  sequelize.define(
    'user_buy_log',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uid: DataTypes.STRING,
      name: DataTypes.STRING,
      count: DataTypes.INTEGER,
      buy_time: DataTypes.DATE,
      createAt: DataTypes.DATE,
      updateAt: DataTypes.DATE,
      deleteAt: DataTypes.DATE
    },
    TableConfig
  )
)
export interface UserBuyLogType {
  id: number
  uid: string
  name: string
  count: number
  buy_time: Date
  createAt: Date
  updateAt: Date
  deleteAt: Date
}
