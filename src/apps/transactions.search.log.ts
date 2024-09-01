import { Messages } from 'alemonjs'
import { operationLock } from 'xiuxian-core'
import { transactions_logs } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)测试$/, async e => {
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  // const UID = e.user_id
  // const query = ctx.request.query as {
  //     name: string
  //     page: string
  //     pageSize: string
  // }
  // const obj = {
  //     uid: UID
  // }
  // if (typeof query.name == 'string') {
  //     try {
  //         obj['name'] = JSON.parse(query.name)
  //     } catch {
  //         e.reply('非法请求')
  //         return
  //     }
  // }
  // const error = () => {
  //     e.reply('数据错误')
  // }
  // // 添加分页参数
  // const page = parseInt(query.page) || 1 // 当前页数，默认为1
  // const pageSize = parseInt(query.pageSize) || 10 // 每页数据数量，默认为10
  // const offset = (page - 1) * pageSize // 计算偏移量
  // await transactions_logs
  //     .findAndCountAll({
  //         where: obj,
  //         limit: pageSize,
  //         offset: offset
  //     })
  //     .then(res => {
  //         const totalCount = res.count // 总数据量
  //         const totalPages = Math.ceil(totalCount / pageSize) // 总页数
  //         console.log(" res.rows", res.rows)
  //         // e.reply(ctx.body)
  //     })
  //     .catch(error)
})
