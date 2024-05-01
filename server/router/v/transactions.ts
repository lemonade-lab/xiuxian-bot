import koaRouter from 'koa-router'
import {
  type UserBagType,
  transactions,
  user_bag
} from '../../../src/db/index.js'
import { ERROE_CODE, OK_CODE } from '../../config/ajax.js'
import { MIN_PRICE } from '../../config/transactions.js'
const router = new koaRouter({ prefix: '/api/v1/transactions' })

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
  console.log('body', body)
  if (
    !body.name ||
    !body.count ||
    body.count <= 0 ||
    !body.price ||
    body.price <= MIN_PRICE ||
    typeof body.name != 'string' ||
    typeof body.count != 'number' ||
    typeof body.price != 'number'
  ) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '非法请求'
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
    .catch(error)
})

export default router
