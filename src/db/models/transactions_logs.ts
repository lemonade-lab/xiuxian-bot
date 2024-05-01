import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export interface TransactionsLogsType {
  id: number
  uid: string //string
  name: string //string
  count: number
  price: number
  createAt: Date
  updateAt: Date
  deleteAt: Date
}
export const transactions_logs = <ModelStatic<Model<TransactionsLogsType>>>(
  sequelize.define(
    'transactions_logs',
    {
      id: {
        type: DataTypes.INTEGER, // integer
        primaryKey: true
      },
      uid: DataTypes.STRING, //string
      name: DataTypes.STRING, //string
      count: DataTypes.INTEGER,
      price: DataTypes.INTEGER, // integer
      createAt: DataTypes.DATE,
      updateAt: DataTypes.DATE,
      deleteAt: DataTypes.DATE
    },
    TableConfig
  )
)
