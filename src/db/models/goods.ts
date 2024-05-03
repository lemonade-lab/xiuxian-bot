import { sequelize, TableConfig } from '../mysql/index.js'
import { DataTypes, ModelStatic, Model } from 'sequelize'
export const goods = <ModelStatic<Model<GoodsType>>>sequelize.define(
  'goods',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    type: DataTypes.INTEGER, //int
    monster_type: DataTypes.INTEGER, //int
    name: DataTypes.STRING, //string
    grade: DataTypes.INTEGER, //int   // 等级
    addition: DataTypes.STRING, // 属于
    talent: DataTypes.JSON, // json  // shouw?
    attack: DataTypes.INTEGER, //* 1  // acount *
    defense: DataTypes.INTEGER, //* 1
    blood: DataTypes.INTEGER, //* 1
    boolere_covery: DataTypes.INTEGER, //* 1
    critical_hit: DataTypes.INTEGER, //* 1
    critical_damage: DataTypes.INTEGER, //* 1
    exp_bodypractice: DataTypes.INTEGER, //** */
    exp_gaspractice: DataTypes.INTEGER, //** */
    exp_soul: DataTypes.INTEGER, //** */
    speed: DataTypes.INTEGER, //* 1
    size: DataTypes.INTEGER, //* 1
    price: DataTypes.INTEGER, //* 1
    drops: DataTypes.INTEGER, // 怪物掉落
    wheeldisc: DataTypes.INTEGER, // 命运转盘
    alliancemall: DataTypes.INTEGER, //  联盟商城
    commodities: DataTypes.INTEGER, // 万宝楼
    palace: DataTypes.INTEGER, // 浩瀚宫调
    limit: DataTypes.INTEGER, // 限定
    limit_buy: DataTypes.INTEGER, // 限定
    doc: DataTypes.STRING
  },
  TableConfig
)
export interface GoodsType {
  // 定义模型属性
  id: number
  type: number //int
  monster_type: number //int
  grade: number //int
  name: string //string
  addition: string
  talent: number[] // json
  attack: number
  defense: number
  blood: number
  boolere_covery: number
  critical_hit: number
  critical_damage: number
  exp_bodypractice: number
  exp_gaspractice: number
  exp_soul: number
  speed: number
  size: number
  price: number
  drops: number // 怪物掉落
  wheeldisc: number // 命运转盘
  alliancemall: number //  联盟商城
  commodities: number // 万宝楼
  palace: number // 浩瀚宫调
  limit: number // 浩瀚宫调限定
  limit_buy: number // 购买上限
  doc: string
}
