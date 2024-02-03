import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const ass_bag = <ModelStatic<Model<AssBagType>>>sequelize.define(
  'ass_bag',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    aid: DataTypes.INTEGER, // 编号
    tid: DataTypes.INET, // 物品编号
    type: DataTypes.INET, // 物品类型
    name: DataTypes.STRING, // 物品名
    acount: DataTypes.INTEGER, // 数量
    doc: DataTypes.STRING // 说明
  },
  TableConfig
)
export interface AssBagType {
  id: number
  aid: number // 编号
  tid: number // 物品编号
  type: number // 物品类型
  name: string // 物品名
  acount: number // 数量
  doc: number // 说明
}
