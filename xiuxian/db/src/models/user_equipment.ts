import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'
export const user_equipment = sequelize.define<Model<UserEquipmentType>>(
  'user_equipment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    uid: DataTypes.STRING, // 编号
    name: DataTypes.STRING, // 装备名
    doc: DataTypes.STRING // 说明
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
export interface UserEquipmentType {
  id: number
  uid: string // 编号
  name: string // 装备名
  doc: string // 说明
}
