import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const exchange = <ModelStatic<Model<ExchangeType>>>sequelize.define(
  'exchange',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    state: DataTypes.INTEGER, //int
    party_a: DataTypes.JSON, // json
    party_b: DataTypes.JSON,
    name: DataTypes.STRING,
    type: DataTypes.INTEGER, //int
    account: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    doc: DataTypes.STRING //
  },
  TableConfig
)
export interface ExchangeType {
  // 定义模型属性
  id: number
  state: number //int
  party_a: {
    id: string
    create_time: number
  } // json
  party_b: {
    id: string
    create_time: number
  }
  name: string
  type: number
  account: number
  price: number
  doc: string //
}
