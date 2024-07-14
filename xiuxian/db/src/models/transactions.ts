import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'

export const transactions = sequelize.define<
  Model<{
    id: number
    uid: string //string
    name: string //string
    count: number
    price: number
    createAt: Date
    updateAt: Date
    deleteAt: Date
  }>
>(
  'transactions',
  {
    id: {
      type: DataTypes.INTEGER, // integer
      primaryKey: true,
      unique: true
    },
    uid: DataTypes.STRING, //string
    name: DataTypes.STRING, //string
    count: DataTypes.INTEGER,
    price: DataTypes.INTEGER, // integer
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
