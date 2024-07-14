import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'
export const user_compensate = sequelize.define<Model<UserCompensateType>>(
  'user_compensate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    uid: DataTypes.STRING, // 编号
    time: DataTypes.STRING,
    doc: DataTypes.STRING // 说明
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
export interface UserCompensateType {
  id: number
  uid: string // 编号
  time: string
  doc: string // 说明
}
