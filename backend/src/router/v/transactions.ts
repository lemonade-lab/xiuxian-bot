import koaRouter from 'koa-router'
import {
  type UserBagType,
  transactions,
  user_bag,
  TransactionsType,
  TransactionsLogsType,
  transactions_logs,
  user,
  goods,
  GoodsType
} from 'xiuxian-db'
import { ERROE_CODE, OK_CODE } from '../../config/ajax.js'
import {
  MAX_COUNT,
  MAX_PRICE_P,
  MIN_PRICE,
  PUSH_SIZE
} from '../../config/transactions.js'

import { Op } from 'sequelize'
import { Bag } from 'xiuxian-core'

const router = new koaRouter({ prefix: '/api/v1/transactions' })

const TransactionMap = new Map()

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

router.get('/my', async ctx => {
  const UID = ctx.state.user.uid
  const where = {
    uid: UID
  }
  const error = () => {
    ctx.body = {
      code: ERROE_CODE,
      msg: '数据错误',
      data: null
    }
  }
  await transactions
    .findAndCountAll({
      where: where,
      raw: true
    })
    .then((res: any) => res)
    .then((res: TransactionsType[]) => {
      ctx.body = {
        code: OK_CODE,
        msg: '请求完成',
        data: res
      }
    })
    .catch(error)
})

// 搜素
router.get('/search', async ctx => {
  const query = ctx.request.query as {
    name: string
    page: string
    pageSize: string
  }
  const obj = {}
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

  // 尝试过滤过期物品

  try {
    // 计算过期时间（当前时间减去 3 h）
    const expirationTime = new Date()
    expirationTime.setDate(expirationTime.getDay() - 3)
    // 查询已过期的数据
    const expiredData = await transactions.findAll({
      where: {
        createAt: {
          [Op.lt]: expirationTime // 小于过期时间的数据
        }
      }
    })
    // 删除已过期的数据
    for (const data of expiredData) {
      await data.destroy()
    }
    console.log(`已删除 ${expiredData.length} 条过期数据`)
  } catch (error) {
    console.error('删除过期数据时出错：', error)
  }

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

  try {
    body.price = Math.floor(body.price)
  } catch {
    return
  }

  console.log('body-create', body)
  if (
    !body.name ||
    !body.count ||
    body.count <= 0 ||
    !body.price ||
    body.price < MIN_PRICE ||
    body.name == '下品灵石'
  ) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '非法请求',
      data: null
    }
    return
  }

  const UID = ctx.state.user.uid
  const pSzie = await transactions.count({
    where: {
      uid: UID
    }
  })
  console.log('pSzie', pSzie)
  if (pSzie >= PUSH_SIZE) {
    ctx.body = {
      code: ERROE_CODE,
      msg: `最多上架${PUSH_SIZE}个物品`,
      data: null
    }
    return
  }

  if (body.count > MAX_COUNT) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '一次最多上架10个物品',
      data: null
    }
    return
  }

  const error = () => {
    ctx.body = {
      code: ERROE_CODE,
      msg: '数据错误',
      data: null
    }
  }

  // 判断物品价格合理性。
  const gData: GoodsType = (await goods.findOne({
    where: {
      name: body.name
    },
    raw: true
  })) as any

  if (!gData) {
    error()
    return
  }

  if (body.price > gData.price * MAX_PRICE_P * body.count) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '你在尝试违规定价,频繁操作,将进行封号处理',
      data: null
    }
    return
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

      const size = data.acount - body.count
      console.log('size', size)

      await user_bag
        .update(
          {
            acount: size
          },
          {
            where: {
              uid: UID,
              name: body.name
            }
          }
        )
        .then(async res => {
          console.log('res', res)
          if (res.includes(0)) {
            // 更新错误
            ctx.body = {
              code: ERROE_CODE,
              msg: '扣除错误',
              data: null
            }
          } else {
            await create(data, 'reduce')
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
  if (TransactionMap.has(body.id)) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '请求频繁',
      data: null
    }
    return
  }
  TransactionMap.set(body.id, 0)

  const UID = ctx.state.user.uid
  const bag_grade = ctx.state.user.bag_grade

  const data = (await transactions.findOne({
    where: {
      id: body.id
    },
    raw: true
  })) as any

  console.log('data', data)

  await transactions
    .destroy({
      where: {
        id: body.id,
        // 必须属于自己的
        uid: UID
      }
    })
    .then(res => {
      console.log('res', res)
      if (res == 1) {
        // 还回来。
        Bag.addBagThing(UID, bag_grade, [
          {
            name: data.name,
            acount: data.count
          }
        ])
        ctx.body = {
          code: OK_CODE,
          msg: '删除完成',
          data: 1
        }
      } else {
        ctx.body = {
          code: OK_CODE,
          msg: '下架失败',
          data: 0
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
  TransactionMap.delete(body.id)
  return
})

const TypingItem = {
  '1': '下品灵石',
  '2': '中品灵石',
  '3': '上品灵石',
  '4': '极品灵石'
}

const TypingValue = {
  '1': 1,
  '2': 10,
  '3': 100,
  '4': 1000
}

// 购买
router.post('/buy', async ctx => {
  const body = ctx.request.body as {
    id: number
    typing: number
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
  if (TransactionMap.has(body.id)) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '请求频繁',
      data: null
    }
    return
  }
  TransactionMap.set(body.id, 0)

  // 顺便得到该物品的主人信息
  const data: TransactionsType = (await transactions.findOne({
    where: {
      id: body.id
    },
    include: [
      {
        model: user
      }
    ],
    raw: true
  })) as any

  // 得到该物品的uid
  const UID = ctx.state.user.uid
  const bag_grade = ctx.state.user.bag_grade

  if (data.uid == UID) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '不可购买',
      data: null
    }
    TransactionMap.delete(body.id)
    return
  }

  // 矫正类型
  if (
    !body?.typing ||
    !Object.prototype.hasOwnProperty.call(TypingItem, body.typing)
  ) {
    body.typing = 1
  }

  // 查询下品灵石

  const money: UserBagType = await user_bag
    .findOne({
      where: {
        uid: UID,
        name: TypingItem[body.typing]
      },
      raw: true
    })
    .then((res: any) => res)

  const needMoeny = Math.floor((data.price * 1.1) / TypingValue[body.typing])
  const getMoeny = Math.floor((data.price * 0.9) / TypingValue[body.typing])

  if (money.acount < needMoeny) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '灵石不足',
      data: null
    }
    TransactionMap.delete(body.id)
    return
  }

  await transactions
    .destroy({
      where: {
        id: data.id
      }
    })
    .finally(() => {
      transactions_logs.create({
        ...data,
        updateAt: new Date(),
        deleteAt: new Date()
      })
    })
    .catch(() => {})

  // 扣钱
  await Bag.reduceBagThing(UID, [
    {
      name: TypingItem[body.typing],
      acount: needMoeny
    }
  ])

  // 加物品
  await Bag.addBagThing(UID, bag_grade, [
    {
      name: data.name,
      acount: data.count
    }
  ])

  // 得到收益
  await Bag.addBagThing(data.uid, data['user.bag_grade'], [
    {
      name: TypingItem[body.typing],
      acount: getMoeny
    }
  ])

  ctx.body = {
    code: OK_CODE,
    msg: '购买成功',
    data: 1
  }

  TransactionMap.delete(body.id)
  return
})

export default router
