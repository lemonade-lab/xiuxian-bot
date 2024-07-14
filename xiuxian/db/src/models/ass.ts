import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'

export const ass = sequelize.define<
  Model<{
    id: number
    create_time: number
    name: string
    typing: number
    grade: number
    bag_grade: number
    property: number
    fame: number
    activation: number
    doc: string
  }>
>(
  'ass',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    create_time: DataTypes.INTEGER,
    name: DataTypes.STRING,
    typing: DataTypes.INTEGER,
    grade: DataTypes.INTEGER,
    bag_grade: DataTypes.INTEGER,
    property: DataTypes.INTEGER,
    fame: DataTypes.INTEGER,
    activation: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
