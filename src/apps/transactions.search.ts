import { Messages } from 'alemonjs'
import { Op } from 'sequelize'
import { operationLock } from 'xiuxian-core'
import { transactions } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)测试$/, async e => {
  // const T = await operationLock(e.user_id)
  // if (!T) {
  //     e.reply('操作频繁')
  //     return
  // }
  // const query = ctx.request.query as {
  //     name: string
  //     page: string
  //     pageSize: string
  // }
  // const obj = {}
  // if (typeof query.name == 'string') {
  //     try {
  //         obj['name'] = JSON.parse(query.name)
  //     } catch {
  //         e.reply('非法请求')
  //         return
  //     }
  // }
  // //
  // const error = () => {
  //     e.reply('数据错误')
  // }
  // // 添加分页参数
  // const page = parseInt(query.page) || 1 // 当前页数，默认为1
  // const pageSize = parseInt(query.pageSize) || 10 // 每页数据数量，默认为10
  // const offset = (page - 1) * pageSize // 计算偏移量
  // // 尝试过滤过期物品
  // try {
  //     // 计算过期时间（当前时间减去 3 h）
  //     const expirationTime = new Date()
  //     expirationTime.setDate(expirationTime.getDay() - 3)
  //     // 查询已过期的数据
  //     const expiredData = await transactions.findAll({
  //         where: {
  //             createAt: {
  //                 [Op.lt]: expirationTime // 小于过期时间的数据
  //             }
  //         }
  //     })
  //     // 删除已过期的数据
  //     for (const data of expiredData) {
  //         await data.destroy()
  //     }
  //     console.log(`已删除 ${expiredData.length} 条过期数据`)
  // } catch (error) {
  //     console.error('删除过期数据时出错：', error)
  // }
  // await transactions
  //     .findAll({
  //         where: obj,
  //         limit: pageSize,
  //         offset: offset
  //     })
  //     .then(res => res.map(item => item.dataValues))
  //     .then(res => {
  //         console.log(res)
  //         e.reply('请求完成')
  //     })
  //     .catch(error)
  // //
})
