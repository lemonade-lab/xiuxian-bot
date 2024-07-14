import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'
export const user_ass = sequelize.define<
  Model<{
    id: number
    create_tiime: number
    uid: string
    aid: number
    authentication: number
    contribute: number
    identity: string
    doc: string
  }>
>(
  'user_ass',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    create_tiime: DataTypes.INTEGER,
    // uid
    uid: DataTypes.STRING,
    // aid
    aid: DataTypes.INTEGER,
    // 贡献点
    contribute: DataTypes.INTEGER,
    // 权限
    authentication: DataTypes.INTEGER,
    // 身份
    identity: DataTypes.STRING,
    // 说明
    doc: DataTypes.STRING
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
