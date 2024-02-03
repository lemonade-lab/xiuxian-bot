import { Sequelize } from 'sequelize'
export const sequelize = new Sequelize(
  process.env?.ALEMONJS_MYSQL_DATABASE ?? 'xiuxian',
  process.env?.ALEMONJS_MYSQL_USER ?? 'root',
  process.env?.ALEMONJS_MYSQL_PASSWORD ?? '',
  {
    host: process.env?.ALEMONJS_MYSQL_HOST ?? 'localhost',
    port: Number(process.env?.ALEMONJS_MYSQL_PROT ?? 3306),
    dialect: 'mysql',
    logging: false // 禁用日志记录
  }
)
export const TableConfig = {
  freezeTableName: true, //不增加复数表名
  createdAt: false, //去掉
  updatedAt: false //去掉
}
export { Op, literal } from 'sequelize'
