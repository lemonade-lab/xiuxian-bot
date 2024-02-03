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
{
  /**
   * *********
   * 确定关联关系
   * ********
   */
  user_ring.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  user_bag.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  user_skills.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  user_equipment.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  user_fate.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  /**
   * ****
   * ass
   * ****
   */
  user_ass.belongsTo(ass, { foreignKey: 'aid', targetKey: 'id' })
  user_ass.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
  ass.belongsTo(ass_typing, { foreignKey: 'typing', targetKey: 'id' })
  ass_bag.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
}
/**
 * ****
 * 模型入口
 * *****
 */
export * from './models.js'
export * from './mysql/index.js'
