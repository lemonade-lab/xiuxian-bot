import koaRouter from 'koa-router'
import { ERROE_CODE, OK_CODE } from '../../config/ajax'
import { UserBagType, user_bag } from '../../../src/db'
const router = new koaRouter({ prefix: '/api/v1/status' })

// 背包查询接口
router.get('/search', async ctx => {
  const UID = ctx.state.user.uid
  const query = ctx.request.query as {
    page: string
    pageSize: string
  }
  const obj = {
    uid: UID
  }
  const error = () => {
    ctx.body = {
      code: ERROE_CODE,
      msg: '数据错误',
      data: null
    }
  }
  // 添加分页参数
  const page = parseInt(query.page) || 1 // 当前页数，默认为1
  const pageSize = parseInt(query.pageSize) || 10 // 每页数据数量，默认为10
  const offset = (page - 1) * pageSize // 计算偏移量
  await user_bag
    .findAndCountAll({
      where: obj,
      limit: pageSize,
      offset: offset,
      raw: true
    })
    .then((res: any) => res)
    .then((res: { count: number; rows: UserBagType[] }) => {
      const totalCount = res.count // 总数据量
      const totalPages = Math.ceil(totalCount / pageSize) // 总页数
      ctx.body = {
        code: OK_CODE,
        msg: '请求完成',
        data: {
          items: res.rows, // 当前页的数据
          page: page,
          pageSize: pageSize,
          totalCount: totalCount,
          totalPages: totalPages
        }
      }
    })
    .catch(error)
  return
})

export default router
