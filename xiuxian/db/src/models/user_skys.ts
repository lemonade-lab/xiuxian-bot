import { sequelize } from '../connect.js'
import { DataTypes, Model } from 'sequelize'
export const user_skys = sequelize.define<
  Model<{
    // 定义模型属性
    id: number
    uid: string // string
    sid: number //
    time: Date
    createAt: Date
    updateAt: Date
    deleteAt: Date
  }>
>(
  'user_skys',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    uid: DataTypes.STRING, // string
    sid: DataTypes.INTEGER, // string
    time: DataTypes.DATE,
    createAt: DataTypes.DATE,
    updateAt: DataTypes.DATE,
    deleteAt: DataTypes.DATE
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
