import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'

export const monster = sequelize.define<Model<MonsterTyoe>>(
  'monster',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    type: DataTypes.INTEGER, //int
    grade: DataTypes.INTEGER, //int
    name: DataTypes.STRING, //string
    doc: DataTypes.STRING
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)

export interface MonsterTyoe {
  id: number
  type: number //int
  grade: number //int
  name: string //string
  doc: string
}
