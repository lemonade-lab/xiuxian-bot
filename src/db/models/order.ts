import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const order = <ModelStatic<Model<OrderType>>>sequelize.define(
  'order',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    out_trade_no: DataTypes.STRING, //int
    plan_title: DataTypes.STRING,
    user_private_id: DataTypes.STRING, // json
    user_id: DataTypes.STRING,
    plan_id: DataTypes.STRING,
    title: DataTypes.STRING,
    month: DataTypes.INTEGER,
    total_amount: DataTypes.STRING,
    show_amount: DataTypes.STRING,
    status: DataTypes.INTEGER,
    remark: DataTypes.STRING,
    redeem_id: DataTypes.STRING,
    product_type: DataTypes.INTEGER,
    discount: DataTypes.STRING,
    sku_detail: DataTypes.JSON,
    address_phone: DataTypes.STRING,
    address_address: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

export interface OrderType {
  // 定义模型属性
  id: number
  out_trade_no: string //int
  plan_title: string
  user_private_id: string
  user_id: string
  plan_id: string
  title: string
  month: number
  total_amount: string
  show_amount: string
  status: number
  remark: string
  redeem_id: string
  product_type: number
  discount: string
  sku_detail: any
  address_phone: string
  address_address: string
  doc: string
}
