import { sequelize } from '../mysql/index.js'
import { DataTypes, Model } from 'sequelize'

export const ass_typing = sequelize.define<
  Model<{
    id: number
    master: string
    vice_master: string
    super_admin: string
    admin: string
    core_member: string
    senior_menber: string
    intermediate_member: string
    lowerlevel_member: string
    tagged_member: string
    reviewed_member: string
    doc: string
  }>
>(
  'ass_typing',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    master: DataTypes.STRING,
    vice_master: DataTypes.STRING,
    super_admin: DataTypes.STRING,
    admin: DataTypes.STRING,
    core_member: DataTypes.STRING,
    senior_menber: DataTypes.STRING,
    intermediate_member: DataTypes.STRING,
    lowerlevel_member: DataTypes.STRING,
    tagged_member: DataTypes.STRING,
    reviewed_member: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  {
    freezeTableName: true, //不增加复数表名
    createdAt: false, //去掉
    updatedAt: false //去掉
  }
)
