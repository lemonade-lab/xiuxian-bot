import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_compensate = <ModelStatic<Model<UserCompensateType>>>(
  sequelize.define(
    'user_compensate',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uid: DataTypes.STRING, // 编号
      time: DataTypes.STRING,
      doc: DataTypes.STRING // 说明
    },
    TableConfig
  )
)
export interface UserCompensateType {
  id: number
  uid: string // 编号
  time: string
  doc: string // 说明
}
