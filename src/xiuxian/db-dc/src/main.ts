import { user_bag } from './models/user_bag.js'
import { goods } from './models/goods.js'
import { user_skills } from './models/user_skills.js'
import { user_equipment } from './models/user_equipment.js'
import { user_fate } from './models/user_fate.js'
import { user_ring } from './models/user_ring.js'
import { user_ass } from './models/user_ass.js'
import { ass } from './models/ass.js'
import { ass_typing } from './models/ass_typing.js'
import { ass_bag } from './models/ass_bag.js'
import { user } from './models/user.js'
import { transactions } from './models/transactions.js'
import { transactions_logs } from './models/transactions_logs.js'
import { user_buy_log } from './models/user_buy_log.js'
import { sequelize } from './connect.js'

const belongsTo = () => {
  /**
   * user_ring
   */
  user_ring.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  /**
   * user_bag
   */
  user_bag.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  /**
   * user_skills
   */
  user_skills.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  /**
   * user_equipment
   */
  user_equipment.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  /**
   * user_fate
   */
  user_fate.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  /**
   *
   */
  user_ass.belongsTo(ass, { foreignKey: 'aid', targetKey: 'id' })
  user_ass.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
  /**
   * ass
   */
  ass.belongsTo(ass_typing, { foreignKey: 'typing', targetKey: 'id' })
  /**
   * ass_bag
   */
  ass_bag.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  /**
   * transactions
   */
  transactions.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  transactions.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
  /**
   * transactions_logs
   */
  transactions_logs.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  transactions_logs.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
  /**
   * user_buy_log
   */
  user_buy_log.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  user_buy_log.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
}

await sequelize
  .authenticate()
  .then(() => {
    console.log('数据库连接成功.')

    belongsTo()
  })
  .catch(err => {
    console.error(err)
    console.log('数据库连接失败.')
    process.cwd()
  })
