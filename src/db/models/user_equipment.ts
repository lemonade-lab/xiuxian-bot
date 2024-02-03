import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_equipment = <ModelStatic<Model<UserEquipmentType>>>(
  sequelize.define(
    'user_equipment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uid: DataTypes.STRING, // 编号
      name: DataTypes.STRING, // 装备名
      doc: DataTypes.STRING // 说明
    },
    TableConfig
  )
)
export interface UserEquipmentType {
  id: number
  uid: string // 编号
  name: string // 装备名
  doc: string // 说明
}
