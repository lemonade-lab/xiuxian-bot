import { Messages } from 'alemonjs'
import { operationLock } from 'xiuxian-core'
import { transactions } from 'xiuxian-db'
/**
 *
 */
export default new Messages().response(/^(#|\/)虚空镜/, async e => {
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  //
  const [xpage, name] = e.msg
    .replace(/^(#|\/)虚空镜/, '')
    .trim()
    .split('*')

  const where: {
    name?: string
  } = {}

  if (name === undefined) {
    where.name = name
  }

  // 添加分页参数
  const page = parseInt(xpage) || 1 // 当前页数，默认为1
  //
  const pageSize = 10 // 每页数据数量，默认为10
  //
  const offset = (page - 1) * pageSize // 计算偏移量

  //
  transactions
    .findAll({
      where: where,
      limit: pageSize,
      offset: offset
    })
    .then(res => res.map(item => item.dataValues))
    .then(res => {
      if (res.length === 0) {
        e.reply('没有找到数据')
        return
      }
      e.reply(
        res
          .map(
            item => `物品名:${item.name},价格:${item.price},数量:${item.count}`
          )
          .join('\n')
      )
    })
    .catch(() => {
      e.reply('数据错误')
    })

  //
})
