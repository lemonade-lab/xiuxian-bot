import { Messages } from 'alemonjs'
import { operationLock } from 'xiuxian-core'
import { transactions } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)测试$/, async e => {
  // const T = await operationLock(e.user_id)
  // if (!T) {
  //     e.reply('操作频繁')
  //     return
  // }
  // const body = ctx.request.body as {
  //     // 物品名
  //     name: string
  //     // 数量
  //     count: number
  //     // 价格
  //     price: number
  // }
  // try {
  //     body.price = Math.floor(body.price)
  // } catch {
  //     return
  // }
  // console.log('body-create', body)
  // if (
  //     !body.name ||
  //     !body.count ||
  //     body.count <= 0 ||
  //     !body.price ||
  //     body.price < MIN_PRICE ||
  //     body.name == '下品灵石'
  // ) {
  //     ctx.body = {
  //         code: ERROE_CODE,
  //         msg: '非法请求',
  //         data: null
  //     }
  //     return
  // }
  // const UID = ctx.state.user.uid
  // const pSzie = await transactions.count({
  //     where: {
  //         uid: UID
  //     }
  // })
  // console.log('pSzie', pSzie)
  // if (pSzie >= PUSH_SIZE) {
  //     ctx.body = {
  //         code: ERROE_CODE,
  //         msg: `最多上架${PUSH_SIZE}个物品`,
  //         data: null
  //     }
  //     return
  // }
  // if (body.count > MAX_COUNT) {
  //     ctx.body = {
  //         code: ERROE_CODE,
  //         msg: '一次最多上架10个物品',
  //         data: null
  //     }
  //     return
  // }
  // const error = () => {
  //     ctx.body = {
  //         code: ERROE_CODE,
  //         msg: '数据错误',
  //         data: null
  //     }
  // }
  // // 判断物品价格合理性。
  // const gData = await goods
  //     .findOne({
  //         where: {
  //             name: body.name
  //         }
  //     })
  //     .then(res => res?.dataValues)
  // if (!gData) {
  //     error()
  //     return
  // }
  // if (body.price > gData.price * MAX_PRICE_P * body.count) {
  //     ctx.body = {
  //         code: ERROE_CODE,
  //         msg: '你在尝试违规定价,频繁操作,将进行封号处理',
  //         data: null
  //     }
  //     return
  // }
  // // 创建物品  reduce   delete
  // const create = async (data, type = 'delete') => {
  //     await transactions
  //         .create({
  //             uid: UID,
  //             name: body.name,
  //             count: body.count,
  //             price: body.price,
  //             createAt: new Date()
  //         })
  //         .then(() => {
  //             ctx.body = {
  //                 code: OK_CODE,
  //                 msg: '上架成功',
  //                 data: null
  //             }
  //         })
  //         .catch(() => {
  //             // 恢复被修改的数据
  //             if (type == 'delete') {
  //                 user_bag.create(data)
  //             } else {
  //                 user_bag.update(
  //                     {
  //                         acount: data.acount
  //                     },
  //                     {
  //                         where: {
  //                             uid: UID,
  //                             name: body.name
  //                         }
  //                     }
  //                 )
  //             }
  //             error()
  //         })
  // }
  // // 上架物品，搜索物品
  // await user_bag
  //     .findOne({
  //         where: {
  //             uid: UID,
  //             name: body.name
  //         }
  //     })
  //     .then(res => res?.dataValues)
  //     .then(async data => {
  //         if (!data) {
  //             ctx.body = {
  //                 code: ERROE_CODE,
  //                 msg: '不存在该物品',
  //                 body: null
  //             }
  //             return
  //         }
  //         if (data.acount < body.count) {
  //             ctx.body = {
  //                 code: ERROE_CODE,
  //                 msg: '数量不足',
  //                 body: null
  //             }
  //             return
  //         } else if (data.acount == body.count) {
  //             // 直接删除
  //             await user_bag
  //                 .destroy({
  //                     where: {
  //                         uid: UID,
  //                         name: body.name
  //                     }
  //                 })
  //                 .then(async () => {
  //                     await create(data)
  //                 })
  //                 .catch(error)
  //             return
  //         }
  //         const size = data.acount - body.count
  //         console.log('size', size)
  //         await user_bag
  //             .update(
  //                 {
  //                     acount: size
  //                 },
  //                 {
  //                     where: {
  //                         uid: UID,
  //                         name: body.name
  //                     }
  //                 }
  //             )
  //             .then(async res => {
  //                 console.log('res', res)
  //                 if (res.includes(0)) {
  //                     // 更新错误
  //                     ctx.body = {
  //                         code: ERROE_CODE,
  //                         msg: '扣除错误',
  //                         data: null
  //                     }
  //                 } else {
  //                     await create(data, 'reduce')
  //                 }
  //             })
  //             .catch(error)
  //     })
  //     .catch(err => {
  //         console.error(err)
  //         error()
  //     })
})
