import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const map_treasure = <ModelStatic<Model<MapTreasureType>>>(
  sequelize.define(
    'map_treasure',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: DataTypes.STRING, //string
      type: DataTypes.INTEGER, //int
      acount: DataTypes.INTEGER, //int
      attribute: DataTypes.INTEGER, //int
      x: DataTypes.INTEGER, //int
      y: DataTypes.INTEGER, //int
      z: DataTypes.INTEGER, //int
      doc: DataTypes.STRING //string
    },
    TableConfig
  )
)
export interface MapTreasureType {
  id: number
  name: string //string
  type: number //int
  acount: number //int
  attribute: number //int
  x: number //int
  y: number //int
  z: number //int
  doc: string //string
}
