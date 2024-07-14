import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'

export const ass_bag = sequelize.define<Model<AssBagType>>(
  'ass_bag',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    aid: {
      type: DataTypes.INTEGER
    }, // 编号
    tid: DataTypes.INET, // 物品编号
    type: DataTypes.INET, // 物品类型
    name: DataTypes.STRING, // 物品名
    acount: DataTypes.INTEGER, // 数量
    doc: DataTypes.STRING // 说明
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
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
