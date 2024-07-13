import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const user_skills = <ModelStatic<Model<UserSkillsType>>>sequelize.define(
  'user_skills',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING, // 编号
    name: DataTypes.STRING, // 功法名
    doc: DataTypes.STRING // 说明
  },
  TableConfig
)
export interface UserSkillsType {
  id: number
  uid: string // 编号
  name: string // 功法名
  doc: string // 说明
}
