import koaRouter from 'koa-router'
import {
  type UserBagType,
  transactions,
  user_bag,
  TransactionsType,
  TransactionsLogsType,
  transactions_logs
} from '../../../src/db/index.js'
import { ERROE_CODE, OK_CODE } from '../../config/ajax.js'
import { MIN_PRICE } from '../../config/transactions.js'
const router = new koaRouter({ prefix: '/api/v1/transactions' })

router.get('/search/log', async ctx => {
  const UID = ctx.state.user.uid
  const query = ctx.request.query as {
    name: string
    page: string
    pageSize: string
  }
  const obj = {
    uid: UID
  }
  if (typeof query.name == 'string') {
    try {
      obj['name'] = JSON.parse(query.name)
    } catch {
      ctx.body = {
        code: ERROE_CODE,
        msg: '非法请求',
        data: null
      }
      return
    }
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
  await transactions_logs
    .findAndCountAll({
      where: obj,
      limit: pageSize,
      offset: offset,
      raw: true
    })
    .then((res: any) => res)
    .then((res: { count: number; rows: TransactionsLogsType[] }) => {
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
})

router.get('/search', async ctx => {
  const UID = ctx.state.user.uid
  const query = ctx.request.query as {
    name: string
    page: string
    pageSize: string
  }
  const obj = {
    uid: UID
  }
  if (typeof query.name == 'string') {
    try {
      obj['name'] = JSON.parse(query.name)
    } catch {
      ctx.body = {
        code: ERROE_CODE,
        msg: '非法请求',
        data: null
      }
      return
    }
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
  await transactions
    .findAndCountAll({
      where: obj,
      limit: pageSize,
      offset: offset,
      raw: true
    })
    .then((res: any) => res)
    .then((res: { count: number; rows: TransactionsType[] }) => {
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
})

// 上架物品
router.post('/create', async ctx => {
  const body = ctx.request.body as {
    // 物品名
    name: string
    // 数量
    count: number
    // 价格
    price: number
  }
  console.log('body-create', body)
  if (
    !body.name ||
    !body.count ||
    body.count <= 0 ||
    !body.price ||
    body.price <= MIN_PRICE
  ) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '非法请求',
      data: null
    }
    return
  }
  //
  const UID = ctx.state.user.uid

  const error = () => {
    ctx.body = {
      code: ERROE_CODE,
      msg: '数据错误',
      data: null
    }
  }

  // 创建物品  reduce   delete
  const create = async (data: UserBagType, type = 'delete') => {
    await transactions
      .create({
        uid: UID,
        name: body.name,
        count: body.count,
        price: body.price,
        createAt: new Date()
      })
      .then(() => {
        ctx.body = {
          code: OK_CODE,
          msg: '上架成功',
          data: null
        }
      })
      .catch(() => {
        // 恢复被修改的数据
        if (type == 'delete') {
          user_bag.create(data)
        } else {
          user_bag.update(
            {
              acount: data.acount
            },
            {
              where: {
                uid: UID,
                name: body.name
              }
            }
          )
        }
        error()
      })
  }

  // 上架物品，搜索物品
  await user_bag
    .findOne({
      where: {
        uid: UID,
        name: body.name
      },
      raw: true
    })
    .then((res: any) => res)
    .then(async (data: UserBagType) => {
      if (!data) {
        ctx.body = {
          code: ERROE_CODE,
          msg: '不存在该物品',
          body: null
        }
        return
      }
      if (data.acount < body.count) {
        ctx.body = {
          code: ERROE_CODE,
          msg: '数量不足',
          body: null
        }
        return
      } else if (data.acount == body.count) {
        // 直接删除
        await user_bag
          .destroy({
            where: {
              uid: UID,
              name: body.name
            }
          })
          .then(async () => {
            await create(data)
          })
          .catch(error)
        return
      }
      await user_bag
        .update(
          {
            acount: data.acount - body.count
          },
          {
            where: {
              uid: UID,
              name: body.name
            }
          }
        )
        .then(async res => {
          if (res.includes(0)) {
            await create(data, 'reduce')
          } else {
            // 更新错误
            ctx.body = {
              code: ERROE_CODE,
              msg: '扣除错误',
              data: null
            }
          }
        })
        .catch(error)
    })
    .catch(err => {
      console.error(err)
      error()
    })
})

router.post('/delete', async ctx => {
  const body = ctx.request.body as {
    id: number
  }
  console.log('body-delete', body)
  if (!body.id) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '非法请求',
      data: null
    }
    return
  }
  const UID = ctx.state.user.uid
  await transactions
    .destroy({
      where: {
        id: body.id,
        // 必须属于自己的
        uid: UID
      }
    })
    .then(res => {
      if (res == 1) {
        ctx.body = {
          code: OK_CODE,
          msg: '删除完成',
          data: res
        }
      } else {
        ctx.body = {
          code: OK_CODE,
          msg: '未删除',
          data: res
        }
      }
    })
    .catch(err => {
      // 失败
      ctx.body = {
        code: ERROE_CODE,
        msg: '请求失败',
        data: err
      }
    })
})

export default router
