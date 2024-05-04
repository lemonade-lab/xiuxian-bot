import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const levels = <ModelStatic<Model<LevelsType>>>sequelize.define(
  'bags',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    type: DataTypes.INTEGER, //int
    doc: DataTypes.STRING //string
  },
  TableConfig
)
export interface LevelsType {
  id: number
  doc: string //string
}
