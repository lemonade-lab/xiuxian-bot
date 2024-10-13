export * from './src/connect.js'
export * from './src/models.js'
import { Model, ModelCtor } from 'sequelize'
import './src/main.js'

/**
 * 获取模型的属性类型
 */
export type AttributesType<T extends ModelCtor<Model>> =
  T extends ModelCtor<infer M>
    ? M extends Model<infer U, any>
      ? U
      : never
    : never
