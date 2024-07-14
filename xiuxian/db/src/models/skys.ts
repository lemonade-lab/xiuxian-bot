import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'
export const skys = sequelize.define<
  Model<{
    // 定义模型属性
    id: number
    name: string // string
    count: number //
    ranking: number
    createAt: Date
    updateAt: Date
    deleteAt: Date
  }>
>(
  'skys',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING, // string
    count: DataTypes.INTEGER,
    ranking: DataTypes.INTEGER,
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
