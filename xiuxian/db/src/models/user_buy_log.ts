import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'
export const user_buy_log = sequelize.define<Model<UserBuyLogType>>(
  'user_buy_log',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    uid: DataTypes.STRING,
    name: DataTypes.STRING,
    count: DataTypes.INTEGER,
    buy_time: DataTypes.DATE,
    createAt: DataTypes.DATE,
    updateAt: DataTypes.DATE,
    deleteAt: DataTypes.DATE
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
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
