import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const auction = <ModelStatic<Model<AuctionType>>>sequelize.define(
  'auction',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    state: DataTypes.INTEGER, //int
    start_time: DataTypes.INTEGER,
    party_a: DataTypes.JSON, // json
    party_b: DataTypes.JSON,
    party_all: DataTypes.JSON,
    name: DataTypes.STRING,
    type: DataTypes.INTEGER, //int
    account: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    doc: DataTypes.STRING //
  },
  TableConfig
)
export interface AuctionType {
  // 定义模型属性
  id: number
  state: number //int
  start_time: number
  party_a: {
    id: string
    create_time: number
  }
  party_b: {
    id: string
    create_time: number
  }
  party_all: {
    [key: string]: {
      uid: string
      price: number
    }
  }
  name: string
  type: number
  account: number
  price: number
  doc: string //
}
